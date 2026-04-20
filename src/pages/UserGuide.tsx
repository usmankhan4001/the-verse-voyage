import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  GraduationCap, 
  Settings, 
  Users, 
  CalendarCheck, 
  Headphones, 
  FileText, 
  CheckSquare,
  HelpCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import './UserGuide.css';

export default function UserGuide() {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');

  return (
    <div className="guide">
      <header className="guide__header">
        <HelpCircle size={32} className="guide__header-icon" />
        <div className="guide__header-content">
          <h1>System Usage Guide</h1>
          <p>Learn how to navigate and master The Verse Voyage.</p>
        </div>
      </header>

      <div className="guide__tabs">
        <button 
          className={`guide__tab ${activeTab === 'teacher' ? 'active' : ''}`}
          onClick={() => setActiveTab('teacher')}
        >
          <ShieldCheck size={18} />
          <span>Teacher / Admin</span>
        </button>
        <button 
          className={`guide__tab ${activeTab === 'student' ? 'active' : ''}`}
          onClick={() => setActiveTab('student')}
        >
          <GraduationCap size={18} />
          <span>Student / Learner</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'teacher' ? (
          <motion.div 
            key="teacher"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="guide__panel"
          >
            <div className="guide__section">
              <h3><Users size={20} /> Management</h3>
              <div className="guide__grid">
                <Card padding="md">
                  <h4>Students</h4>
                  <p>Register students manually in the 'Students' tab. Students can also register themselves using a unique username and passcode via the portal.</p>
                </Card>
                <Card padding="md">
                  <h4>Attendance</h4>
                  <p>Daily attendance can be marked in the 'Dashboard' or 'Students' tab. Track daily progress and streaks at a glance.</p>
                </Card>
              </div>
            </div>

            <div className="guide__section">
              <h3><Settings size={20} /> Curriculum Configuration</h3>
              <div className="guide__info-card">
                <h4>Compulsory Audio Ranges</h4>
                <p>Navigate to <strong>Browse Surahs</strong> → <strong>Surah Detail</strong>. Each session (S1, S2, etc.) can have its own start and end ayah.</p>
                <ul>
                  <li><strong>Start/End Ayah:</strong> Sets the automated sequence for the student player.</li>
                  <li><strong>Tafseer Summary:</strong> Add a 3-5 line central message for the session.</li>
                  <li><strong>PDF Link:</strong> Provide lesson notes or resources.</li>
                </ul>
              </div>
            </div>

            <div className="guide__section">
              <h3><CalendarCheck size={20} /> Phase Unlocking</h3>
              <p>In <strong>Settings</strong>, you can set the <em>Unlocked Phase</em>. Students cannot access lessons in higher phases until you grant access.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="student"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="guide__panel"
          >
            <div className="guide__section">
              <h3><CheckSquare size={20} /> Compulsory Progress Rules</h3>
              <p>To move to the next session, you must complete the current one's requirements:</p>
              <div className="guide__grid">
                <Card padding="md">
                  <h4><Headphones size={18} /> 3-Listen Rule</h4>
                  <p>You must listen to the full ayah sequence of the session at least <strong>3 times</strong>. The Mastery HUD will track your cycles.</p>
                </Card>
                <Card padding="md">
                  <h4><FileText size={18} /> PDF Reading</h4>
                  <p>Open and read the provided PDF guide once. The system will mark it as complete immediately upon opening.</p>
                </Card>
              </div>
            </div>

            <div className="guide__section">
              <h3><Headphones size={20} /> Sequential Player</h3>
              <p>The player uses <strong>Sheikh Hussary Mujawwad</strong> recitation. It automatically progresses from the first to the last ayah of your specific lesson range.</p>
            </div>

            <div className="guide__section">
              <h3>🔒 Login & Security</h3>
              <p>Always use your <strong>Username</strong> and <strong>Numeric Passcode</strong>. The app remembers you on your device, so you won't need to log in every time unless you logout manually.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
