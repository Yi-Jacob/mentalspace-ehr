import React from 'react';

interface InfoDisplayProps {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  className?: string;
}

export const InfoDisplay: React.FC<InfoDisplayProps> = ({ 
  label, 
  value, 
  fallback = 'Not provided',
  className = ''
}) => {
  const hasValue = value && value.toString().trim() !== '';
  const displayValue = hasValue ? value : fallback;
  const isEmpty = !hasValue;
  
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-500 block">{label}</label>
      <div className={`text-sm ${isEmpty ? 'text-gray-400 italic' : 'text-gray-900 font-medium'}`}>
        {displayValue}
      </div>
    </div>
  );
};

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ 
  title, 
  children, 
  className = ''
}) => {
  return (
    <div className={className}>
      <h3 className="font-semibold text-lg mb-4 text-gray-900">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}; 