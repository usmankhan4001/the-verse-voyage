import { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { formatDateShort } from '../data/store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Students() {
  const { state, dispatch } = useAppState();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', username: '', passcode: '1234' });

  const filteredStudents = state.students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.username) return;
    dispatch({ type: 'ADD_STUDENT', payload: newStudent });
    setShowAddModal(false);
    setNewStudent({ name: '', username: '', passcode: '1234' });
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    const today = new Date().toISOString().split('T')[0];
    dispatch({ type: 'MARK_ATTENDANCE', payload: { studentId, date: today, status } });
  };

  return (
    <div className="students-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Student Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track attendance and mastery progress.</p>
        </div>
        <Button icon={<UserPlus size={18} />} onClick={() => setShowAddModal(true)}>Add Student</Button>
      </div>

      <Card padding="none">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter by name or username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }}
            />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing {filteredStudents.length} students
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Username</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today's Attendance</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const today = new Date().toISOString().split('T')[0];
                const attStatus = state.attendance[student.id]?.[today];
                
                // At-Risk? (3 consecutive absences)
                const history = Object.values(state.attendance[student.id] || {}).slice(-3);
                const isAtRisk = history.length >= 3 && history.every(h => h === 'absent');

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="hover-bg">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                          {student.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{student.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Joined {formatDateShort(student.joinedAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      @{student.username}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => markAttendance(student.id, 'present')}
                          style={{ padding: '6px', borderRadius: '6px', background: attStatus === 'present' ? 'var(--success)' : 'var(--bg)', color: attStatus === 'present' ? 'white' : 'var(--text-muted)', border: '1px solid var(--border)' }}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => markAttendance(student.id, 'absent')}
                          style={{ padding: '6px', borderRadius: '6px', background: attStatus === 'absent' ? 'var(--error)' : 'var(--bg)', color: attStatus === 'absent' ? 'white' : 'var(--text-muted)', border: '1px solid var(--border)' }}
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {isAtRisk ? (
                        <Badge label="At Risk" variant="danger" dot />
                      ) : (
                        <Badge label="Active" variant="success" dot />
                      )}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button className="sp__icon-btn"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{ marginBottom: '16px', color: 'var(--text-muted)' }}><Users size={48} strokeWidth={1} /></div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>No students found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Try a different search term or add a new student.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="admin-gate" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <form className="card glass animate-slide-up" style={{ width: '400px', padding: '32px' }} onSubmit={handleAddStudent}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Register New Student</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                <input type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} placeholder="e.g. Usman Khan" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Username</label>
                <input type="text" value={newStudent.username} onChange={e => setNewStudent({...newStudent, username: e.target.value})} placeholder="e.g. usmankhan" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Secret Passcode</label>
                <input type="text" value={newStudent.passcode} onChange={e => setNewStudent({...newStudent, passcode: e.target.value})} placeholder="Default: 1234" style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
               <Button type="button" variant="outline" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
               <Button type="submit" fullWidth>Create Account</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
