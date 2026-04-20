import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, FileText, Headphones, Play } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getSurahByNum, phaseInfo } from '../data/surahs';
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
  const [activeTab, setActiveTab] = useState(0);

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

  const sessions = Array.from({ length: surah.sessions }, (_, i) => {
    const key = sessionKey(surah.num, i);
    const defaultSess = surah.defaultSessions?.[i];
    const sessMap = state.sessionProgress[key];
    
    const sess = {
      completed: false,
      contentChecklist: { arabicCard: false, audio: false, wordByWord: false, tafseer: false, posted: false },
    } as any;

    Object.assign(sess, defaultSess, sessMap);
    sess.surahNum = surah.num;
    sess.sessionIndex = i;
    return sess as SessionStatus;
  });

  const activeSession = sessions[activeTab];

  const toggleChecklist = (sessionIdx: number, field: keyof SessionStatus['contentChecklist']) => {
    const key = sessionKey(surah.num, sessionIdx);
    const current = state.sessionProgress[key] || {
      surahNum: surah.num,
      sessionIndex: sessionIdx,
      completed: false,
      contentChecklist: { arabicCard: false, audio: false, wordByWord: false, tafseer: false, posted: false },
    };
    
    updateSessionProgress(surah.num, sessionIdx, {
      contentChecklist: { ...current.contentChecklist, [field]: !current.contentChecklist[field] },
    });
  };

  const updateSessionField = (sessionIdx: number, field: keyof SessionStatus, value: any) => {
    if (field === 'startAyah' || field === 'endAyah') {
      const numVal = Number(value);
      if (isNaN(numVal) || numVal < 1 || numVal > surah.ayaat) return;
      const key = sessionKey(surah.num, sessionIdx);
      const current = state.sessionProgress[key];
      const otherField = field === 'startAyah' ? 'endAyah' : 'startAyah';
      const otherVal = current?.[otherField] || surah.defaultSessions?.[sessionIdx]?.[otherField];
      if (otherVal) {
        if (field === 'startAyah' && numVal > otherVal) return;
        if (field === 'endAyah' && numVal < otherVal) return;
      }
    }
    updateSessionProgress(surah.num, sessionIdx, { [field]: value });
  };

  return (
    <div className="surah-detail">
      <div className="surah-detail__nav">
        <button className="surah-detail__back" onClick={() => navigate('/admin/surahs')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="surah-detail__header-info">
          <Badge color={phaseColorMap[surah.phase]}>{phase.label}</Badge>
          <span className="surah-detail__title-text">Surah {surah.name}</span>
        </div>
      </div>

      <div className="surah-detail__layout">
        <div className="surah-detail__main-col">
          <div className="surah-detail__tabs">
            {sessions.map((_, i) => (
              <button 
                key={i} 
                className={`surah-detail__tab ${activeTab === i ? 'surah-detail__tab--active' : ''} ${sessions[i].completed ? 'surah-detail__tab--done' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                Session {i + 1}
                {sessions[i].completed && <Check size={12} />}
              </button>
            ))}
          </div>

          <div className="surah-detail__content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card padding="lg">
                  <div className="surah-detail__session-header">
                    <h3>Session {activeTab + 1} Configuration</h3>
                    <Button 
                      variant={activeSession.completed ? 'success' : 'primary'}
                      size="sm"
                      onClick={() => !activeSession.completed && completeSession(surah.num, activeTab)}
                      disabled={activeSession.completed}
                      icon={activeSession.completed ? <Check size={14} /> : null}
                    >
                      {activeSession.completed ? 'Completed' : 'Mark as Done'}
                    </Button>
                  </div>

                  <div className="surah-detail__editor-grid">
                    <div className="surah-detail__field">
                      <label>Topic / Theme</label>
                      <input
                        type="text"
                        value={activeSession.topic || ''}
                        onChange={(e) => updateSessionField(activeTab, 'topic', e.target.value)}
                        placeholder="e.g., Intro & Verses 1-5"
                      />
                    </div>

                    <div className="surah-detail__field-row">
                      <div className="surah-detail__field">
                        <label>Start Ayah</label>
                        <input
                          type="number"
                          value={activeSession.startAyah || ''}
                          onChange={(e) => updateSessionField(activeTab, 'startAyah', e.target.value)}
                        />
                      </div>
                      <div className="surah-detail__field">
                        <label>End Ayah</label>
                        <input
                          type="number"
                          value={activeSession.endAyah || ''}
                          onChange={(e) => updateSessionField(activeTab, 'endAyah', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="surah-detail__field">
                      <label>Tafseer Summary</label>
                      <textarea
                        rows={4}
                        value={activeSession.tafseerSummary || ''}
                        onChange={(e) => updateSessionField(activeTab, 'tafseerSummary', e.target.value)}
                        placeholder="Enter key points for students..."
                      />
                    </div>

                    <div className="surah-detail__resource-links">
                      <div className="surah-detail__field">
                        <label><FileText size={14} /> PDF Link</label>
                        <input type="text" value={activeSession.pdfUrl || ''} onChange={(e) => updateSessionField(activeTab, 'pdfUrl', e.target.value)} />
                      </div>
                      <div className="surah-detail__field">
                        <label><Play size={14} /> Video Link</label>
                        <input type="text" value={activeSession.videoUrl || ''} onChange={(e) => updateSessionField(activeTab, 'videoUrl', e.target.value)} />
                      </div>
                      <div className="surah-detail__field">
                        <label><Headphones size={14} /> Audio Link</label>
                        <input type="text" value={activeSession.tafseerAudioUrl || ''} onChange={(e) => updateSessionField(activeTab, 'tafseerAudioUrl', e.target.value)} />
                      </div>
                    </div>

                    <div className="surah-detail__checklist-section">
                      <label>Resource Status</label>
                      <div className="surah-detail__checklist-grid">
                        {(['arabicCard', 'audio', 'wordByWord', 'tafseer', 'posted'] as const).map(field => (
                          <label key={field} className="surah-detail__check-item">
                            <input
                              type="checkbox"
                              checked={activeSession.contentChecklist?.[field] || false}
                              onChange={() => toggleChecklist(activeTab, field)}
                            />
                            <span>{field === 'arabicCard' ? 'Arabic Card' : field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="surah-detail__side-col">
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

          <Card padding="md" className="surah-detail__side-card">
            <h3 className="surah-detail__section-title">Teacher Notes</h3>
            <textarea
              className="surah-detail__notes"
              placeholder="Add your notes for this surah..."
              value={state.teacherNotes[surah.num] || ''}
              onChange={e => setTeacherNote(surah.num, e.target.value)}
              rows={8}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
