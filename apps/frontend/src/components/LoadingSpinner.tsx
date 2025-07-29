
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-[#1e40af] rounded-full animate-spin"></div>
      </div>
      
      {message && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
