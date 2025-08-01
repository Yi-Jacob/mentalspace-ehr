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
  const displayValue = value || fallback;
  
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="text-foreground">{displayValue}</div>
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
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}; 