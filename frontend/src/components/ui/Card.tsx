import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 relative overflow-hidden',
        hoverable && 'glass-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
