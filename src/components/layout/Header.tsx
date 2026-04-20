import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAppState } from '../../context/AppContext';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Command Center',
  '/admin/students': 'Student Directory',
  '/admin/sessions': 'Curriculum Manager',
  '/admin/settings': 'System Settings',
  '/student': 'Student Portal',
};

export default function Header() {
  const { state } = useAppState();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Enterprise Dashboard';

  return (
    <header 
      className="glass"
      style={{ 
        height: 'var(--header-height)', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 32px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 40 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-muted)' }}>
          <Search size={18} style={{ cursor: 'pointer' }} />
          <div style={{ position: 'relative' }}>
             <Bell size={18} style={{ cursor: 'pointer' }} />
             <span style={{ position: 'absolute', top: '-1px', right: '-1px', width: '6px', height: '6px', background: 'var(--error)', borderRadius: '50%', border: '2px solid var(--bg-elevated)' }}></span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1 }}>{state.settings?.teacherName || 'Authorized Teacher'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Administrator</div>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
