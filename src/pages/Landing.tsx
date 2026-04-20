import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Star, Sparkles } from 'lucide-react';
import './Landing.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Premium Background */}
      <div className="landing__bg">
        <div className="landing__glow landing__glow--1" />
        <div className="landing__glow landing__glow--2" />
        <div className="landing__mesh" />
      </div>

      <nav className="landing__nav">
        <div className="landing__nav-logo">
           <img src="/logo.png" alt="Verse Voyage" />
           <span>The Verse Voyage</span>
        </div>
        <button className="landing__admin-link" onClick={() => navigate('/admin')}>
           Teacher Portal
        </button>
      </nav>

      <motion.div 
        className="landing__content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="landing__hero" variants={item}>
          <div className="landing__badge">
             <Sparkles size={14} /> 
             <span>Step into a World of Quranic Mastery</span>
          </div>
          <h1 className="landing__title">
            Thematic Mastery of <br />
            <span className="text-gradient">Juz Amma</span>
          </h1>
          <p className="landing__subtitle">
            A premium learning sanctuary designed for the modern student. 
            Interactive hifz, thematic tafseer, and progress precision.
          </p>

          <div className="landing__actions">
            <button className="landing__btn landing__btn--primary" onClick={() => navigate('/student')}>
              <span>Start Your Journey</span>
              <ArrowRight size={20} />
            </button>
            <div className="landing__social-stats">
               <div className="landing__avatars">
                  {[1,2,3,4].map(i => <div key={i} className="landing__avatar" style={{background: `var(--accent-${i})`}} />)}
               </div>
               <div className="landing__stat-text">
                  <strong>Join 500+ Explorers</strong>
                  <div className="landing__stars">
                     {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="var(--gold)" stroke="none" />)}
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

        <div className="landing__features">
          {[
            { icon: <BookOpen />, title: 'Thematic Tafseer', desc: 'Understand the "Why" behind every Surah with Urdu insights.' },
            { icon: <Star />, title: 'Quest-Based Hifz', desc: 'Drip content ensures you master every session before moving forward.' },
            { icon: <Sparkles />, title: 'Premium HUD', desc: 'Track your listens, PDF studies, and quiz success in real-time.' }
          ].map((feat, i) => (
            <motion.div key={i} className="landing__feat-card" variants={item}>
               <div className="landing__feat-icon">{feat.icon}</div>
               <h4>{feat.title}</h4>
               <p>{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.footer className="landing__footer" variants={item}>
           <p>© {new Date().getFullYear()} The Verse Voyage. All Rights Reserved.</p>
           <div className="landing__footer-links">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Contact</span>
           </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
