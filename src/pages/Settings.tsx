import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Sun, Moon, Monitor, Palette, Lock } from 'lucide-react';
import Card from '../components/ui/Card';
import type { AppState } from '../data/store';
import { exportData, importData } from '../data/store';
import './Settings.css';

interface SettingsProps {
  state: AppState;
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export default function Settings({ state, updateSettings, theme, setTheme }: SettingsProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `juz-amma-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const result = importData(text);
      if (result) {
        setImportStatus('Data imported successfully! Refresh to see changes.');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus('Failed to import data. Invalid format.');
      }
    };
    input.click();
  };

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="page-title">Settings</h2>
      <p className="page-subtitle">Configure your Juz Amma CMS</p>

      {/* Appearance */}
      <Card padding="lg">
        <h3 className="settings-page__section-title">
          <Palette size={16} /> Appearance
        </h3>
        <div className="settings-page__theme-options">
          {([
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'system', icon: Monitor, label: 'System' },
          ] as const).map(opt => (
            <button
              key={opt.value}
              className={`settings-page__theme-btn ${theme === opt.value ? 'settings-page__theme-btn--active' : ''}`}
              onClick={() => setTheme(opt.value)}
            >
              <opt.icon size={20} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Student Access & Phase Locking */}
      <Card padding="lg">
        <h3 className="settings-page__section-title">
          <Lock size={16} /> Student Access
        </h3>
        <p className="settings-page__desc">
          Control which phases are "unlocked" and visible to students in the Student Portal.
        </p>
        <div className="settings-page__field">
          <label>Unlocked Phase (for Students)</label>
          <select
            value={state.settings.unlockedPhase || 1}
            onChange={e => updateSettings({ unlockedPhase: Number(e.target.value) })}
          >
            <option value={1}>Phase 1 (Surah 99–114) Only</option>
            <option value={2}>Phase 1 & 2 (Surah 93–114)</option>
            <option value={3}>Phase 1, 2 & 3 (Surah 87–114)</option>
            <option value={4}>Full Access (All 37 Surahs)</option>
          </select>
        </div>
      </Card>

      {/* Course Settings */}
      <Card padding="lg">
        <h3 className="settings-page__section-title">Course Information</h3>
        <div className="settings-page__field">
          <label>Course Name</label>
          <input
            type="text"
            value={state.settings.courseName}
            onChange={e => updateSettings({ courseName: e.target.value })}
          />
        </div>
        <div className="settings-page__field">
          <label>Teacher Name</label>
          <input
            type="text"
            value={state.settings.teacherName}
            onChange={e => updateSettings({ teacherName: e.target.value })}
            placeholder="Your name..."
          />
        </div>
        <div className="settings-page__field">
          <label>Admin Current Phase (Dashboard View)</label>
          <select
            value={state.settings.currentPhase}
            onChange={e => updateSettings({ currentPhase: Number(e.target.value) })}
          >
            <option value={1}>Phase 1 — Ruba 4 (Surah 99–114)</option>
            <option value={2}>Phase 2 — Ruba 3 (Surah 93–98)</option>
            <option value={3}>Phase 3 — Ruba 2 (Surah 87–92)</option>
            <option value={4}>Phase 4 — Ruba 1 (Surah 78–86)</option>
          </select>
        </div>
      </Card>

      {/* Data Management */}
      <Card padding="lg">
        <h3 className="settings-page__section-title">Data Management</h3>
        <p className="settings-page__desc">
          All data is stored locally in your browser. Use export/import to backup or transfer data.
        </p>
        <div className="settings-page__data-actions">
          <button className="settings-page__export-btn" onClick={handleExport}>
            <Download size={16} /> Export Backup
          </button>
          <button className="settings-page__import-btn" onClick={handleImport}>
            <Upload size={16} /> Import Data
          </button>
        </div>
        {importStatus && (
          <p className="settings-page__import-status">{importStatus}</p>
        )}
      </Card>

      {/* About */}
      <Card padding="lg">
        <h3 className="settings-page__section-title">About</h3>
        <div className="settings-page__about">
          <p><strong>Juz Amma Mastery CMS</strong></p>
          <p>Version 1.1.0 (Student Content Update)</p>
          <p>A premium course management system for Hifz, Translation & Tafseer of Juz Amma.</p>
          <p className="settings-page__about-sub">
            37 Surahs · 4 Phases · Resource Integration · WhatsApp Delivery
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
