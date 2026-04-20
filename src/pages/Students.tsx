import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { formatDateShort } from '../data/store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

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
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Student Directory</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage enrollments and daily attendance tracking.</p>
        </div>
        <Button icon={<UserPlus size={18} />} onClick={() => setShowAddModal(true)}>Add Student</Button>
      </div>

      <Card padding="none">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="admin-gate__input"
              placeholder="Search by name or username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 42px', fontSize: '14px', margin: 0, textAlign: 'left', letterSpacing: 'normal' }}
            />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {filteredStudents.length} Students Listed
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left' }}>Credentials</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left' }}>Daily Tracking</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const today = new Date().toISOString().split('T')[0];
                const attStatus = state.attendance[student.id]?.[today];
                
                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {student.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{student.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered {formatDateShort(student.joinedAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontSize: '13px', fontWeight: 500 }}>@{student.username}</div>
                       <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pass: {student.passcode}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => markAttendance(student.id, 'present')}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                            background: attStatus === 'present' ? 'var(--success)' : 'var(--bg)', 
                            color: attStatus === 'present' ? 'white' : 'var(--text-muted)', 
                            border: attStatus === 'present' ? '1px solid var(--success)' : '1px solid var(--border)',
                            fontSize: '12px', fontWeight: 600, transition: 'var(--transition)'
                          }}
                        >
                          <CheckCircle size={16} /> Present
                        </button>
                        <button 
                          onClick={() => markAttendance(student.id, 'absent')}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                            background: attStatus === 'absent' ? 'var(--error)' : 'var(--bg)', 
                            color: attStatus === 'absent' ? 'white' : 'var(--text-muted)', 
                            border: attStatus === 'absent' ? '1px solid var(--error)' : '1px solid var(--border)',
                            fontSize: '12px', fontWeight: 600, transition: 'var(--transition)'
                          }}
                        >
                          <XCircle size={16} /> Absent
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Student Modal Overlay */}
      {showAddModal && (
        <div className="admin-gate" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <form className="card glass animate-slide-up" style={{ width: '420px', padding: '32px' }} onSubmit={handleAddStudent}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Register Traveler</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Create an identity for the new student.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FULL NAME</label>
                <input type="text" className="admin-gate__input" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} placeholder="e.g. Usman Khan" style={{ width: '100%', margin: 0, textAlign: 'left', padding: '12px', fontSize: '15px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>USERNAME</label>
                <input type="text" className="admin-gate__input" value={newStudent.username} onChange={e => setNewStudent({...newStudent, username: e.target.value})} placeholder="e.g. usmankhan" style={{ width: '100%', margin: 0, textAlign: 'left', padding: '12px', fontSize: '15px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SECRET PASSCODE</label>
                <input type="text" className="admin-gate__input" value={newStudent.passcode} onChange={e => setNewStudent({...newStudent, passcode: e.target.value})} placeholder="Default: 1234" style={{ width: '100%', margin: 0, textAlign: 'left', padding: '12px', fontSize: '15px' }} />
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
