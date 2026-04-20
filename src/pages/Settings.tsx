import { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Map, 
  Save,
  RefreshCcw,
  BookOpen
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Settings() {
  const { state } = useAppState();
  const [formData, setFormData] = useState({
    teacherName: state.settings.teacherName,
    adminPasscode: state.settings.adminPasscode,
    theme: state.settings.theme
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we'd have a SET_SETTINGS action
    // For now we'll simulate it or update individual fields
    console.log('Settings saved:', formData);
    alert('Settings updated successfully!');
  };

  const resetProgress = () => {
    if (confirm('CAUTION: This will clear ALL student mastery and attendance data. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700 }}>System Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure global preferences and teacher credentials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={handleSave}>
          <Card padding="lg">
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <User size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Teacher Profile</h3>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>TEACHER DISPLAY NAME</label>
                   <input 
                      type="text" 
                      style={{ width: '100%' }} 
                      value={formData.teacherName} 
                      onChange={e => setFormData({...formData, teacherName: e.target.value})}
                      placeholder="e.g. Br. Usman"
                   />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ADMIN PASSCODE</label>
                   <input 
                      type="password" 
                      style={{ width: '100%' }} 
                      value={formData.adminPasscode} 
                      onChange={e => setFormData({...formData, adminPasscode: e.target.value})}
                   />
                </div>
             </div>
          </Card>

          <Card padding="lg">
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Map size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Journey Navigation</h3>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ACTIVE PHASE</label>
                   <select 
                      style={{ width: '100%' }} 
                      value={state.settings.currentPhase}
                      onChange={() => {}} // Handle phase change
                   >
                      <option value={1}>Phase I: Al-Asr to At-Takathur</option>
                      <option value={2}>Phase II: Al-Qari'ah to Al-Bayyinah</option>
                   </select>
                </div>
             </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <Button type="submit" icon={<Save size={18} />}>Save All Settings</Button>
          </div>
        </form>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card padding="md" className="danger-zone-card">
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--error)', marginBottom: '12px' }}>
                <ShieldCheck size={20} />
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Danger Zone</h4>
             </div>
             <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>These actions are irreversible. Please be absolutely sure.</p>
             <Button variant="outline" fullWidth icon={<RefreshCcw size={16} />} style={{ color: 'var(--error)' }} onClick={resetProgress}>
                Reset Entire System
             </Button>
          </Card>

          <Card padding="md">
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <BookOpen size={20} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Quick Help</h4>
             </div>
             <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Default student passcode is 1234.</li>
                <li>Students cannot move to Session 2 until Session 1 is Mastered.</li>
                <li>At-risk flags trigger after 3 consecutive absences.</li>
             </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
