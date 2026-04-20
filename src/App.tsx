import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppStateProvider, useAppState } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StudentPortal from './pages/student/StudentPortal';
import AdminDashboard from './pages/Dashboard';
import AdminStudents from './pages/Students';
import AdminSessions from './pages/Sessions';
import Settings from './pages/Settings';

/**
 * AdminGate HOC: Protects routes with the teacher passcode
 */
const AdminGate = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppState();
  const [isAuthorized, setIsAuthorized] = useState(() => localStorage.getItem('vv_admin_auth') === 'true');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === state.settings.adminPasscode) {
      setIsAuthorized(true);
      localStorage.setItem('vv_admin_auth', 'true');
    } else {
      setError(true);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card card glass animate-slide-up">
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>
             🔒
          </div>
          <h2>Teacher Access</h2>
          <p>Please enter the admin passcode to continue</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password"
              className="admin-gate__input"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              placeholder="••••"
              autoFocus
            />
            {error && <div style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Invalid Passcode</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px', height: '48px' }}>
              Verify Identity
            </button>
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }} onClick={() => window.location.href = '/'}>
              Return to Student Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function AppContent() {
  const { state } = useAppState();
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <div className={`app-shell ${isAdminArea ? 'app-shell--admin' : 'app-shell--student'}`} data-theme={state.settings.theme}>
      {isAdminArea ? (
        <div className="app-container">
          <Sidebar />
          <div className="app-main">
            <Header />
            <main className="app-content">
              <AdminGate>
                <Routes>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/students" element={<AdminStudents />} />
                  <Route path="/admin/sessions" element={<AdminSessions />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Routes>
              </AdminGate>
            </main>
          </div>
        </div>
      ) : (
        <main className="app-shell--student">
          <Routes>
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/" element={<Navigate to="/student" replace />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppStateProvider>
  );
}
