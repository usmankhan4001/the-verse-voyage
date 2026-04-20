import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, ChevronRight, Upload, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { sessionSteps, phaseInfo, getSurahsByPhase } from '../data/surahs';
import type { AppState, SessionStatus } from '../data/store';
import { sessionKey } from '../data/store';
import './Sessions.css';

interface SessionsProps {
  state: AppState;
  completeSession: (surahNum: number, sessionIndex: number) => void;
  importSessionsFromCSV: (sessions: Partial<SessionStatus>[]) => void;
}

export default function Sessions({ state, completeSession, importSessionsFromCSV }: SessionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const currentPhase = state.settings.currentPhase;
  const phaseSurahs = getSurahsByPhase(currentPhase);
  const phase = phaseInfo.find(p => p.phase === currentPhase)!;

  // Build session list for current phase
  const allSessions = phaseSurahs.flatMap(surah =>
    Array.from({ length: surah.sessions }, (_, i) => ({
      surah,
      index: i,
      key: sessionKey(surah.num, i),
      status: state.sessionProgress[sessionKey(surah.num, i)],
    }))
  );

  const completedCount = allSessions.filter(s => s.status?.completed).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split(/\r?\n/).filter(row => row.trim());
        
        // Skip header
        const dataRows = rows.slice(1);
        const importedSessions: Partial<SessionStatus>[] = dataRows.map(row => {
          // Robust split for CSV (handles some quotes)
          const cols = row.split(',').map(c => c.trim());
          return {
            surahNum: parseInt(cols[0]),
            sessionIndex: parseInt(cols[1]),
            topic: cols[2],
            startAyah: parseInt(cols[3]),
            endAyah: parseInt(cols[4]),
            tafseerSummary: cols[5],
            pdfUrl: cols[6],
            tafseerAudioUrl: cols[7],
            videoUrl: cols[8],
          };
        }).filter(s => !isNaN(s.surahNum!) && !isNaN(s.sessionIndex!));

        if (importedSessions.length > 0) {
          importSessionsFromCSV(importedSessions);
          setImportStatus({ type: 'success', msg: `Successfully imported ${importedSessions.length} sessions.` });
        } else {
          setImportStatus({ type: 'error', msg: 'No valid sessions found in CSV.' });
        }
      } catch (err) {
        setImportStatus({ type: 'error', msg: 'Failed to parse CSV. Check format.' });
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <motion.div
      className="sessions-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sessions-page__head">
        <div>
          <h2 className="page-title">Session Manager</h2>
          <p className="page-subtitle">
            {phase.label} · {phase.name} · {completedCount}/{allSessions.length} sessions completed
          </p>
        </div>
        
        <div className="sessions-page__actions">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            style={{ display: 'none' }} 
          />
          <button 
            className="sessions-page__template-btn"
            onClick={() => {
              const headers = 'surah_num,session_index,topic,start_ayah,end_ayah,tafseer_urdu,pdf_url,audio_url,video_url';
              const sample = '\n78,0,Introduction to Surah Naba,1,5,سورہ نبا کا تعارف اور پہلی پانچ آیات کی تفسیر,https://example.com/guide.pdf,https://example.com/audio.mp3,';
              const blob = new Blob([headers + sample], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'session_import_template.csv';
              a.click();
            }}
          >
            Download Template
          </button>
          <button 
            className="sessions-page__import-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Import CSV
          </button>
        </div>
      </div>

      {importStatus && (
        <div className={`sessions-page__status sessions-page__status--${importStatus.type}`}>
          {importStatus.msg}
        </div>
      )}

      {/* Import Guidance */}
      <Card padding="sm" className="sessions-page__guide-card">
        <div className="sessions-page__guide">
          <Info size={16} className="text-primary" />
          <span>
            CSV Format: <code>surah_num, session_index, topic_en, start, end, tafseer_urdu, pdf, audio, video</code>
          </span>
        </div>
      </Card>

      {/* Session Format */}
      <Card padding="md">
        <h3 className="sessions-page__section-title">
          <CalendarCheck size={16} /> WhatsApp Session Format
        </h3>
        <div className="sessions-page__format">
          {sessionSteps.map((step, i) => (
            <div key={i} className="sessions-page__format-step">
              <div className="sessions-page__format-num" style={{ background: step.color }}>
                {i + 1}
              </div>
              <div className="sessions-page__format-info">
                <strong>{step.title}</strong>
                <span>{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sessions Queue */}
      <Card padding="md">
        <h3 className="sessions-page__section-title">
          Sessions Queue — {phase.label}
        </h3>
        <div className="sessions-page__queue">
          {allSessions.map(sess => (
            <div
              key={sess.key}
              className={`sessions-page__item ${sess.status?.completed ? 'sessions-page__item--done' : ''}`}
            >
              <div className="sessions-page__item-left">
                <div className={`sessions-page__item-check ${sess.status?.completed ? 'sessions-page__item-check--done' : ''}`}>
                  {sess.status?.completed && <Check size={12} />}
                </div>
                <div className="sessions-page__item-info">
                  <span className="sessions-page__item-title">
                    {sess.surah.name} — Session {sess.index + 1}
                  </span>
                  <span className="sessions-page__item-arabic arabic" style={{ fontSize: '14px' }}>
                    {sess.surah.arabic}
                  </span>
                  {sess.status?.topic && (
                    <span className="sessions-page__item-topic">{sess.status.topic}</span>
                  )}
                </div>
              </div>
              <div className="sessions-page__item-right">
                {sess.status?.completed ? (
                  <Badge color="green" size="sm">Done</Badge>
                ) : (
                  <button
                    className="sessions-page__mark-btn"
                    onClick={() => completeSession(sess.surah.num, sess.index)}
                  >
                    Complete <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
