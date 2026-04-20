import { Moon, Sun, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onToggleTheme: () => void;
  resolvedTheme: 'light' | 'dark';
}

export default function Header({ title, subtitle, onToggleTheme, resolvedTheme }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header__right">
        <button className="header__icon-btn" onClick={onToggleTheme} title="Toggle theme">
          {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
