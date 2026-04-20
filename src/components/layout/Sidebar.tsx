import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Settings,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { useAppState } from '../../context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { id: 'students', label: 'Students', icon: <Users size={20} />, path: '/admin/students' },
  { id: 'sessions', label: 'Curriculum', icon: <CalendarCheck size={20} />, path: '/admin/sessions' },
];

export default function Sidebar() {
  const { state, dispatch } = useAppState();
  useNavigate();

  const toggleTheme = () => {
    const next = state.settings.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: next } });
  };

  const handleLogout = () => {
    if (confirm('Disconnect from Admin Console?')) {
       localStorage.removeItem('vv_admin_auth');
       window.location.href = '/';
    }
  };

  return (
    <aside className="app-sidebar">
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px' }}>
           V
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>Verse Voyage</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Teacher Portal</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'var(--transition)',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent'
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '24px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', width: '100%',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500
          }}
        >
          {state.settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{state.settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <NavLink
            to="/admin/settings"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
            })}
          >
            <Settings size={18} />
            <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', width: '100%',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', 
            fontSize: '13px', fontWeight: 500
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
