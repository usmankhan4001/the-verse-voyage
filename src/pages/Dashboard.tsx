import { 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { surahs, getTotalSessions } from '../data/surahs';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

export default function AdminDashboard() {
  const { state } = useAppState();

  // ── Stats Calculation ──
  const totalStudents = state.students.length;
  const totalSessionsCount = getTotalSessions();
  const masteryTotal = state.students.reduce((acc, student) => {
    const studentMastery = state.mastery[student.id] || {};
    const masteredCount = Object.values(studentMastery).filter((p: any) => p.mastered).length;
    return acc + (masteredCount / totalSessionsCount);
  }, 0);
  const avgMastery = totalStudents > 0 ? Math.round((masteryTotal / totalStudents) * 100) : 0;

  const atRiskStudents = state.students.filter(s => {
    const recentAttendance = state.attendance[s.id] || {};
    const values = Object.values(recentAttendance).slice(-5);
    return values.filter(v => v === 'absent').length >= 3;
  });

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Program Overview</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time metrics for the Juz Amma Mastery program.</p>
        </div>
        <Button icon={<Plus size={18} />}>New Student</Button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>TOTAL STUDENTS</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{totalStudents}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>AVG MASTERY</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{avgMastery}%</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>AT-RISK</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{atRiskStudents.length}</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* At Risk List */}
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>At-Risk Monitoring</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {atRiskStudents.length > 0 ? atRiskStudents.slice(0, 5).map((student, i) => (
              <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: i === atRiskStudents.length - 1 ? 0 : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                    {student.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{student.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Persistent Absence</div>
                  </div>
                </div>
                <Badge label="Needs Attention" variant="danger" />
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                 <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                 <p>All students are currently on track.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Phase Progress */}
        <Card padding="lg">
           <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Phase Delivery</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3, 4, 5].map(p => {
                 const publishedInPhase = Object.values(state.curriculum).filter(s => {
                    const surah = surahs.find(sur => sur.num === s.surahNum);
                    return surah?.phase === p;
                 }).length;
                 const progress = Math.round((publishedInPhase / (totalSessionsCount / 5)) * 100);

                 return (
                   <div key={p}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                       <span>Phase {p}</span>
                       <span style={{ fontWeight: 600 }}>{progress}%</span>
                     </div>
                     <ProgressBar progress={progress} variant={p === state.settings.currentPhase ? 'primary' : undefined} />
                   </div>
                 )
              })}
           </div>
        </Card>
      </div>
    </div>
  );
}
