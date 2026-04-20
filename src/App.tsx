import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import SurahExplorer from './pages/SurahExplorer';
import SurahDetail from './pages/SurahDetail';
import Sessions from './pages/Sessions';
import Students from './pages/Students';
import Quizzes from './pages/Quizzes';
import Settings from './pages/Settings';
import UserGuide from './pages/UserGuide';
import StudentPortal from './pages/student/StudentPortal';
import { useTheme } from './hooks/useTheme';
import { useAppState } from './hooks/useAppState';
import './App.css';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/surahs': 'Surahs',
  '/admin/sessions': 'Sessions',
  '/admin/students': 'Students',
  '/admin/quizzes': 'Quizzes',
  '/admin/settings': 'Settings',
  '/admin/guide': 'User Guide',
};

function AppContent() {
  const location = useLocation();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const {
    state,
    addStudent,
    registerStudent,
    removeStudent,
    markAttendance,
    completeSession,
    updateSessionProgress,
    updateStudentProgress,
    recordQuizSubmission,
    importSessionsFromCSV,
    addQuiz,
    removeQuiz,
    setTeacherNote,
    updateSettings,
    completedSessions,
  } = useAppState();

  const [isAdminAuth, setIsAdminAuth] = useState(() => localStorage.getItem('vv_admin_auth') === 'true');

  const isStudentArea = !location.pathname.startsWith('/admin');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Admin Auth Gate
  if (isAdminRoute && !isAdminAuth) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <h2>Teacher Access</h2>
          <p>Please enter the admin passcode to continue</p>
          <input 
            type="password" 
            placeholder="Passcode" 
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value;
                if (val === 'admin123') {
                  setIsAdminAuth(true);
                  localStorage.setItem('vv_admin_auth', 'true');
                } else {
                  alert('Invalid Passcode');
                }
              }
            }}
          />
          <button className="admin-gate__back" onClick={() => window.location.href = '/'}>
            Back to Student Portal
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = pageTitles[location.pathname] || 'The Verse Voyage';

  return (
    <div className={`app-shell ${isStudentArea ? 'app-shell--standalone' : ''}`}>
      {!isStudentArea && <Sidebar onToggleTheme={toggleTheme} resolvedTheme={resolvedTheme} />}

      <div className="app-main">
        {!isStudentArea && (
          <Header
            title={pageTitle}
            subtitle="The Verse Voyage"
            onToggleTheme={toggleTheme}
            resolvedTheme={resolvedTheme}
          />
        )}

        <main className={`app-content ${isStudentArea ? 'app-content--full' : ''}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Root redirects to student portal */}
              <Route path="/" element={<Navigate to="/student" replace />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<Dashboard state={state} completedSessions={completedSessions} />}
              />
              <Route path="/admin/surahs" element={<SurahExplorer state={state} />} />
              <Route
                path="/admin/surahs/:id"
                element={
                  <SurahDetail
                    state={state}
                    completeSession={completeSession}
                    updateSessionProgress={updateSessionProgress}
                    setTeacherNote={setTeacherNote}
                  />
                }
              />
              <Route
                path="/admin/sessions"
                element={
                  <Sessions 
                    state={state} 
                    completeSession={completeSession} 
                    importSessionsFromCSV={importSessionsFromCSV}
                  />
                }
              />
              <Route
                path="/admin/students"
                element={
                  <Students
                    state={state}
                    addStudent={addStudent}
                    removeStudent={removeStudent}
                    markAttendance={markAttendance}
                  />
                }
              />
              <Route
                path="/admin/quizzes"
                element={<Quizzes state={state} addQuiz={addQuiz} removeQuiz={removeQuiz} />}
              />
              <Route
                path="/admin/settings"
                element={
                  <Settings
                    state={state}
                    updateSettings={updateSettings}
                    theme={theme}
                    setTheme={setTheme}
                  />
                }
              />
              <Route path="/admin/guide" element={<UserGuide />} />

              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <StudentPortal
                    state={state}
                    registerStudent={registerStudent}
                    updateStudentProgress={updateStudentProgress}
                    recordQuizSubmission={recordQuizSubmission}
                    resolvedTheme={resolvedTheme}
                    toggleTheme={toggleTheme}
                  />
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {!isStudentArea && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
