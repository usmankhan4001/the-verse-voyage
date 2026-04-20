import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  CalendarCheck,
  Trophy,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react';
import Card from '../components/ui/Card';
import MetricTile from '../components/ui/MetricTile';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import { surahs, phaseInfo, getSurahsByPhase, getTotalSessions } from '../data/surahs';
import type { AppState } from '../data/store';
import './Dashboard.css';

interface DashboardProps {
  state: AppState;
  completedSessions: number;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard({ state, completedSessions }: DashboardProps) {
  const navigate = useNavigate();
  const totalSessions = getTotalSessions();
  const progressPct = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const currentPhase = state.settings.currentPhase;
  const currentPhaseSurahs = getSurahsByPhase(currentPhase);
  const phaseData = phaseInfo.find(p => p.phase === currentPhase)!;

  // Find the next incomplete surah in current phase
  const nextSurah = currentPhaseSurahs.find(s => {
    for (let i = 0; i < s.sessions; i++) {
      const key = `${s.num}-${i}`;
      if (!state.sessionProgress[key]?.completed) return true;
    }
    return false;
  }) || currentPhaseSurahs[0];

  const phaseColors: Record<number, string> = {
    1: 'var(--phase-1)',
    2: 'var(--phase-2)',
    3: 'var(--phase-3)',
    4: 'var(--phase-4)',
  };

  const badgeColors: Record<number, 'green' | 'purple' | 'gold' | 'coral'> = {
    1: 'green',
    2: 'purple',
    3: 'gold',
    4: 'coral',
  };

  return (
    <motion.div className="dashboard" variants={container} initial="hidden" animate="show">
      {/* Hero Section */}
      <motion.div className="dashboard__hero" variants={item}>
        <div className="dashboard__hero-content">
          <div className="dashboard__hero-text">
            <h1 className="dashboard__greeting">
              <span className="arabic" style={{ fontSize: '22px', color: 'var(--gold)' }}>بِسْمِ اللَّهِ</span>
            </h1>
            <h2 className="dashboard__title">The Verse Voyage</h2>
            <p className="dashboard__subtitle">
              {phaseData.label} · {phaseData.name} · Month {phaseData.months}
            </p>
          </div>
          <ProgressRing
            value={progressPct}
            size={110}
            strokeWidth={7}
            color={phaseColors[currentPhase]}
            label={`${progressPct}%`}
            sublabel="Complete"
          />
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div className="dashboard__metrics" variants={item}>
        <MetricTile
          value={surahs.length}
          label="Total Surahs"
          icon={<BookOpen size={18} />}
          color="var(--primary)"
        />
        <MetricTile
          value={completedSessions}
          label="Sessions Done"
          icon={<CalendarCheck size={18} />}
          color="var(--purple)"
        />
        <MetricTile
          value={state.students.length}
          label="Students"
          icon={<Users size={18} />}
          color="var(--blue)"
        />
        <MetricTile
          value={state.quizzes.length}
          label="Quizzes Created"
          icon={<Trophy size={18} />}
          color="var(--gold)"
        />
      </motion.div>

      {/* Quick Actions + Current Surah */}
      <div className="dashboard__grid">
        {/* Next Session Card */}
        <motion.div variants={item}>
          <Card className="dashboard__next-session" variant="default" padding="lg">
            <div className="dashboard__section-header">
              <Zap size={16} style={{ color: 'var(--gold)' }} />
              <span>Next Session</span>
            </div>
            <div className="dashboard__next-surah">
              <div className="dashboard__next-surah-num arabic">{nextSurah.arabic}</div>
              <div className="dashboard__next-surah-info">
                <h3>Surah {nextSurah.name}</h3>
                <p>{nextSurah.ayaat} ayaat · {nextSurah.sessions} sessions</p>
                <p className="dashboard__next-themes">{nextSurah.themes}</p>
              </div>
            </div>
            <button
              className="dashboard__action-btn"
              onClick={() => navigate(`/admin/surahs/${nextSurah.num}`)}
            >
              Open Surah <ArrowRight size={14} />
            </button>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card padding="lg">
            <div className="dashboard__section-header">
              <Target size={16} style={{ color: 'var(--primary)' }} />
              <span>Quick Actions</span>
            </div>
            <div className="dashboard__actions">
              <button className="dashboard__quick-btn" onClick={() => navigate('/admin/surahs')}>
                <BookOpen size={18} />
                <span>Browse Surahs</span>
              </button>
              <button className="dashboard__quick-btn" onClick={() => navigate('/admin/students')}>
                <Users size={18} />
                <span>Take Attendance</span>
              </button>
              <button className="dashboard__quick-btn" onClick={() => navigate('/admin/quizzes')}>
                <Trophy size={18} />
                <span>Create Quiz</span>
              </button>
              <button className="dashboard__quick-btn" onClick={() => navigate('/admin/sessions')}>
                <CalendarCheck size={18} />
                <span>Session Builder</span>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Phase Progress */}
      <motion.div variants={item}>
        <Card padding="lg">
          <div className="dashboard__section-header">
            <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
            <span>Phase Progress</span>
          </div>
          <div className="dashboard__phases">
            {phaseInfo.map(phase => {
              const phaseSurahs = getSurahsByPhase(phase.phase);
              const phaseTotalSessions = phaseSurahs.reduce((s, su) => s + su.sessions, 0);
              const phaseCompleted = phaseSurahs.reduce((s, su) => {
                let count = 0;
                for (let i = 0; i < su.sessions; i++) {
                  if (state.sessionProgress[`${su.num}-${i}`]?.completed) count++;
                }
                return s + count;
              }, 0);
              const pct = phaseTotalSessions > 0 ? Math.round((phaseCompleted / phaseTotalSessions) * 100) : 0;

              return (
                <div
                  key={phase.phase}
                  className={`dashboard__phase-row ${currentPhase === phase.phase ? 'dashboard__phase-row--active' : ''}`}
                >
                  <div className="dashboard__phase-info">
                    <div className="dashboard__phase-title">
                      <Badge color={badgeColors[phase.phase]}>{phase.label}</Badge>
                      <span>{phase.name}</span>
                    </div>
                    <span className="dashboard__phase-count">
                      {phaseSurahs.length} surahs · {phaseCompleted}/{phaseTotalSessions} sessions
                    </span>
                  </div>
                  <div className="dashboard__phase-bar-wrap">
                    <div
                      className="dashboard__phase-bar"
                      style={{
                        width: `${pct}%`,
                        background: phaseColors[phase.phase],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
