import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  AppState, 
  loadPersistedState, 
  persistState, 
  Student, 
  SessionDefinition, 
  getSessionKey, 
  generateId,
  DEFAULT_STATE
} from '../data/store';

type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'ADD_STUDENT'; payload: { name: string; username: string; passcode: string } }
  | { type: 'REMOVE_STUDENT'; payload: string }
  | { type: 'UPDATE_STUDENT'; payload: { id: string; updates: Partial<Student> } }
  | { type: 'UPDATE_MASTERY'; payload: { studentId: string; surahNum: number; sessionIdx: number; updates: any } }
  | { type: 'MARK_ATTENDANCE'; payload: { studentId: string; date: string; status: any } }
  | { type: 'IMPORT_CURRICULUM'; payload: SessionDefinition[] }
  | { type: 'UPDATE_SESSION'; payload: { key: string; updates: Partial<SessionDefinition> } }
  | { type: 'SET_ADMIN_AUTH'; payload: boolean };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, settings: { ...state.settings, theme: action.payload } };
      
    case 'ADD_STUDENT': {
      const newStudent: Student = {
        id: generateId(),
        name: action.payload.name,
        username: action.payload.username,
        passcode: action.payload.passcode,
        joinedAt: new Date().toISOString(),
        notes: ''
      };
      return { ...state, students: [...state.students, newStudent] };
    }

    case 'REMOVE_STUDENT':
      return { ...state, students: state.students.filter(s => s.id !== action.payload) };

    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s)
      };

    case 'UPDATE_MASTERY': {
      const { studentId, surahNum, sessionIdx, updates } = action.payload;
      const key = getSessionKey(surahNum, sessionIdx);
      const studentMastery = state.mastery[studentId] || {};
      const current = studentMastery[key] || { listens: 0, pdfViewed: false, quizPassed: false, mastered: false };
      
      const merged = { ...current, ...updates };
      
      // Auto-mastery logic: 3 listens + PDF Viewed + (if quiz exists, passed)
      // For now, simple logic:
      const mastered = merged.listens >= 3 && merged.pdfViewed;
      
      return {
        ...state,
        mastery: {
          ...state.mastery,
          [studentId]: {
            ...studentMastery,
            [key]: { ...merged, mastered, masteredAt: mastered ? new Date().toISOString() : undefined }
          }
        }
      };
    }

    case 'MARK_ATTENDANCE': {
      const { studentId, date, status } = action.payload;
      return {
        ...state,
        attendance: {
          ...state.attendance,
          [studentId]: {
            ...(state.attendance[studentId] || {}),
            [date]: status
          }
        }
      };
    }

    case 'IMPORT_CURRICULUM': {
      const newCurriculum = { ...state.curriculum };
      action.payload.forEach(sess => {
        const key = getSessionKey(sess.surahNum, sess.sessionIndex);
        newCurriculum[key] = { ...newCurriculum[key], ...sess };
      });
      return { ...state, curriculum: newCurriculum };
    }

    case 'UPDATE_SESSION': {
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          [action.payload.key]: {
            ...state.curriculum[action.payload.key],
            ...action.payload.updates
          }
        }
      };
    }

    default:
      return state;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE, (initial) => {
    return loadPersistedState() || initial;
  });

  useEffect(() => {
    persistState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within an AppStateProvider');
  return context;
}
