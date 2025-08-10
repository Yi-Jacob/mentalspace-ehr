import React from 'react';
import { Badge } from '@/components/basic/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default',
  className = ''
}) => {
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pending_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'signed': return 'bg-green-100 text-green-800 border-green-200';
    case 'accepted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    case 'locked': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatStatus = (status: string): string => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}; 