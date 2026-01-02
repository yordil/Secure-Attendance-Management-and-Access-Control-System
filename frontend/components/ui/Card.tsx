import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className, hover = false }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700',
        hover && 'card-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>{children}</div>;
};

export const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>{children}</h3>;
};

export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
};

export const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700', className)}>{children}</div>;
};
