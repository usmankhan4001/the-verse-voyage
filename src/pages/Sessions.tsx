import React, { useState } from 'react';
import { 
  FileDown, 
  FileUp, 
  Plus, 
  Settings2, 
  Search,
  BookOpen,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { surahs, getTotalSessions } from '../data/surahs';
import { getSessionKey, SessionDefinition } from '../data/store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Sessions() {
  const { state, dispatch } = useAppState();
  const [search, setSearch] = useState('');
  const [editingSession, setEditingSession] = useState<{key: string, data: Partial<SessionDefinition>} | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const curriculumList = Object.entries(state.curriculum).filter(([key, sess]) => 
    sess.topic.toLowerCase().includes(search.toLowerCase()) || 
    key.includes(search)
  );

  const downloadCSVTemplate = () => {
    const headers = ['SurahNum', 'SessionIndex', 'Topic', 'UrduTafseer', 'StartAyah', 'EndAyah', 'PDF_URL', 'Audio_URL'];
    const row = ['99', '1', 'The Great Earthquake', 'جب زمین ہلا دی جائے گی', '1', '8', 'https://...', 'https://...'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + row.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "verse_voyage_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    dispatch({ 
      type: 'UPDATE_SESSION', 
      payload: { key: editingSession.key, updates: editingSession.data as SessionDefinition } 
    });
    setEditingSession(null);
  };

  return (
    <div className="sessions-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Curriculum Manager</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Configure surahs, sessions, and mastery content.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" icon={<FileDown size={18} />} onClick={downloadCSVTemplate}>Template</Button>
          <Button variant="outline" icon={<FileUp size={18} />} onClick={() => setIsImporting(true)}>Bulk Import</Button>
          <Button icon={<Plus size={18} />}>New Session</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
        {/* Statistics & Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card padding="md">
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Curriculum Health</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Published Sessions</span>
                  <Badge label={`${Object.keys(state.curriculum).length} / ${getTotalSessions()}`} variant="primary" />
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Missing PDF Links</span>
                  <Badge label={`${Object.values(state.curriculum).filter(s => !s.pdfUrl).length}`} variant="warning" />
               </div>
            </div>
          </Card>

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter topics..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }}
            />
          </div>
        </aside>

        {/* Sessions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {curriculumList.map(([key, sess]) => {
            const surah = surahs.find(s => s.num === sess.surahNum);
            return (
              <Card key={key} padding="md" className="hover-scale interactive">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                       <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={24} />
                       </div>
                       <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Surah {surah?.name} · Session {sess.sessionIndex + 1}</div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{sess.topic}</h4>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                       <Button variant="outline" size="sm" icon={<Settings2 size={16} />} onClick={() => setEditingSession({ key, data: {...sess} })}>Edit</Button>
                       <Button variant="ghost" size="sm"><ExternalLink size={16} /></Button>
                    </div>
                 </div>
              </Card>
            )
          })}

          {curriculumList.length === 0 && (
             <div style={{ padding: '80px', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No curriculum data found for this filter. Start by adding a session or importing a CSV.</p>
             </div>
          )}
        </div>
      </div>

      {/* Manual Editor Modal */}
      {editingSession && (
        <div className="admin-gate" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
           <form className="card glass animate-slide-up" style={{ width: '600px', padding: '32px' }} onSubmit={handleManualSave}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Edit Session Content</h3>
                 <button type="button" onClick={() => setEditingSession(null)}><Trash2 size={20} className="error" /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                 <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>SESSION TOPIC</label>
                    <input type="text" style={{ width: '100%' }} value={editingSession.data.topic} onChange={e => setEditingSession({...editingSession, data: {...editingSession.data, topic: e.target.value}})} />
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>START AYAH</label>
                    <input type="number" style={{ width: '100%' }} value={editingSession.data.startAyah} onChange={e => setEditingSession({...editingSession, data: {...editingSession.data, startAyah: parseInt(e.target.value)}})} />
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>END AYAH</label>
                    <input type="number" style={{ width: '100%' }} value={editingSession.data.endAyah} onChange={e => setEditingSession({...editingSession, data: {...editingSession.data, endAyah: parseInt(e.target.value)}})} />
                 </div>
                 <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>URDU TAFSEER SUMMARY</label>
                    <textarea style={{ width: '100%', height: '100px', fontFamily: 'var(--font-urdu)', direction: 'rtl' }} value={editingSession.data.tafseerSummary} onChange={e => setEditingSession({...editingSession, data: {...editingSession.data, tafseerSummary: e.target.value}})} />
                 </div>
                 <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>PDF STUDY LINK (GDrive)</label>
                    <input type="text" style={{ width: '100%' }} value={editingSession.data.pdfUrl} onChange={e => setEditingSession({...editingSession, data: {...editingSession.data, pdfUrl: e.target.value}})} />
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                 <Button type="button" variant="outline" fullWidth onClick={() => setEditingSession(null)}>Discard Changes</Button>
                 <Button type="submit" fullWidth>Save Session</Button>
              </div>
           </form>
        </div>
      )}

      {/* CSV Import Workbench Placeholder */}
      {isImporting && (
         <div className="admin-gate" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <div className="card glass animate-slide-up" style={{ width: '500px', padding: '40px', textAlign: 'center' }}>
               <AlertCircle size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
               <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>CSV Data Workbench</h3>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Select your mastery CSV file to begin the validation and import process.</p>
               <input type="file" style={{ marginBottom: '24px' }} />
               <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="outline" fullWidth onClick={() => setIsImporting(false)}>Cancel</Button>
                  <Button fullWidth disabled>Validate & Import</Button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
