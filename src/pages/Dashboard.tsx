import { 
  Users, 
  BookOpen, 
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
  
  // Total Mastery Calculation
  let totalMastered = 0;
  Object.values(state.mastery).forEach(studentMastery => {
    Object.values(studentMastery).forEach(m => {
      if (m.mastered) totalMastered++;
    });
  });
  const avgMastery = totalStudents > 0 
    ? Math.round((totalMastered / (totalStudents * totalSessionsCount)) * 100) 
    : 0;

  // At-Risk Calculation
  const atRiskCount = state.students.filter(s => {
    const attendance = state.attendance[s.id] || {};
    const records = Object.values(attendance).slice(-3);
    return records.length >= 3 && records.every(r => r === 'absent');
  }).length;

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'var(--primary)' },
    { label: 'Avg. Mastery', value: `${avgMastery}%`, icon: TrendingUp, color: 'var(--success)' },
    { label: 'Active Sessions', value: Object.keys(state.curriculum).length, icon: BookOpen, color: 'var(--accent)' },
    { label: 'At-Risk Students', value: atRiskCount, icon: AlertTriangle, color: 'var(--error)' },
  ];

  return (
    <div className="admin-dashboard animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Overview</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your teacher console.</p>
        </div>
        <Button icon={<Plus size={18} />}>Quick Actions</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <Card key={i} padding="lg" variant="elevated">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Recent Student Activity */}
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Recent Mastery Activity</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.students.slice(0, 5).map((student, i) => (
              <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: i === state.students.slice(0, 5).length - 1 ? 0 : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                    {student.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{student.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Joined {new Date(student.joinedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <Badge label="Active" variant="success" dot />
              </div>
            ))}
            {state.students.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active students yet.
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
