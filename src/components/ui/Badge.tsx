import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'gold' | 'purple' | 'coral' | 'blue' | 'muted';
  size?: 'sm' | 'md';
}

const colorMap = {
  green: { bg: 'var(--success-light)', text: 'var(--primary)' },
  gold: { bg: 'var(--gold-light)', text: 'var(--gold-text)' },
  purple: { bg: 'var(--purple-light)', text: 'var(--purple-text)' },
  coral: { bg: 'var(--coral-light)', text: 'var(--coral-text)' },
  blue: { bg: 'var(--blue-light)', text: 'var(--blue-text)' },
  muted: { bg: 'var(--surface-hover)', text: 'var(--text-secondary)' },
};

export default function Badge({ children, color = 'green', size = 'sm' }: BadgeProps) {
  const c = colorMap[color];
  return (
    <span
      className={`badge badge--${size}`}
      style={{ background: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
}
