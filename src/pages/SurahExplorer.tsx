import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, BookOpen } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { surahs, phaseInfo, getSurahsByPhase, type Surah } from '../data/surahs';
import type { AppState } from '../data/store';
import './SurahExplorer.css';

interface SurahExplorerProps {
  state: AppState;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SurahExplorer({ state }: SurahExplorerProps) {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(0); // 0 = all
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = (activePhase === 0 ? surahs : getSurahsByPhase(activePhase))
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.arabic.includes(search) ||
      s.num.toString().includes(search)
    );

  const getCompletedSessions = (surah: Surah) => {
    let done = 0;
    for (let i = 0; i < surah.sessions; i++) {
      if (state.sessionProgress[`${surah.num}-${i}`]?.completed) done++;
    }
    return done;
  };

  const phaseColorMap: Record<number, 'green' | 'purple' | 'gold' | 'coral'> = {
    1: 'green', 2: 'purple', 3: 'gold', 4: 'coral',
  };

  return (
    <div className="surah-explorer">
      {/* Header */}
      <div className="surah-explorer__head">
        <div>
          <h2 className="page-title">Surah Explorer</h2>
          <p className="page-subtitle">{surahs.length} surahs across 4 phases</p>
        </div>
      </div>

      {/* Controls */}
      <div className="surah-explorer__controls">
        <div className="surah-explorer__search">
          <Search size={16} className="surah-explorer__search-icon" />
          <input
            type="text"
            placeholder="Search by name, number, or Arabic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="surah-explorer__view-toggle">
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="surah-explorer__tabs">
        <button
          className={`surah-explorer__tab ${activePhase === 0 ? 'surah-explorer__tab--active' : ''}`}
          onClick={() => setActivePhase(0)}
        >
          All ({surahs.length})
        </button>
        {phaseInfo.map(p => (
          <button
            key={p.phase}
            className={`surah-explorer__tab ${activePhase === p.phase ? 'surah-explorer__tab--active' : ''}`}
            onClick={() => setActivePhase(p.phase)}
          >
            {p.label} ({getSurahsByPhase(p.phase).length})
          </button>
        ))}
      </div>

      {/* Surah Grid/List */}
      <motion.div
        className={`surah-explorer__grid ${viewMode === 'list' ? 'surah-explorer__grid--list' : ''}`}
        variants={container}
        initial="hidden"
        animate="show"
        key={`${activePhase}-${viewMode}`}
      >
        {filtered.map(surah => {
          const done = getCompletedSessions(surah);
          const pct = Math.round((done / surah.sessions) * 100);
          const isComplete = done === surah.sessions;

          return (
            <motion.div key={surah.num} variants={item}>
              <Card
                variant="default"
                padding={viewMode === 'list' ? 'sm' : 'md'}
                className={`surah-card ${isComplete ? 'surah-card--complete' : ''}`}
                onClick={() => navigate(`/admin/surahs/${surah.num}`)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="surah-card__top">
                      <span className="surah-card__num">{surah.num}</span>
                      <Badge color={phaseColorMap[surah.phase]} size="sm">
                        P{surah.phase}
                      </Badge>
                    </div>
                    <div className="surah-card__arabic arabic">{surah.arabic}</div>
                    <h3 className="surah-card__name">{surah.name}</h3>
                    <p className="surah-card__meta">
                      {surah.ayaat} ayaat · {surah.sessions} sessions
                    </p>
                    <div className="surah-card__progress-bar">
                      <div
                        className="surah-card__progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="surah-card__progress-text">
                      {done}/{surah.sessions} {isComplete ? '✓' : ''}
                    </span>
                  </>
                ) : (
                  <div className="surah-card__list">
                    <span className="surah-card__num">{surah.num}</span>
                    <div className="surah-card__list-info">
                      <div className="surah-card__list-title">
                        <span className="surah-card__name">{surah.name}</span>
                        <span className="surah-card__arabic-sm arabic">{surah.arabic}</span>
                      </div>
                      <span className="surah-card__meta">
                        {surah.ayaat} ayaat · {surah.themes.split('·')[0].trim()}
                      </span>
                    </div>
                    <Badge color={phaseColorMap[surah.phase]} size="sm">
                      {done}/{surah.sessions}
                    </Badge>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="surah-explorer__empty">
          <BookOpen size={48} />
          <p>No surahs found</p>
        </div>
      )}
    </div>
  );
}
