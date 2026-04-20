import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileQuestion,
  CalendarCheck,
} from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Home' },
  { to: '/admin/surahs', icon: BookOpen, label: 'Surahs' },
  { to: '/admin/sessions', icon: CalendarCheck, label: 'Board' },
  { to: '/admin/students', icon: Users, label: 'Staff' },
  { to: '/admin/quizzes', icon: FileQuestion, label: 'Quiz' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/admin'}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
