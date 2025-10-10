import React from 'react';
import { cn } from '@/utils/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  maxCount?: number;
  showZero?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className,
  maxCount = 99,
  showZero = false
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <div
      className={cn(
        "absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 flex items-center justify-center",
        "bg-red-500 text-white text-xs font-bold rounded-full",
        "border-2 border-white shadow-sm",
        "animate-pulse",
        className
      )}
    >
      {displayCount}
    </div>
  );
};
