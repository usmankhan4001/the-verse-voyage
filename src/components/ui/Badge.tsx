interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'gold' | 'muted';
  dot?: boolean;
  className?: string;
}

export default function Badge({
  label,
  variant = 'muted',
  dot,
  className = ''
}: BadgeProps) {
  const variantClass = `badge--${variant}`;
  
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {dot && <span className="badge__dot" />}
      {label}
    </span>
  );
}
