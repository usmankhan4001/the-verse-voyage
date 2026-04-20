// ── The Verse Voyage: Robust Store v2.0.0 ──

export interface Student {
  id: string;
  name: string;
  username: string;
  passcode: string;
  joinedAt: string;
  notes: string;
}

export interface SessionMastery {
  listens: number;
  pdfViewed: boolean;
  quizScore?: number;
  quizPassed: boolean;
  mastered: boolean;
  masteredAt?: string;
}

export interface SessionDefinition {
  surahNum: number;
  sessionIndex: number;
  topic: string;
  tafseerSummary: string;
  startAyah: number;
  endAyah: number;
  pdfUrl?: string;
  videoUrl?: string; // Optional
  tafseerAudioUrl?: string; // Optional
  ayatAudioUrl?: string; // Legacy/Fallback
  isPublished: boolean;
}

export interface AttendanceRecord {
  [studentId: string]: {
    [date: string]: 'present' | 'absent' | 'late' | 'pending';
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  currentPhase: number;
  unlockedPhase: number;
  courseName: string;
  teacherName: string;
  adminPasscode: string;
}

export interface AppState {
  version: "2.0.0";
  lastSync: string;
  students: Student[];
  curriculum: { [key: string]: SessionDefinition }; // "surahNum-sessionIndex"
  testSessions: { [key: string]: boolean }; // Global teacher-level "completed" flag
  mastery: { [studentId: string]: { [sessionKey: string]: SessionMastery } };
  attendance: AttendanceRecord;
  settings: AppSettings;
}

const STORAGE_KEY = 'verse-voyage-v2';

export const DEFAULT_STATE: AppState = {
  version: "2.0.0",
  lastSync: new Date().toISOString(),
  students: [],
  curriculum: {},
  testSessions: {},
  mastery: {},
  attendance: {},
  settings: {
    theme: 'system',
    currentPhase: 1,
    unlockedPhase: 1,
    courseName: 'The Verse Voyage',
    teacherName: '',
    adminPasscode: 'admin123'
  },
};

// ── Persistence Layer ──

export function loadPersistedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    
    const parsed = JSON.parse(raw);
    
    // Migration logic can be added here if version changes
    if (parsed.version !== "2.0.0") {
      console.warn("Schema mismatch. Resetting to version 2.0.0");
      return DEFAULT_STATE;
    }
    
    return { ...DEFAULT_STATE, ...parsed };
  } catch (err) {
    console.error("Failed to load state:", err);
    return DEFAULT_STATE;
  }
}

export function persistState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      lastSync: new Date().toISOString()
    }));
  } catch (err) {
    console.error("Failed to persist state:", err);
  }
}

// ── Shared Utilities ──

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
}

export function getSessionKey(surahNum: number, sessionIndex: number): string {
  return `${surahNum}-${sessionIndex}`;
}

export function getMastery(state: AppState, studentId: string, surahNum: number, sessionIndex: number): SessionMastery {
  const key = getSessionKey(surahNum, sessionIndex);
  return state.mastery[studentId]?.[key] || {
    listens: 0,
    pdfViewed: false,
    quizPassed: false,
    mastered: false
  };
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isSessionLocked(state: AppState, studentId: string, surahNum: number, sessionIdx: number): boolean {
  if (sessionIdx === 0) return false; // First session is always unlocked
  const prevKey = getSessionKey(surahNum, sessionIdx - 1);
  return !state.mastery[studentId]?.[prevKey]?.mastered;
}
