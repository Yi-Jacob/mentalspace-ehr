import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { cn } from '@/utils/utils';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  action,
  badge,
  className
}) => {
  const styles = {
    container: '',
    iconContainer: 'bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl',
    title: 'text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent',
    description: 'text-gray-600 mt-1'
  };

  return (
    <div className={cn('flex items-center justify-between mb-8', styles.container, className)}>
      <div className="flex items-center space-x-4">
        {Icon && (
          <div className={cn('text-white shadow-lg', styles.iconContainer)}>
            <Icon className="h-8 w-8" />
          </div>
        )}
        <div>
          <div className="flex items-center space-x-3">
            <h1 className={styles.title}>
              {title}
            </h1>
            {badge && (
              <div className="flex-shrink-0">
                {badge}
              </div>
            )}
          </div>
          {description && (
            <div className={styles.description}>
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center space-x-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 