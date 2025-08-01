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

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'signed': return 'bg-green-100 text-green-800';
    case 'submitted_for_review': return 'bg-blue-100 text-blue-800';
    case 'approved': return 'bg-emerald-100 text-emerald-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'locked': return 'bg-orange-100 text-orange-800';
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatStatus = (status: string): string => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}; 