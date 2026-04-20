import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Users,
  FileQuestion,
  Settings,
  Moon,
  Sun,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  onToggleTheme: () => void;
  resolvedTheme: 'light' | 'dark';
}

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/surahs', icon: BookOpen, label: 'Surahs' },
  { to: '/admin/sessions', icon: CalendarCheck, label: 'Sessions' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/quizzes', icon: FileQuestion, label: 'Quizzes' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ onToggleTheme, resolvedTheme }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/logo.png" alt="Logo" className="sidebar__logo-img" />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-title">The Verse</span>
          <span className="sidebar__brand-sub">Voyage</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {/* Help Link */}
        <NavLink
          to="/admin/guide"
          className={({ isActive }) =>
            `sidebar__link sidebar__link--guide ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <HelpCircle size={18} />
          <span>System Guide</span>
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__theme-toggle" onClick={onToggleTheme}>
          {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        
        <button className="sidebar__exit-btn" onClick={() => navigate('/')}>
          <LogOut size={16} />
          <span>Exit Portal</span>
        </button>
      </div>
    </aside>
  );
}
