import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, AlertTriangle, Award, Users as UsersIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import type { AppState } from '../data/store';
import { calculateStreak, isAtRisk } from '../data/store';
import './Students.css';

interface StudentsProps {
  state: AppState;
  addStudent: (name: string) => void;
  removeStudent: (id: string) => void;
  markAttendance: (studentId: string, date: string, status: 'present' | 'absent' | 'pending') => void;
}

export default function Students({ state, addStudent, removeStudent, markAttendance }: StudentsProps) {
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);



  const handleAdd = () => {
    if (newName.trim()) {
      addStudent(newName.trim());
      setNewName('');
      setShowAdd(false);
    }
  };

  // Sort: at-risk first, then by streak desc
  const sortedStudents = [...state.students].sort((a, b) => {
    const aRisk = isAtRisk(a.id, state.attendance) ? 1 : 0;
    const bRisk = isAtRisk(b.id, state.attendance) ? 1 : 0;
    if (aRisk !== bRisk) return bRisk - aRisk;
    return calculateStreak(b.id, state.attendance) - calculateStreak(a.id, state.attendance);
  });

  // Get last 7 dates
  const last7Dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Dates.push(d.toISOString().split('T')[0]);
  }

  return (
    <motion.div
      className="students-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="students-page__head">
        <div>
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">{state.students.length} enrolled</p>
        </div>
        <button className="students-page__add-btn" onClick={() => setShowAdd(!showAdd)}>
          <UserPlus size={16} /> Add Student
        </button>
      </div>

      {/* Add Student Form */}
      {showAdd && (
        <Card padding="md" className="students-page__add-form">
          <input
            type="text"
            placeholder="Student name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="students-page__add-actions">
            <button className="students-page__save-btn" onClick={handleAdd}>Add</button>
            <button className="students-page__cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </Card>
      )}

      {/* Attendance Grid */}
      {state.students.length > 0 && (
        <Card padding="none">
          <div className="students-page__grid-scroll">
            <table className="students-page__table">
              <thead>
                <tr>
                  <th className="students-page__th-name">Student</th>
                  <th className="students-page__th-streak">Streak</th>
                  {last7Dates.map(d => (
                    <th key={d} className="students-page__th-date">
                      {new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric' })}
                    </th>
                  ))}
                  <th className="students-page__th-actions"></th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map(student => {
                  const streak = calculateStreak(student.id, state.attendance);
                  const atRisk = isAtRisk(student.id, state.attendance);

                  return (
                    <tr key={student.id} className={atRisk ? 'students-page__row--risk' : ''}>
                      <td className="students-page__td-name">
                        <span>{student.name}</span>
                        {atRisk && (
                          <span className="students-page__risk-flag" title="3+ consecutive absences">
                            <AlertTriangle size={12} />
                          </span>
                        )}
                      </td>
                      <td className="students-page__td-streak">
                        {streak > 0 ? (
                          <Badge color={streak >= 5 ? 'gold' : 'green'} size="sm">
                            🔥 {streak}
                          </Badge>
                        ) : (
                          <span className="students-page__no-streak">—</span>
                        )}
                      </td>
                      {last7Dates.map(date => {
                        const status = state.attendance[student.id]?.[date] || 'pending';
                        return (
                          <td key={date} className="students-page__td-att">
                            <button
                              className={`students-page__att-btn students-page__att-btn--${status}`}
                              onClick={() => {
                                const next = status === 'pending' ? 'present' : status === 'present' ? 'absent' : 'pending';
                                markAttendance(student.id, date, next);
                              }}
                            >
                              {status === 'present' ? '✅' : status === 'absent' ? '❌' : '⏳'}
                            </button>
                          </td>
                        );
                      })}
                      <td>
                        <button
                          className="students-page__delete-btn"
                          onClick={() => removeStudent(student.id)}
                          title="Remove student"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Leaderboard */}
      {state.students.length > 0 && (
        <Card padding="md">
          <h3 className="students-page__section-title">
            <Award size={16} style={{ color: 'var(--gold)' }} /> Leaderboard
          </h3>
          <div className="students-page__leaderboard">
            {[...state.students]
              .sort((a, b) => calculateStreak(b.id, state.attendance) - calculateStreak(a.id, state.attendance))
              .slice(0, 10)
              .map((student, i) => {
                const streak = calculateStreak(student.id, state.attendance);
                return (
                  <div key={student.id} className="students-page__lb-row">
                    <span className={`students-page__lb-rank ${i < 3 ? 'students-page__lb-rank--top' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <span className="students-page__lb-name">{student.name}</span>
                    <Badge color={streak >= 5 ? 'gold' : streak > 0 ? 'green' : 'muted'} size="sm">
                      🔥 {streak}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {state.students.length === 0 && (
        <div className="students-page__empty">
          <UsersIcon size={48} />
          <h3>No students yet</h3>
          <p>Add your first student to start tracking attendance.</p>
        </div>
      )}
    </motion.div>
  );
}
