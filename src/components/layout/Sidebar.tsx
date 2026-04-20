import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Users,
  Settings,
  Moon,
  Sun,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAppState } from '../../context/AppContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/sessions', icon: CalendarCheck, label: 'Sessions' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = state.settings.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', payload: next });
  };

  const handleLogout = () => {
    if (confirm('Logout from Teacher Portal?')) {
      localStorage.removeItem('vv_admin_auth');
      window.location.href = '/';
    }
  };

  return (
    <aside className="sidebar glass" style={{ width: 'var(--sidebar-width)', height: '100vh', padding: '24px', borderRight: '1px solid var(--border-strong)', display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar__brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>Verse Voyage</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teacher Admin</div>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              transition: 'var(--transition)'
            })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer" style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={toggleTheme}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', width: '100%', textAlign: 'left' }}
        >
          {state.settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{state.settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius)', color: 'var(--error)', width: '100%', textAlign: 'left' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
