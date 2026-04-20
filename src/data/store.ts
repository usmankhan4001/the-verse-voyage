// ── Offline-first localStorage persistence layer ──

export interface Student {
  id: string;
  name: string;
  username: string;
  passcode: string;
  joinedAt: string;
  notes: string;
}

export interface AttendanceRecord {
  [studentId: string]: {
    [date: string]: 'present' | 'absent' | 'pending';
  };
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'fill_blank' | 'reflection';
  question: string;
  options?: string[];
  answer: string;
}

export interface Quiz {
  id: string;
  surahNum: number;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface SessionStatus {
  surahNum: number;
  sessionIndex: number;
  completed: boolean;
  completedAt?: string;
  topic?: string;
  tafseerSummary?: string;
  startAyah?: number;
  endAyah?: number;
  pdfUrl?: string;
  videoUrl?: string;
  tafseerAudioUrl?: string;
  ayatAudioUrl?: string; // Legacy/Fallback
  contentChecklist: {
    arabicCard: boolean;
    audio: boolean;
    wordByWord: boolean;
    tafseer: boolean;
    posted: boolean;
  };
}

export interface StudentProgress {
  studentId: string;
  sessionKey: string; // "surahNum-sessionIndex"
  audioListens: number;
  pdfRead: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  completed: boolean;
}

export interface QuizSubmission {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  submittedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  currentPhase: number;
  unlockedPhase: number;
  courseName: string;
  teacherName: string;
}

export interface AppState {
  students: Student[];
  attendance: AttendanceRecord;
  sessionProgress: { [key: string]: SessionStatus }; // Teacher's global check
  studentProgress: { [studentId: string]: { [sessionKey: string]: StudentProgress } }; // Individual student tracking
  quizSubmissions: QuizSubmission[];
  quizzes: Quiz[];
  teacherNotes: { [surahNum: string]: string };
  settings: AppSettings;
}

const STORAGE_KEY = 'juz-amma-cms';

const defaultState: AppState = {
  students: [],
  attendance: {},
  sessionProgress: {
    '99-0': {
      surahNum: 99,
      sessionIndex: 0,
      completed: true,
      topic: 'The Great Earthquake',
      tafseerSummary: 'جب زمین اپنی پوری سختی سے ہلا دی جائے گی اور زمین اپنے بوجھ نکال باہر پھینک دے گی۔ یہ سورت قیامت کے دن کے زبردست انقلاب اور انسان کے اعمال کی حتمی جوابدہی کو بیان کرتی ہے۔',
      startAyah: 1,
      endAyah: 5,
      pdfUrl: 'https://www.searchforislam.com/wp-content/uploads/2019/02/099-Az-Zalzalah.pdf',
      contentChecklist: {
        arabicCard: true,
        audio: true,
        wordByWord: true,
        tafseer: true,
        posted: true,
      }
    }
  },
  studentProgress: {},
  quizSubmissions: [],
  quizzes: [],
  teacherNotes: {},
  settings: {
    theme: 'system',
    currentPhase: 1,
    unlockedPhase: 1,
    courseName: 'The Verse Voyage',
    teacherName: '',
  },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function exportData(): string {
  const state = loadState();
  return JSON.stringify(state, null, 2);
}

export function importData(json: string): AppState | null {
  try {
    const parsed = JSON.parse(json);
    saveState(parsed);
    return parsed;
  } catch {
    return null;
  }
}

// ── Helper: generate unique IDs ──
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ── Helper: get session key ──
export function sessionKey(surahNum: number, sessionIndex: number): string {
  return `${surahNum}-${sessionIndex}`;
}

// ── Helper: calculate streak ──
export function calculateStreak(
  studentId: string,
  attendance: AttendanceRecord
): number {
  const records = attendance[studentId];
  if (!records) return 0;
  
  const dates = Object.keys(records).sort().reverse();
  let streak = 0;
  
  for (const date of dates) {
    if (records[date] === 'present') {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// ── Helper: check at-risk ──
export function isAtRisk(
  studentId: string,
  attendance: AttendanceRecord
): boolean {
  const records = attendance[studentId];
  if (!records) return false;
  
  const dates = Object.keys(records).sort().reverse();
  let consecutiveMisses = 0;
  
  for (const date of dates) {
    if (records[date] === 'absent') {
      consecutiveMisses++;
      if (consecutiveMisses >= 3) return true;
    } else {
      break;
    }
  }
  
  return false;
}

// ── Helper: format date ──
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
