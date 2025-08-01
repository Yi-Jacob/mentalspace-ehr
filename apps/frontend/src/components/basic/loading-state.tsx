import React from 'react';

interface LoadingStateProps {
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  count = 2, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="animate-pulse space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export const LoadingCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}; 