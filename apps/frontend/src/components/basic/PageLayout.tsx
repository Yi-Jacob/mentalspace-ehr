import React from 'react';
import { cn } from '@/utils/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'simple';
  className?: string;
  containerClassName?: string;
  showContainer?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  variant = 'default',
  className,
  containerClassName,
  showContainer = true
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50',
          container: 'container mx-auto px-6 py-6'
        };
      case 'simple':
        return {
          background: 'min-h-screen bg-white',
          container: 'container mx-auto px-6 py-6'
        };
      default:
        return {
          background: 'min-h-screen bg-gray-50',
          container: 'container mx-auto px-6 py-6'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(styles.background, className)}>
      {showContainer ? (
        <div className={cn(styles.container, containerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PageLayout; 