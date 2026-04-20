import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, 
  ChevronRight, 
  Moon, 
  Sun, 
  Lock, 
  Play,
  LogOut,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  X,
  Download,
  Gamepad2,
  User
} from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { surahs, phaseInfo, getSurahsByPhase, getTotalSessions } from '../../data/surahs';
import { getSessionKey, getMastery, isSessionLocked, Student } from '../../data/store';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

export default function StudentPortal() {
  const { state, dispatch } = useAppState();
  
  // ── Auth State ──
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem('vv_student_id');
    return state.students.find(s => s.id === saved) || null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ name: '', username: '', passcode: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // ── Portal State ──
  const [activePhase, setActivePhase] = useState(1);
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  const [viewingSession, setViewingSession] = useState<{ surahNum: number, idx: number } | null>(null);

  // ── Audio Player State ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleTheme = () => {
    const next = state.settings.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', payload: next });
  };

  // ── Auth Handlers ──
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    setTimeout(() => {
      if (authMode === 'login') {
        const user = state.students.find(s => s.username === authData.username && s.passcode === authData.passcode);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('vv_student_id', user.id);
        } else {
          setAuthError('Invalid credentials. Check your username/passcode.');
        }
      } else {
        if (!authData.name || !authData.username || !authData.passcode) {
          setAuthError('All fields are required');
        } else if (state.students.some(s => s.username === authData.username)) {
          setAuthError('Username already taken');
        } else {
          dispatch({ type: 'ADD_STUDENT', payload: { ...authData } });
          setAuthMode('login');
          setAuthError('Registration successful! Please login.');
        }
      }
      setIsAuthenticating(false);
    }, 800);
  };

  const handleLogout = () => {
    if (confirm('Logout of your voyage?')) {
      setCurrentUser(null);
      localStorage.removeItem('vv_student_id');
    }
  };

  // ── Audio Logic ──
  useEffect(() => {
    if (viewingSession) {
      const surah = surahs.find(s => s.num === viewingSession.surahNum);
      const sessIdx = viewingSession.idx;
      const urls: string[] = [];
      const start = (surah?.defaultSessions?.[sessIdx]?.startAyah) || 1;
      const end = (surah?.defaultSessions?.[sessIdx]?.endAyah) || 1;

      for (let a = start; a <= end; a++) {
        const s = String(viewingSession.surahNum).padStart(3, '0');
        const v = String(a).padStart(3, '0');
        urls.push(`https://everyayah.com/data/Husary_Mujawwad_64kbps/${s}${v}.mp3`);
      }
      setPlaylist(urls);
      setCurrentTrackIdx(0);
      setIsPlaying(false);
    }
  }, [viewingSession]);

  const onAudioEnded = () => {
    if (currentTrackIdx < playlist.length - 1) {
      setCurrentTrackIdx(prev => prev + 1);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      setIsPlaying(false);
      if (currentUser && viewingSession) {
        const currentM = getMastery(state, currentUser.id, viewingSession.surahNum, viewingSession.idx);
        dispatch({ 
          type: 'UPDATE_MASTERY', 
          payload: { 
            studentId: currentUser.id, 
            surahNum: viewingSession.surahNum, 
            sessionIdx: viewingSession.idx,
            updates: { listens: currentM.listens + 1 }
          }
        });
      }
    }
  };

  // ── Mastery Actions ──
  const handlePdfView = () => {
    if (!currentUser || !viewingSession) return;
    dispatch({
      type: 'UPDATE_MASTERY',
      payload: {
        studentId: currentUser.id,
        surahNum: viewingSession.surahNum,
        sessionIdx: viewingSession.idx,
        updates: { pdfViewed: true }
      }
    });
    const sess = surahs.find(s => s.num === viewingSession.surahNum)?.defaultSessions?.[viewingSession.idx];
    if (sess?.pdfUrl) window.open(sess.pdfUrl, '_blank');
  };

  if (!currentUser) {
    return (
      <div className="sp sp--auth">
        <form className="sp__auth-card card glass animate-slide-up" onSubmit={handleAuth}>
          <div className="sp__auth-brand">
             <img src="/logo.png" alt="Logo" />
             <h2>Verse Voyage</h2>
          </div>
          <h3>{authMode === 'login' ? 'Continue Journey' : 'Join Program'}</h3>
          {authError && <div className="sp__auth-error">{authError}</div>}
          
          <div className="sp__form-group">
            {authMode === 'register' && (
              <input type="text" placeholder="Full Name" value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} />
            )}
            <input type="text" placeholder="Username" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} />
            <input type="password" placeholder="Passcode" value={authData.passcode} onChange={e => setAuthData({...authData, passcode: e.target.value})} />
          </div>

          <Button type="submit" fullWidth loading={isAuthenticating}>
            {authMode === 'login' ? 'Sign In' : 'Register'}
          </Button>

          <button type="button" className="sp__auth-toggle" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            {authMode === 'login' ? "New student? Create account" : "Already registered? Login"}
          </button>
          
          <div className="sp__gateway-link">
            <button type="button" onClick={() => window.location.href='/admin'}>Teacher Entry</button>
          </div>
        </form>
      </div>
    );
  }

  // ── Mastery Counters ──
  const studentMastery = state.mastery[currentUser.id] || {};
  const masteredCount = Object.values(studentMastery).filter(m => m.mastered).length;
  const overallProg = Math.round((masteredCount / getTotalSessions()) * 100);

  return (
    <div className="sp">
      <header className="sp__header glass">
        <div className="sp__header-content">
          <div className="sp__brand">Verse Voyage</div>
          <div className="sp__actions">
            <button className="sp__icon-btn" onClick={toggleTheme}>
              {state.settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="sp__icon-btn sp__icon-btn--danger" onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="sp__body animate-fade-in">
        <div className="sp__intro">
          <div className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <h1>Welcome, {currentUser.name.split(' ')[0]}</h1>
          <ProgressBar progress={overallProg} label="Total Journey Mastery" showPercent variant="gold" />
        </div>

        <div className="sp__phases">
          {phaseInfo.map(p => (
            <button 
              key={p.phase} 
              className={`sp__phase-btn ${activePhase === p.phase ? 'active' : ''}`}
              onClick={() => setActivePhase(p.phase)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="sp__surah-list">
          {getSurahsByPhase(activePhase).map(surah => {
            const isEx = expandedSurah === surah.num;
            return (
              <Card key={surah.num} className="sp__surah-card" padding="none">
                <div className="sp__surah-head" onClick={() => setExpandedSurah(isEx ? null : surah.num)}>
                   <div className="sp__surah-meta">
                      <span className="sp__surah-arabic arabic">{surah.arabic}</span>
                      <div className="sp__surah-info">
                        <strong>Surah {surah.name}</strong>
                        <span>{surah.ayaat} Ayats · {surah.sessions} Sessions</span>
                      </div>
                   </div>
                   <ChevronRight size={20} className={isEx ? 'rotated' : ''} />
                </div>

                <AnimatePresence>
                  {isEx && (
                    <motion.div className="sp__sessions" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      {Array.from({ length: surah.sessions }).map((_, idx) => {
                        const locked = isSessionLocked(state, currentUser.id, surah.num, idx);
                        const mastery = getMastery(state, currentUser.id, surah.num, idx);
                        const global = state.curriculum[getSessionKey(surah.num, idx)];

                        return (
                          <button key={idx} className={`sp__session-row ${mastery.mastered ? 'mastered' : ''} ${locked ? 'locked' : ''}`} onClick={() => !locked && setViewingSession({ surahNum: surah.num, idx })}>
                             <div className="sp__session-data">
                                <span className="sp__session-idx">Session {idx + 1}</span>
                                <span className="sp__session-topic">{global?.topic || 'In Progress'}</span>
                             </div>
                             {locked ? <Lock size={16} /> : mastery.mastered ? <CheckCircle2 size={18} className="success" /> : <Play size={18} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {viewingSession && (
          <motion.div className="sp__full-player glass" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="sp__player-inner">
               <header className="sp__player-header">
                  <button className="sp__icon-btn" onClick={() => setViewingSession(null)}><ChevronLeft size={24} /></button>
                  <h3>Session Mastery</h3>
                  <div />
               </header>

               {(() => {
                 const surah = surahs.find(s => s.num === viewingSession.surahNum);
                 const mastery = getMastery(state, currentUser.id, viewingSession.surahNum, viewingSession.idx);
                 const sess = { ...surah?.defaultSessions?.[viewingSession.idx], ...state.curriculum[getSessionKey(viewingSession.surahNum, viewingSession.idx)] };
                 
                 return (
                   <div className="sp__player-content">
                      <div className="sp__player-hero">
                         <span className="arabic">{surah?.arabic}</span>
                         <h2>{surah?.name}</h2>
                         <p>Session {viewingSession.idx + 1}: {sess.topic}</p>
                      </div>

                      <div className="sp__mastery-hud">
                         <div className={`sp__hud-item ${mastery.listens >= 3 ? 'done' : ''}`}>
                            <Headphones size={24} />
                            <span>Listened ({mastery.listens}/3)</span>
                         </div>
                         <div className={`sp__hud-item ${mastery.pdfViewed ? 'done' : ''}`}>
                            <BookOpen size={24} />
                            <span>Tafseer Read</span>
                         </div>
                         <div className={`sp__hud-item ${mastery.mastered ? 'done' : ''}`}>
                            <Gamepad2 size={24} />
                            <span>Challenge</span>
                         </div>
                      </div>

                      <div className="sp__player-audio card">
                         <div className="sp__audio-meta">
                            <strong>Verse Playlist</strong>
                            <span>{currentTrackIdx + 1} / {playlist.length}</span>
                         </div>
                         <ProgressBar progress={((currentTrackIdx + 1) / playlist.length) * 100} variant="primary" />
                         <Button 
                            variant={isPlaying ? 'outline' : 'primary'} 
                            fullWidth 
                            onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                            icon={isPlaying ? <X size={20} /> : <Play size={20} />}
                         >
                            {isPlaying ? 'Pause Recitation' : 'Play All Verses'}
                         </Button>
                         <audio ref={audioRef} src={playlist[currentTrackIdx]} onEnded={onAudioEnded} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                      </div>

                      <div className="sp__actions-grid">
                         <Button variant="outline" fullWidth onClick={handlePdfView} icon={<BookOpen size={18} />}>Read Full Tafseer</Button>
                         <Button 
                           variant={mastery.mastered ? 'success' : 'primary'} 
                           fullWidth 
                           disabled={mastery.listens < 3 || !mastery.pdfViewed}
                           icon={<Gamepad2 size={18} />}
                         >
                           {mastery.mastered ? 'Session Mastered' : 'Mastery Challenge'}
                         </Button>
                      </div>

                      <div className="sp__urdu-summary card">
                         <strong>Tafseer Insight (Urdu)</strong>
                         <div className="urdu" dir="rtl">{sess.tafseerSummary || 'اس سیشن کی تفسیر ابھی دستیاب نہیں ہے۔'}</div>
                      </div>
                   </div>
                 );
               })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
