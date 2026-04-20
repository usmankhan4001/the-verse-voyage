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
          <h2>Teacher Access</h2>
          <p>Please enter the admin passcode to continue</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password"
              className="admin-gate__input"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              autoFocus
            />
            {error && <div style={{ color: 'var(--error)', marginBottom: '16px' }}>Invalid Passcode</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
              Verify Identity
            </button>
            <button type="button" className="admin-gate__back" onClick={() => window.location.href = '/'}>
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
          <div className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <Routes>
                <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
                <Route path="/admin/students" element={<AdminGate><AdminStudents /></AdminGate>} />
                <Route path="/admin/sessions" element={<AdminGate><AdminSessions /></AdminGate>} />
                <Route path="/admin/settings" element={<AdminGate><Settings /></AdminGate>} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/" element={<Navigate to="/student" replace />} />
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
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
