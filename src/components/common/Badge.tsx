import React from 'react';

export type BadgeVariant = 
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'blue'
  | 'indigo'
  | 'gold'
  | 'terracotta'
  | 'zinc';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/40',
    primary: 'bg-zinc-800 text-zinc-100 border-zinc-700',
    zinc: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
    blue: 'bg-blue-950/40 text-blue-300 border-blue-900/40',
    indigo: 'bg-zinc-800 text-zinc-200 border-zinc-700/60',
    purple: 'bg-purple-950/40 text-purple-300 border-purple-900/40',
    gold: 'bg-amber-950/30 text-amber-300 border-amber-900/40',
    terracotta: 'bg-zinc-800 text-zinc-300 border-zinc-700/40',
    success: 'bg-emerald-950/40 text-emerald-300 border-emerald-900/40',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-900/40',
    danger: 'bg-rose-950/40 text-rose-300 border-rose-900/40',
    info: 'bg-zinc-800/80 text-zinc-200 border-zinc-700/50',
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-zinc-400',
    primary: 'bg-zinc-200',
    zinc: 'bg-zinc-400',
    blue: 'bg-blue-400',
    indigo: 'bg-zinc-300',
    purple: 'bg-purple-400',
    gold: 'bg-amber-400',
    terracotta: 'bg-zinc-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-zinc-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-md gap-1.5 font-medium',
    md: 'text-sm px-3 py-1 rounded-md gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center border tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
