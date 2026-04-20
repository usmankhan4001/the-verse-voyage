import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Play,
  LogOut,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Lock as LockIcon
} from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { surahs, phaseInfo, getSurahsByPhase } from '../../data/surahs';
import { 
  getMastery, 
  isSessionLocked 
} from '../../data/store';
import type { Student } from '../../data/store';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';

export default function StudentPortal() {
  const { state, dispatch } = useAppState();
  
  // ── Auth State ──
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem('vv_student_id');
    if (!saved) return null;
    return state.students.find(s => s.id === saved) || null;
  });

  const [loginForm, setLoginForm] = useState({ username: '', passcode: '' });
  const [loginError, setLoginError] = useState('');

  // ── Journey State ──
  const [viewingPhase, setViewingPhase] = useState<number | null>(null);
  const [viewingSession, setViewingSession] = useState<{ surahNum: number, idx: number } | null>(null);

  // ── Audio Engine State ──
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Login Logic ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = state.students.find(s => s.username === loginForm.username && s.passcode === loginForm.passcode);
    if (student) {
      setCurrentUser(student);
      localStorage.setItem('vv_student_id', student.id);
      setLoginError('');
      const today = new Date().toISOString().split('T')[0];
      dispatch({ 
        type: 'MARK_ATTENDANCE', 
        payload: { studentId: student.id, date: today, status: 'present' } 
      });
    } else {
      setLoginError('Invalid identity or passcode');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vv_student_id');
  };

  // ── Audio Logic ──
  useEffect(() => {
    if (viewingSession) {
      const sNumStr = String(viewingSession.surahNum).padStart(3, '0');
      const surahData = surahs.find(sur => sur.num === viewingSession.surahNum);
      const session = (surahData?.defaultSessions || [])[viewingSession.idx];
      const urls = [];
      const start = session?.startAyah || 1;
      const end = session?.endAyah || 1;
      for (let i = start; i <= end; i++) {
        const vNumStr = String(i).padStart(3, '0');
        urls.push(`https://everyayah.com/data/Husary_Mujawwad_64kbps/${sNumStr}${vNumStr}.mp3`);
      }
      setPlaylist(urls);
      setCurrentTrackIdx(0);
      setIsPlaying(false);
    }
  }, [viewingSession]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTrackEnd = () => {
    if (currentTrackIdx < playlist.length - 1) {
      setCurrentTrackIdx(currentTrackIdx + 1);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      // ── Mastery Logic ──
      if (currentUser && viewingSession) {
        const currentMastery = getMastery(state, currentUser.id, viewingSession.surahNum, viewingSession.idx);
        dispatch({
          type: 'UPDATE_MASTERY',
          payload: {
            studentId: currentUser.id,
            surahNum: viewingSession.surahNum,
            sessionIdx: viewingSession.idx,
            updates: { listens: currentMastery.listens + 1 }
          }
        });
      }
      setIsPlaying(false);
      setCurrentTrackIdx(0);
      alert('Mashallah! Full recitation complete.');
    }
  };

  const openPDF = () => {
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
    const surahData = surahs.find(s => s.num === viewingSession.surahNum);
    const sess = (surahData?.defaultSessions || [])[viewingSession.idx] as any; 
    if (sess?.pdfUrl) window.open(sess.pdfUrl, '_blank');
  };

  // ── Render Helpers ──
  const getPhaseData = (pNum: number | null) => {
    if (pNum === null) return null;
    return phaseInfo[pNum as 1|2|3|4|5];
  };

  // ── Render: Login ──
  if (!currentUser) {
    return (
      <div className="admin-gate">
        <Card className="admin-gate__card glass animate-slide-up">
           <div style={{ width: '80px', height: '80px', background: 'var(--primary)', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px', boxShadow: '0 8px 16px var(--primary-glow)' }}>
              📖
           </div>
           <h2 style={{ fontSize: '28px' }}>The Verse Voyage</h2>
           <p>Enter your student credentials to embark</p>
           <form onSubmit={handleLogin}>
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>STUDENT USERNAME</span>
                <input 
                  type="text"
                  className="admin-gate__input"
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  placeholder="e.g. usmankhan"
                  style={{ textAlign: 'left', padding: '12px', fontSize: '15px', letterSpacing: 'normal', margin: 0 }}
                  autoFocus
                />
              </div>
              <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>SECRET PASSCODE</span>
                <input 
                  type="password"
                  className="admin-gate__input"
                  value={loginForm.passcode}
                  onChange={e => setLoginForm({...loginForm, passcode: e.target.value})}
                  placeholder="••••"
                  style={{ textAlign: 'left', padding: '12px', fontSize: '15px', letterSpacing: 'normal', margin: 0 }}
                />
              </div>
              {loginError && <div style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>{loginError}</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '16px' }}>
                Begin Voyage
              </button>
           </form>
        </Card>
      </div>
    );
  }

  // ── Render: Session Detail ──
  if (viewingSession) {
    const surah = surahs.find(s => s.num === viewingSession.surahNum)!;
    const session = (surah.defaultSessions || [])[viewingSession.idx];
    const mastery = getMastery(state, currentUser.id, viewingSession.surahNum, viewingSession.idx);
    const progressPercent = Math.min(Math.round(((mastery.listens / 3) * 50) + (mastery.pdfViewed ? 50 : 0)), 100);

    return (
      <div className="portal-layout animate-slide-up">
        <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-outline" onClick={() => setViewingSession(null)}><ChevronLeft size={20} /></button>
          <div>
            <h2 style={{ fontSize: '24px' }}>{surah.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Session {viewingSession.idx + 1}: Ayah {session?.startAyah}—{session?.endAyah}</p>
          </div>
        </header>

        <section className="mastery-hud glass">
           <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>MASTERY PROGRESS</div>
              <h3 style={{ fontSize: '32px' }}>{progressPercent}%</h3>
           </div>
           <div style={{ flex: 1, maxWidth: '240px' }}>
              <ProgressBar progress={progressPercent} />
              <div style={{ fontSize: '11px', marginTop: '8px', color: 'var(--text-muted)' }}>
                {mastery.listens}/3 Listen  •  {mastery.pdfViewed ? 'PDF Viewed' : 'PDF Pending'}
              </div>
           </div>
           {mastery.mastered && (
             <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                <CheckCircle2 size={24} />
                Mastered
             </div>
           )}
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
           <Card style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Headphones size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} />
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Recitation</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Complete 3 full playlist listens to master this session.</p>
              </div>
              <button 
                className={`btn ${isPlaying ? 'btn-outline' : 'btn-primary'}`} 
                onClick={togglePlayback}
                style={{ width: '100%' }}
              >
                {isPlaying ? 'Pause Recitation' : 'Start Listening'}
              </button>
              <audio ref={audioRef} src={playlist[currentTrackIdx]} onEnded={handleTrackEnd} />
           </Card>

           <Card style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <BookOpen size={32} style={{ margin: '0 auto', color: 'var(--accent)' }} />
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Translation PDF</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Analyze the meaning and context of these verses.</p>
              </div>
              <button className="btn btn-outline" onClick={openPDF} style={{ width: '100%' }}>
                View Document
              </button>
           </Card>
        </div>

        {playlist.length > 0 && (
          <Card padding="lg">
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Recitation Playlist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {playlist.map((url, i) => (
                 <div key={url} className="surah-card" style={{ padding: '12px 16px', background: i === currentTrackIdx ? 'var(--primary-light)' : 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: i === currentTrackIdx ? 'var(--primary)' : 'var(--border)', color: i === currentTrackIdx ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                          {i + 1}
                       </div>
                       <span style={{ fontSize: '14px', fontWeight: i === currentTrackIdx ? 600 : 400 }}>Ayah {(session?.startAyah || 1) + i}</span>
                    </div>
                    {i === currentTrackIdx && isPlaying && <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>}
                 </div>
               ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Render: Portal Home ──
  const activePhaseData = getPhaseData(viewingPhase);

  return (
    <div className="portal-layout animate-slide-up">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
           <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Welcome back, Student</div>
           <h2 style={{ fontSize: '28px' }}>{currentUser.name}</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)', padding: '10px' }} onClick={logout}><LogOut size={20} /></button>
        </div>
      </header>

      {viewingPhase === null ? (
        <section>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Select Training Phase</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
             {[1, 2, 3, 4, 5].map(p => {
               const pData = phaseInfo[p as 1|2|3|4|5];
               return (
                <Card 
                  key={p} 
                  className="surah-card" 
                  onClick={() => setViewingPhase(p)}
                  style={{ height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '8px' }}
                >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '20px' }}>PHASE {p}</span>
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{pData.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{pData.description}</div>
                </Card>
               );
             })}
          </div>
        </section>
      ) : (
        <section>
           <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <button className="btn btn-outline" onClick={() => setViewingPhase(null)}><ChevronLeft size={20} /></button>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Phase {viewingPhase}: {activePhaseData?.name}</h3>
           </header>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {getSurahsByPhase(viewingPhase).map(surah => (
                 <div key={surah.num} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.02)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>{surah.num}</div>
                          <h4 style={{ fontWeight: 700 }}>{surah.name}</h4>
                       </div>
                       <div className="arabic" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{surah.arabic}</div>
                    </div>
                    <div style={{ padding: '8px' }}>
                       {(surah.defaultSessions || []).map((_, idx) => {
                          const locked = isSessionLocked(state, currentUser.id, surah.num, idx);
                          const mastery = getMastery(state, currentUser.id, surah.num, idx);
                          const pCent = Math.min(Math.round(((mastery.listens / 3) * 50) + (mastery.pdfViewed ? 50 : 0)), 100);
                          return (
                             <div 
                                key={idx} 
                                className={`surah-card ${locked ? 'surah-card__locked' : ''}`}
                                onClick={() => !locked && setViewingSession({ surahNum: surah.num, idx })}
                                style={{ margin: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}
                             >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                   {mastery.mastered ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : (locked ? <LockIcon size={18} /> : <Play size={18} style={{ color: 'var(--primary)' }} />)}
                                   <div style={{ fontSize: '14px', fontWeight: 600 }}>Session {idx + 1}</div>
                                </div>
                                <div style={{ minWidth: '80px' }}>
                                   <ProgressBar progress={pCent} />
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              ))}
           </div>
        </section>
      )}

      <footer style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '20px 0' }}>
         The Verse Voyage v2.1.6 • Built for Mastery
      </footer>
    </div>
  );
}
