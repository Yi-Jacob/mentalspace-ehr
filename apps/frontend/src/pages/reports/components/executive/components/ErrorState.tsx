
import React from 'react';
import { Button } from '@/components/basic/button';
import { RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading dashboard data</p>
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
