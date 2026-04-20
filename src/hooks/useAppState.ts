import { useState, useCallback } from 'react';
import type { AppState, Student, Quiz, SessionStatus } from '../data/store';
import {
  loadState,
  saveState,
  generateId,
  sessionKey,
} from '../data/store';

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // ── Students ──
  const addStudent = useCallback((name: string, username?: string, passcode?: string) => {
    updateState(prev => ({
      ...prev,
      students: [
        ...prev.students,
        { 
          id: generateId(), 
          name, 
          username: username || name.toLowerCase().replace(/\s+/g, ''),
          passcode: passcode || '1234',
          joinedAt: new Date().toISOString(), 
          notes: '' 
        },
      ],
    }));
  }, [updateState]);

  const registerStudent = useCallback((name: string, username: string, passcode: string) => {
    // Check if username exists
    const exists = loadState().students.some(s => s.username === username);
    if (exists) return { success: false, message: 'Username already taken' };

    addStudent(name, username, passcode);
    return { success: true };
  }, [addStudent]);

  const removeStudent = useCallback((id: string) => {
    updateState(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
    }));
  }, [updateState]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    updateState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [updateState]);

  // ── Student Progress (Compulsory Tracking) ──
  const updateStudentProgress = useCallback(
    (studentId: string, surahNum: number, sessionIndex: number, updates: Partial<AppState['studentProgress'][string][string]>) => {
      const key = sessionKey(surahNum, sessionIndex);
      updateState(prev => {
        const studentMap = prev.studentProgress[studentId] || {};
        const existing = studentMap[key] || {
          studentId,
          sessionKey: key,
          audioListens: 0,
          pdfRead: false,
          quizCompleted: false,
          completed: false,
        };

        const merged = { ...existing, ...updates };
        
        // Automation Logic: Session is completed if Listens >= 3 AND PDF Read 
        // Note: Quiz completion can also be a factor if a quiz exists for this surah/session
        const hasQuiz = prev.quizzes.some(q => q.surahNum === surahNum);
        const autoCompleted = merged.audioListens >= 3 && merged.pdfRead && (!hasQuiz || merged.quizCompleted);

        return {
          ...prev,
          studentProgress: {
            ...prev.studentProgress,
            [studentId]: {
              ...studentMap,
              [key]: { ...merged, completed: autoCompleted },
            },
          },
        };
      });
    },
    [updateState]
  );

  const recordQuizSubmission = useCallback(
    (studentId: string, quizId: string, score: number) => {
      // Find the quiz to know which surah it belongs to
      const state = loadState();
      const quiz = state.quizzes.find(q => q.id === quizId);
      
      updateState(prev => ({
        ...prev,
        quizSubmissions: [
          ...prev.quizSubmissions,
          { id: generateId(), studentId, quizId, score, submittedAt: new Date().toISOString() },
        ],
      }));

      if (quiz) {
        // Automatically mark quiz as completed for this session (usually first session of surah)
        updateStudentProgress(studentId, quiz.surahNum, 0, { quizCompleted: true });
      }
    },
    [updateState, updateStudentProgress]
  );

  // ── Attendance ──
  const markAttendance = useCallback(
    (studentId: string, date: string, status: 'present' | 'absent' | 'pending') => {
      updateState(prev => ({
        ...prev,
        attendance: {
          ...prev.attendance,
          [studentId]: {
            ...(prev.attendance[studentId] || {}),
            [date]: status,
          },
        },
      }));
    },
    [updateState]
  );

  // ── Sessions ──
  const importSessionsFromCSV = useCallback((sessions: Partial<SessionStatus>[]) => {
    updateState(prev => {
      const newProgress = { ...prev.sessionProgress };
      sessions.forEach(sess => {
        if (sess.surahNum !== undefined && sess.sessionIndex !== undefined) {
          const key = sessionKey(sess.surahNum, sess.sessionIndex);
          const existingContent = newProgress[key]?.contentChecklist || {};
          const incomingContent = sess.contentChecklist || {};

          const defaultContent = {
            arabicCard: true,
            audio: !!sess.ayatAudioUrl,
            wordByWord: true,
            tafseer: !!sess.tafseerSummary,
            posted: true,
          };

          newProgress[key] = {
            ...newProgress[key],
            ...sess,
            surahNum: sess.surahNum,
            sessionIndex: sess.sessionIndex,
            completed: true,
            contentChecklist: {
              ...defaultContent,
              ...existingContent,
              ...incomingContent,
            },
          };
        }
      });
      return { ...prev, sessionProgress: newProgress };
    });
  }, [updateState]);

  const updateSessionProgress = useCallback(
    (surahNum: number, sessionIndex: number, updates: Partial<SessionStatus>) => {
      const key = sessionKey(surahNum, sessionIndex);
      updateState(prev => {
        const existing = prev.sessionProgress[key];
        return {
          ...prev,
          sessionProgress: {
            ...prev.sessionProgress,
            [key]: {
              surahNum: existing?.surahNum ?? surahNum,
              sessionIndex: existing?.sessionIndex ?? sessionIndex,
              completed: existing?.completed ?? false,
              contentChecklist: existing?.contentChecklist ?? {
                arabicCard: false,
                audio: false,
                wordByWord: false,
                tafseer: false,
                posted: false,
              },
              ...updates,
            },
          },
        };
      });
    },
    [updateState]
  );

  const completeSession = useCallback(
    (surahNum: number, sessionIndex: number) => {
      updateSessionProgress(surahNum, sessionIndex, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
    },
    [updateSessionProgress]
  );

  // ── Quizzes ──
  const addQuiz = useCallback((quiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    updateState(prev => ({
      ...prev,
      quizzes: [
        ...prev.quizzes,
        { ...quiz, id: generateId(), createdAt: new Date().toISOString() },
      ],
    }));
  }, [updateState]);

  const removeQuiz = useCallback((id: string) => {
    updateState(prev => ({
      ...prev,
      quizzes: prev.quizzes.filter(q => q.id !== id),
    }));
  }, [updateState]);

  // ── Notes ──
  const setTeacherNote = useCallback((surahNum: number, note: string) => {
    updateState(prev => ({
      ...prev,
      teacherNotes: { ...prev.teacherNotes, [surahNum]: note },
    }));
  }, [updateState]);

  // ── Settings ──
  const updateSettings = useCallback((updates: Partial<AppState['settings']>) => {
    updateState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, [updateState]);

  // ── Computed values ──
  const completedSessions = Object.values(state.sessionProgress).filter(s => s.completed).length;

  const completedSurahNums = new Set<number>();
  for (const s of Object.values(state.sessionProgress)) {
    if (s.completed) {
      completedSurahNums.add(s.surahNum);
    }
  }

  return {
    state,
    addStudent,
    registerStudent,
    removeStudent,
    updateStudent,
    markAttendance,
    updateSessionProgress,
    completeSession,
    updateStudentProgress,
    recordQuizSubmission,
    importSessionsFromCSV,
    addQuiz,
    removeQuiz,
    setTeacherNote,
    updateSettings,
    completedSessions,
    completedSurahNums,
  };
}
