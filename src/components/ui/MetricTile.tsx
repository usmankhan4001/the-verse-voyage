import type { ReactNode } from 'react';
import './MetricTile.css';

interface MetricTileProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricTile({ value, label, icon, color }: MetricTileProps) {
  return (
    <div className="metric-tile">
      {icon && (
        <div className="metric-tile__icon" style={color ? { color } : undefined}>
          {icon}
        </div>
      )}
      <div className="metric-tile__value" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="metric-tile__label">{label}</div>
    </div>
  );
}
