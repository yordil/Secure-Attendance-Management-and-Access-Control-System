import React from 'react';
import { cn, getRoleBadgeColor, getStatusBadgeColor } from '@/lib/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'role' | 'status';
  type?: string;
  className?: string;
}

const Badge = ({ children, variant = 'default', type, className }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  let variantStyles = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  if (variant === 'role' && type) {
    variantStyles = getRoleBadgeColor(type);
  } else if (variant === 'status' && type) {
    variantStyles = getStatusBadgeColor(type);
  }

  return <span className={cn(baseStyles, variantStyles, className)}>{children}</span>;
};

export default Badge;
