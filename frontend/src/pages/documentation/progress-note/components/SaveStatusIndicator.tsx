
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/utils/utils';

interface SaveStatusIndicatorProps {
  lastSaved?: Date;
  isLoading?: boolean;
  hasUnsavedChanges?: boolean;
  isOnline?: boolean;
}

const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  lastSaved,
  isLoading = false,
  hasUnsavedChanges = false,
  isOnline = true
}) => {
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: 'Offline - Changes saved locally',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
      };
    }
    
    if (isLoading) {
      return {
        icon: Clock,
        text: 'Saving...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: AlertCircle,
        text: 'Unsaved changes',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
      };
    }
    
    return {
      icon: CheckCircle,
      text: lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : 'All changes saved',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    };
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm",
      status.bgColor
    )}>
      <Icon className={cn("h-4 w-4", status.color)} />
      <span className={status.color}>{status.text}</span>
      {isOnline && (
        <Wifi className="h-3 w-3 text-gray-400" />
      )}
    </div>
  );
};

export default SaveStatusIndicator;
