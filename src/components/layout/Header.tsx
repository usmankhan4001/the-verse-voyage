import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAppState } from '../../context/AppContext';

const pageTitles: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/students': 'Student Management',
  '/admin/sessions': 'Curriculum Manager',
  '/admin/settings': 'System Settings',
};

export default function Header() {
  const { state } = useAppState();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'The Verse Voyage';

  return (
    <header className="header glass" style={{ height: 'var(--header-height)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-strong)', background: 'var(--bg-elevated)' }}>
      <div className="header__left">
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
      </div>

      <div className="header__right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="header__search" style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search students..." 
            style={{ padding: '8px 12px 8px 40px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--bg)', width: '240px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="sp__icon-btn" style={{ position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%', border: '2px solid var(--bg-elevated)' }} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{state.settings.teacherName || 'Head Teacher'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Administrator</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
