import { useState } from 'react';
import { 
  FileDown, 
  FileUp, 
  Plus, 
  Settings2, 
  BookOpen,
  Trash2
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { surahs, getTotalSessions } from '../data/surahs';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function AdminSessions() {
  const { state, dispatch } = useAppState();
  const [filterPhase, setFilterPhase] = useState<number | 'all'>('all');


  const curriculumList = Object.values(state.curriculum);
  const filteredCurriculum = filterPhase === 'all' 
    ? curriculumList 
    : curriculumList.filter(s => {
        const surah = surahs.find(sur => sur.num === s.surahNum);
        return surah?.phase === filterPhase;
      });

  const totalSessionsCount = getTotalSessions();
  const progress = Math.round((curriculumList.length / totalSessionsCount) * 100);

  const togglePhase = (phase: number) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { currentPhase: phase } });
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Curriculum Manager</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Configure surahs, sessions, and training phases.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" icon={<FileDown size={18} />}>Export</Button>
          <Button variant="outline" icon={<FileUp size={18} />}>Import</Button>
          <Button icon={<Plus size={18} />}>New Session</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Phase Filter Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: '4px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', gap: '4px' }}>
             <button 
               onClick={() => setFilterPhase('all')}
               style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: filterPhase === 'all' ? 'var(--primary)' : 'transparent', color: filterPhase === 'all' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition)' }}
             >
               All Phases
             </button>
             {[1, 2, 3, 4, 5].map(p => (
               <button 
                key={p}
                onClick={() => setFilterPhase(p)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: filterPhase === p ? 'var(--primary)' : 'transparent', color: filterPhase === p ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'var(--transition)' }}
               >
                 Phase {p}
               </button>
             ))}
          </div>

          <Card padding="none">
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Curriculum Grid</h3>
               <Badge label={`${filteredCurriculum.length} Sessions`} variant="muted" />
            </div>
            
            <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left' }}>Surah / Session</th>
                      <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left' }}>Ayah Range</th>
                      <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCurriculum.map((session) => {
                       const surah = surahs.find(s => s.num === session.surahNum);
                       const original = (surah?.defaultSessions || [])[session.sessionIndex];
                       return (
                         <tr key={`${session.surahNum}-${session.sessionIndex}`} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                            <td style={{ padding: '16px 24px' }}>
                               <div style={{ fontWeight: 600, fontSize: '14px' }}>{surah?.name}</div>
                               <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Session {session.sessionIndex + 1}</div>
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                               <div style={{ fontSize: '13px', fontWeight: 500 }}>{original?.startAyah} — {original?.endAyah}</div>
                               <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total {original ? (original.endAyah - original.startAyah + 1) : 0} Verses</div>
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                               <Badge label="Published" variant="success" />
                            </td>
                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                               <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                  <button style={{ padding: '6px', borderRadius: '6px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}><Settings2 size={16} /></button>
                                  <button style={{ padding: '6px', borderRadius: '6px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                               </div>
                            </td>
                         </tr>
                       );
                    })}
                  </tbody>
               </table>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <Card padding="lg">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Active Phase</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Select the phase currently being delivered in class.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {[1, 2, 3, 4, 5].map(p => (
                   <button 
                     key={p}
                     onClick={() => togglePhase(p)}
                     style={{ 
                       padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer',
                       background: state.settings.currentPhase === p ? 'var(--primary-light)' : 'var(--bg-elevated)',
                       borderColor: state.settings.currentPhase === p ? 'var(--primary)' : 'var(--border)',
                       transition: 'var(--transition)'
                     }}
                   >
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: state.settings.currentPhase === p ? 'var(--primary)' : 'var(--text-muted)' }}>PHASE {p}</span>
                        {state.settings.currentPhase === p && <Badge label="Active" variant="primary" />}
                     </div>
                     <div style={{ fontSize: '14px', fontWeight: 600 }}>Training Track {p}</div>
                   </button>
                 ))}
              </div>
           </Card>

           <Card padding="lg" style={{ background: 'var(--primary)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={18} />
                 </div>
                 <div style={{ fontWeight: 700 }}>Curriculum Stats</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{progress}%</div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>Catalog Completion</div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                 <div style={{ width: `${progress}%`, height: '100%', background: 'white', borderRadius: '2px' }}></div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
