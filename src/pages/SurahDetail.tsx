import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, FileText, Headphones, File, Play } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getSurahByNum, phaseInfo, sessionSteps } from '../data/surahs';
import type { AppState, SessionStatus } from '../data/store';
import { sessionKey } from '../data/store';
import './SurahDetail.css';

interface SurahDetailProps {
  state: AppState;
  completeSession: (surahNum: number, sessionIndex: number) => void;
  updateSessionProgress: (surahNum: number, sessionIndex: number, updates: Partial<SessionStatus>) => void;
  setTeacherNote: (surahNum: number, note: string) => void;
}

export default function SurahDetail({
  state,
  completeSession,
  updateSessionProgress,
  setTeacherNote,
}: SurahDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surah = getSurahByNum(Number(id));

  if (!surah) {
    return (
      <div className="surah-detail__empty">
        <p>Surah not found</p>
        <button onClick={() => navigate('/surahs')}>Back to Explorer</button>
      </div>
    );
  }

  const phase = phaseInfo.find(p => p.phase === surah.phase)!;
  const phaseColorMap: Record<number, 'green' | 'purple' | 'gold' | 'coral'> = {
    1: 'green', 2: 'purple', 3: 'gold', 4: 'coral',
  };

  const note = state.teacherNotes[surah.num] || '';

  const sessions = Array.from({ length: surah.sessions }, (_, i) => {
    const key = sessionKey(surah.num, i);
    const defaultSess = surah.defaultSessions?.[i];
    const sessMap = state.sessionProgress[key];
    
    const sess = {
      completed: false,
      contentChecklist: { arabicCard: false, audio: false, wordByWord: false, tafseer: false, posted: false },
    } as any;

    Object.assign(sess, defaultSess, sessMap);
    
    // Final overrides for key identifiers
    sess.surahNum = surah.num;
    sess.sessionIndex = i;
    
    return sess as SessionStatus;
  });

  const completedCount = sessions.filter(s => s.completed).length;

  const toggleChecklist = (sessionIdx: number, field: keyof SessionStatus['contentChecklist']) => {
    const key = sessionKey(surah.num, sessionIdx);
    const current = state.sessionProgress[key];
    const checklist = current?.contentChecklist || {
      arabicCard: false, audio: false, wordByWord: false, tafseer: false, posted: false,
    };
    updateSessionProgress(surah.num, sessionIdx, {
      contentChecklist: { ...checklist, [field]: !checklist[field] },
    });
  };

  const updateSessionField = (sessionIdx: number, field: keyof SessionStatus, value: any) => {
    updateSessionProgress(surah.num, sessionIdx, { [field]: value });
  };

  return (
    <motion.div
      className="surah-detail"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button className="surah-detail__back" onClick={() => navigate('/admin/surahs')}>
        <ArrowLeft size={16} /> Back to Surahs
      </button>

      {/* Header */}
      <div className="surah-detail__header">
        <div className="surah-detail__header-bg">
          <div className="surah-detail__arabic arabic">{surah.arabic}</div>
        </div>
        <div className="surah-detail__header-content">
          <div className="surah-detail__header-top">
            <Badge color={phaseColorMap[surah.phase]}>{phase.label} · {phase.name}</Badge>
            <span className="surah-detail__num">#{surah.num}</span>
          </div>
          <h1 className="surah-detail__title">Surah {surah.name}</h1>
          <p className="surah-detail__meta">
            {surah.ayaat} Ayaat · {surah.sessions} Sessions · {completedCount}/{surah.sessions} Done
          </p>
        </div>
      </div>

      <div className="surah-detail__two-col">
        {/* Sessions Editor */}
        <div className="surah-detail__sessions-container">
          <h3 className="surah-detail__section-title">Session Breakdown & Resources</h3>
          <div className="surah-detail__sessions">
            {sessions.map((sess, i) => (
              <Card key={i} padding="md" className={`surah-detail__session-card ${sess.completed ? 'surah-detail__session-card--done' : ''}`}>
                <div className="surah-detail__session-head">
                  <span className="surah-detail__session-num">Session {i + 1}</span>
                  <button
                    className={`surah-detail__complete-btn ${sess.completed ? 'surah-detail__complete-btn--done' : ''}`}
                    onClick={() => {
                      if (!sess.completed) completeSession(surah.num, i);
                    }}
                  >
                    <Check size={14} />
                    {sess.completed ? 'Done' : 'Mark Done'}
                  </button>
                </div>

                {/* Session Topic (Student Portal Theme) */}
                <div className="surah-detail__grid-top">
                  <div className="surah-detail__field">
                    <label>Session Topic (Theme)</label>
                    <input
                      type="text"
                      placeholder="e.g., Introduction & Verses 1-5"
                      value={sess.topic || ''}
                      onChange={(e) => updateSessionField(i, 'topic', e.target.value)}
                    />
                  </div>

                  {/* Compulsory Ayah Range */}
                  <div className="surah-detail__field-group">
                    <div className="surah-detail__field">
                      <label>Start Ayah</label>
                      <input
                        type="number"
                        min="1"
                        max={surah.ayaat}
                        value={sess.startAyah || ''}
                        onChange={(e) => updateSessionField(i, 'startAyah', Number(e.target.value))}
                      />
                    </div>
                    <div className="surah-detail__field">
                      <label>End Ayah</label>
                      <input
                        type="number"
                        min="1"
                        max={surah.ayaat}
                        value={sess.endAyah || ''}
                        onChange={(e) => updateSessionField(i, 'endAyah', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Tafseer Summary Content */}
                <div className="surah-detail__field">
                  <label>Tafseer Summary (Compulsory Reading)</label>
                  <textarea
                    placeholder="Provide a detailed summary for students to read..."
                    value={sess.tafseerSummary || ''}
                    onChange={(e) => updateSessionField(i, 'tafseerSummary', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Resource Links */}
                <div className="surah-detail__resources-grid">
                  <div className="surah-detail__field">
                    <label><File size={12} /> PDF Link</label>
                    <input
                      type="text"
                      placeholder="URL..."
                      value={sess.pdfUrl || ''}
                      onChange={(e) => updateSessionField(i, 'pdfUrl', e.target.value)}
                    />
                  </div>
                  <div className="surah-detail__field">
                    <label><Play size={12} /> Video Link</label>
                    <input
                      type="text"
                      placeholder="URL..."
                      value={sess.videoUrl || ''}
                      onChange={(e) => updateSessionField(i, 'videoUrl', e.target.value)}
                    />
                  </div>
                  <div className="surah-detail__field">
                    <label><Headphones size={12} /> Audio Tafseer</label>
                    <input
                      type="text"
                      placeholder="URL..."
                      value={sess.tafseerAudioUrl || ''}
                      onChange={(e) => updateSessionField(i, 'tafseerAudioUrl', e.target.value)}
                    />
                  </div>
                  {/* Legacy Ayat Audio field removed as we use Range now */}
                </div>

                <div className="surah-detail__checklist">
                  <label>Content Checklist:</label>
                  <div className="surah-detail__checklist-items">
                    {(['arabicCard', 'audio', 'wordByWord', 'tafseer', 'posted'] as const).map(field => (
                      <label key={field} className="surah-detail__check-item">
                        <input
                          type="checkbox"
                          checked={sess.contentChecklist?.[field] || false}
                          onChange={() => toggleChecklist(i, field)}
                        />
                        <span>{field === 'arabicCard' ? 'Arabic Card' : field === 'wordByWord' ? 'Word-by-Word' : field.charAt(0).toUpperCase() + field.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="surah-detail__side-col">
          {/* Themes */}
          <Card padding="md" className="surah-detail__side-card">
            <h3 className="surah-detail__section-title">
              <FileText size={16} /> Surah Themes
            </h3>
            <div className="surah-detail__themes">
              {surah.themes.split('·').map((theme, i) => (
                <Badge key={i} color="muted" size="md">{theme.trim()}</Badge>
              ))}
            </div>
          </Card>

          {/* Teacher Notes */}
          <Card padding="md" className="surah-detail__side-card">
            <h3 className="surah-detail__section-title">Teacher Notes</h3>
            <textarea
              className="surah-detail__notes"
              placeholder="Add your notes for this surah..."
              value={note}
              onChange={e => setTeacherNote(surah.num, e.target.value)}
              rows={8}
            />
          </Card>

          {/* Session Format Reference */}
          <Card padding="md" className="surah-detail__side-card">
            <h3 className="surah-detail__section-title">Session Format Reference</h3>
            <div className="surah-detail__steps">
              {sessionSteps.map((step, i) => (
                <div key={i} className="surah-detail__step">
                  <div className="surah-detail__step-dot" style={{ background: step.color }} />
                  <div>
                    <div className="surah-detail__step-title">{step.title}</div>
                    <div className="surah-detail__step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
