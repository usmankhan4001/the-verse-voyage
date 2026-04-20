import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAppState } from '../../context/AppContext';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Admin Command Center',
  '/admin/students': 'Student Management',
  '/admin/curriculum': 'Curriculum Manager',
  '/admin/settings': 'System Settings',
  '/student': 'Verse Voyage Portal',
};

export default function Header() {
  const { state } = useAppState();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'The Verse Voyage';

  return (
    <header style={{ 
      height: '72px', 
      borderBottom: '1px solid var(--border)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 32px', 
      background: 'var(--card-bg)', 
      backdropFilter: 'blur(10px)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100 
    }}>
      <div className="header__left">
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
          <Search size={20} style={{ cursor: 'pointer' }} />
          <div style={{ position: 'relative' }}>
             <Bell size={20} style={{ cursor: 'pointer' }} />
             <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', border: '2px solid var(--card-bg)' }}></span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' } as any}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{state.settings?.teacherName || 'Teacher'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Madrassa Admin</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
