import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  variant?: 'primary' | 'gold' | 'success';
  showPercent?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  variant = 'primary',
  showPercent,
  className = ''
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`progress-container ${className}`}>
      {(label || showPercent) && (
        <div className="progress-info">
          {label && <span className="progress-label">{label}</span>}
          {showPercent && <span className="progress-value">{clampedProgress}%</span>}
        </div>
      )}
      <div className="progress-bg">
        <div 
          className={`progress-fill progress-fill--${variant}`} 
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
