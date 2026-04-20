import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick
}: CardProps) {
  const variantClass = variant === 'glass' ? 'glass' : 'card';
  const paddingClass = padding !== 'none' ? `p-${padding}` : '';
  const interactiveClass = onClick ? 'cursor-pointer hover-scale' : '';

  return (
    <div 
      className={`${variantClass} ${paddingClass} ${interactiveClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
