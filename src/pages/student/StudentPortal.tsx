import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, 
  ChevronRight, 
  Moon, 
  Sun, 
  Lock, 
  FileText, 
  Play,
  LogOut,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  X,
  Download,
  Check,
  User,
  Key,
  Gamepad2,
  Sparkles
} from 'lucide-react';
import UserGuide from '../UserGuide';
import { surahs, phaseInfo, getSurahsByPhase, getTotalSessions } from '../../data/surahs';
import type { AppState, Student, StudentProgress } from '../../data/store';
import { sessionKey } from '../../data/store';
import { useOffline } from '../../hooks/useOffline';
import './StudentPortal.css';

interface StudentPortalProps {
  state: AppState;
  registerStudent: (name: string, username: string, passcode: string) => { success: boolean; message?: string };
  updateStudentProgress: (studentId: string, surahNum: number, sessionIndex: number, updates: Partial<StudentProgress>) => void;
  recordQuizSubmission: (studentId: string, quizId: string, score: number) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function StudentPortal({ 
  state, 
  registerStudent, 
  updateStudentProgress,
  recordQuizSubmission,
  resolvedTheme, 
  toggleTheme 
}: StudentPortalProps) {
  const { cacheAsset, isCached, isSyncing } = useOffline();
  
  // ── Auth State ──
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem('sp_user_id');
    return state.students.find(s => s.id === saved) || null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ name: '', username: '', passcode: '' });
  const [authError, setAuthError] = useState('');

  // ── Portal State ──
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [viewingSession, setViewingSession] = useState<{ surahNum: number, idx: number } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // ── Audio Player State ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Clear auth error when switching modes
    const timer = setTimeout(() => setAuthError(''), 0);
    return () => clearTimeout(timer);
  }, [authMode]);

  // ── Auth Handlers ──
  const handleLogin = () => {
    const user = state.students.find(s => s.username === authData.username && s.passcode === authData.passcode);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('sp_user_id', user.id);
    } else {
      setAuthError('Invalid username or passcode');
    }
  };

  const handleRegister = () => {
    if (!authData.name || !authData.username || !authData.passcode) {
      setAuthError('Please fill all fields');
      return;
    }
    const res = registerStudent(authData.name, authData.username, authData.passcode);
    if (res.success) {
      const user = state.students.find(s => s.username === authData.username);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('sp_user_id', user.id);
      }
    } else {
      setAuthError(res.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sp_user_id');
    setViewingSession(null);
  };

  // ── Session Logic ──
  useEffect(() => {
    if (viewingSession) {
      const surah = surahs.find(s => s.num === viewingSession.surahNum);
      const defaultSess = surah?.defaultSessions?.[viewingSession.idx];
      const sessMap = state.sessionProgress[sessionKey(viewingSession.surahNum, viewingSession.idx)];
      const sess = { ...defaultSess, ...sessMap };

      if (sess.startAyah && sess.endAyah) {
        const urls: string[] = [];
        for (let a = sess.startAyah; a <= sess.endAyah; a++) {
          const s = String(viewingSession.surahNum).padStart(3, '0');
          const v = String(a).padStart(3, '0');
          urls.push(`https://everyayah.com/data/Husary_Mujawwad_64kbps/${s}${v}.mp3`);
        }
        // Use functional update to avoid direct setState in effect
        setTimeout(() => {
          setPlaylist(urls);
          setCurrentTrackIdx(0);
          setIsPlaying(false);
        }, 0);
      }
    }
  }, [viewingSession, state.sessionProgress]);

  const onAudioEnded = () => {
    if (currentTrackIdx < playlist.length - 1) {
      setCurrentTrackIdx(prev => prev + 1);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      setIsPlaying(false);
      setCurrentTrackIdx(0);
      if (currentUser && viewingSession) {
        const key = sessionKey(viewingSession.surahNum, viewingSession.idx);
        const cur = state.studentProgress[currentUser.id]?.[key];
        updateStudentProgress(currentUser.id, viewingSession.surahNum, viewingSession.idx, {
          audioListens: (cur?.audioListens || 0) + 1
        });
      }
    }
  };

  const getProgress = (num: number, idx: number) => {
    if (!currentUser) return null;
    return state.studentProgress[currentUser.id]?.[sessionKey(num, idx)] || {
      audioListens: 0,
      pdfRead: false,
      quizCompleted: false,
      completed: false
    };
  };

  // ── Auth View Redesign ──
  if (!currentUser) {
    return (
      <div className="sp sp--auth">
        <div className="sp__auth-bg">
           <div className="landing__glow landing__glow--1" />
           <div className="landing__glow landing__glow--2" />
        </div>
        
        <motion.div 
          className="sp__auth-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img src="/logo.png" alt="Logo" className="sp__auth-logo" />
          <div className="sp__auth-header">
            <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{authMode === 'login' ? 'Sign in to continue your voyage' : 'Join the Juz Amma Mastery program'}</p>
          </div>

          {authError && <div className="sp__auth-error">{authError}</div>}

            <div className="sp__auth-form">
            {authMode === 'register' && (
              <div className="sp__field">
                <User size={18} />
                <input type="text" placeholder="Full Name" value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} />
              </div>
            )}
            <div className="sp__field">
              <Sparkles size={18} />
              <input type="text" placeholder="Username" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} />
            </div>
            <div className="sp__field">
              <Key size={18} />
              <input type="password" placeholder="Passcode (e.g. 1234)" value={authData.passcode} onChange={e => setAuthData({...authData, passcode: e.target.value})} />
            </div>

            <button className="sp__auth-btn" onClick={authMode === 'login' ? handleLogin : handleRegister}>
              {authMode === 'login' ? 'Sign In' : 'Register Now'}
            </button>

            <button className="sp__auth-switch" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? "Don't have an account? Join Now" : "Already a student? Login"}
            </button>

            <div className="sp__auth-gateway">
              <button 
                className="sp__gateway-btn" 
                onClick={() => window.location.href = '/admin'}
              >
                Teacher Gateway
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Session View ──
  if (viewingSession) {
    const surah = surahs.find(s => s.num === viewingSession.surahNum)!;
    const defaultSess = surah.defaultSessions?.[viewingSession.idx];
    const sessMap = state.sessionProgress[sessionKey(viewingSession.surahNum, viewingSession.idx)];
    const sess = { ...defaultSess, ...sessMap };
    const prog = getProgress(viewingSession.surahNum, viewingSession.idx)!;

    // Google Drive Viewer Helper
    const getViewerUrl = (url: string) => {
      if (url.includes('drive.google.com')) {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      }
      return url;
    };

    return (
      <div className="sp">
        <header className="sp__header">
          <button className="sp__back-btn" onClick={() => setViewingSession(null)}><ChevronLeft /></button>
          <div className="sp__header-title">Session {viewingSession.idx + 1}</div>
          <div className="sp__placeholder" />
        </header>

        <div className="sp__session-hero">
           <div className="arabic">{surah.arabic}</div>
           <h2>{sess.topic || surah.name}</h2>
           <p>Mastery Checklist: 3 Listens + Read PDF + Quiz</p>
        </div>

        <div className="sp__progress-hud">
          <div className={`sp__hud-item ${prog.audioListens >= 3 ? 'done' : 'active'}`}>
            <Headphones size={18} />
            <div className="sp__hud-text">
               <span>Listen Cycle</span>
               <small>{Math.min(prog.audioListens, 3)}/3</small>
            </div>
          </div>
          <div className={`sp__hud-item ${prog.pdfRead ? 'done' : ''}`}>
            <FileText size={18} />
            <div className="sp__hud-text">
               <span>PDF Study</span>
               <small>{prog.pdfRead ? 'Complete' : 'Pending'}</small>
            </div>
          </div>
        </div>

        <div className="sp__session-body">
          <div className="sp__player-card">
            <div className="sp__section-header">
              <h4 className="sp__section-label">Recitation</h4>
              {sess.tafseerAudioUrl && (
                <button className={`sp__download-mini ${isCached(sess.tafseerAudioUrl) ? 'cached' : ''}`} onClick={() => cacheAsset(sess.tafseerAudioUrl!)} disabled={isSyncing}>
                  {isCached(sess.tafseerAudioUrl) ? <Check size={14} /> : <Download size={14} />}
                </button>
              )}
            </div>
            <button className="sp__play-btn" onClick={() => (isPlaying ? audioRef.current?.pause() : audioRef.current?.play())}>
              {isPlaying ? 'Pause' : <Play fill="currentColor" />}
            </button>
            <audio ref={audioRef} src={playlist[currentTrackIdx]} onEnded={onAudioEnded} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
          </div>

          <div className="sp__tafseer-card">
              <h4 className="sp__section-label">Urdu Tafseer</h4>
              <div className="sp__tafseer-text urdu" dir="rtl">
                 {sess.tafseerSummary || 'اس سیشن کی تفسیر ابھی دستیاب نہیں ہے۔'}
              </div>
          </div>

          <div className="sp__res-grid">
            {sess.pdfUrl && (
              <div className="sp__res-item-wrapper">
                 <button className="sp__res-card" onClick={() => {
                   setPdfUrl(sess.pdfUrl!);
                   updateStudentProgress(currentUser.id, viewingSession.surahNum, viewingSession.idx, { pdfRead: true });
                 }}>
                    <div className="sp__res-icon pdf"><FileText /></div>
                    <div className="sp__res-info">
                      <span>Lesson PDF</span>
                      <small>Built-in Reader</small>
                    </div>
                    {prog.pdfRead ? <CheckCircle2 size={16} className="text-success" /> : <ExternalLink size={14} />}
                 </button>
                 <button className={`sp__res-download ${isCached(sess.pdfUrl) ? 'cached' : ''}`} onClick={() => cacheAsset(sess.pdfUrl!)} disabled={isSyncing}>
                    {isCached(sess.pdfUrl) ? <Check size={14} /> : <Download size={14} />}
                 </button>
              </div>
            )}
          </div>

          <div className="sp__quiz-section">
             <button 
               className={`sp__quiz-btn ${prog.completed ? 'completed' : ''}`}
               disabled={!prog.pdfRead || prog.audioListens < 3}
               onClick={() => {
                  const quiz = state.quizzes.find(q => q.surahNum === viewingSession.surahNum);
                  if (quiz) recordQuizSubmission(currentUser.id, quiz.id, 100);
                  else updateStudentProgress(currentUser.id, viewingSession.surahNum, viewingSession.idx, { quizCompleted: true });
               }}
             >
               {prog.completed ? <CheckCircle2 /> : <Gamepad2 size={18} />}
               {prog.completed ? 'Mastered' : (!prog.pdfRead || prog.audioListens < 3) ? 'Unlock Quiz via Study' : 'Master This Session'}
             </button>
          </div>
        </div>

        <AnimatePresence>
          {pdfUrl && (
            <motion.div 
              className="sp__pdf-modal" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 30 }}
            >
               <div className="sp__pdf-header">
                  <h3>Lesson Guide</h3>
                  <button onClick={() => setPdfUrl(null)} className="sp__pdf-close"><X /></button>
               </div>
               <div className="sp__pdf-body">
                  <iframe src={getViewerUrl(pdfUrl)} title="Viewer" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Main View ──
  const progressPctCount = Object.values(state.studentProgress[currentUser.id] || {}).filter(p => p.completed).length;
  const progressPct = Math.round((progressPctCount / getTotalSessions()) * 100);

  return (
    <div className="sp">
       <header className="sp__header">
          <div className="sp__header-brand">
             <img src="/logo.png" alt="Logo" />
             <div>
                <div className="sp__brand-title">{currentUser.name}</div>
                <div className="sp__brand-sub">Stage: {phaseInfo[activePhase - 1].name}</div>
             </div>
          </div>
          <div className="sp__header-actions">
             <button className="sp__icon-btn" onClick={() => setShowGuide(true)}>
                <HelpCircle size={20} />
             </button>
             <button className="sp__icon-btn" onClick={toggleTheme}>
                {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button className="sp__icon-btn" onClick={handleLogout}><LogOut size={20} /></button>
          </div>
       </header>

       <div className="sp__hero">
          <div className="arabic">الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ</div>
          <div className="sp__hero-stats">
             <div className="sp__stat">
                <strong>{progressPct}%</strong>
                <small>Overall Progress</small>
             </div>
             <div className="sp__stat">
                <strong>{getTotalSessions()}</strong>
                <small>Total Sessions</small>
             </div>
          </div>
       </div>

       <div className="sp__tabs-container">
          <div className="sp__tabs">
             {phaseInfo.map(p => (
               <button key={p.phase} className={`sp__tab ${activePhase === p.phase ? 'sp__tab--active' : ''}`} onClick={() => setActivePhase(p.phase)}>
                  {p.label}
               </button>
             ))}
          </div>
       </div>

       <div className="sp__content">
          {getSurahsByPhase(activePhase).map(surah => {
            const isOpen = expandedSurah === surah.num;
            return (
              <div key={surah.num} className="sp__surah-box">
                <button className={`sp__surah ${isOpen ? 'sp__surah--open' : ''}`} onClick={() => setExpandedSurah(isOpen ? null : surah.num)}>
                   <div className="sp__surah-num">#{surah.num}</div>
                   <div className="sp__surah-en">{surah.name}</div>
                   <div className="sp__surah-ar arabic">{surah.arabic}</div>
                   <ChevronRight style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div className="sp__sessions" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                      {Array.from({ length: surah.sessions }).map((_, idx) => {
                        const sessProg = getProgress(surah.num, idx)!;
                        const locked = idx > 0 && !getProgress(surah.num, idx - 1)?.completed;
                        return (
                          <div key={idx} className={`sp__session-item ${sessProg.completed ? 'sp__session-item--done' : ''} ${locked ? 'sp__session-item--locked' : ''}`}
                               onClick={() => !locked && setViewingSession({ surahNum: surah.num, idx })}>
                             <div className="sp__session-bubble">
                               {locked ? <Lock size={12} /> : sessProg.completed ? <Check size={12} /> : idx + 1}
                             </div>
                             <div className="sp__session-info">
                                <span>Session {idx + 1}</span>
                                <small>{sessProg.completed ? 'Mastered' : locked ? 'Locked' : 'In Progress'}</small>
                             </div>
                             {!locked && <ChevronRight size={14} />}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
       </div>

       <AnimatePresence>
         {showGuide && (
           <motion.div className="sp__modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGuide(false)}>
              <motion.div className="sp__modal" onClick={e => e.stopPropagation()} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
                  <div className="sp__modal-header">
                     <h3>Student Guide</h3>
                     <button onClick={() => setShowGuide(false)}><X /></button>
                  </div>
                  <div className="sp__modal-content">
                     <UserGuide />
                  </div>
              </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
