
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface LoadingWithErrorProps {
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorTitle?: string;
  errorDescription?: string;
  showRetry?: boolean;
  retryCount?: number;
  maxRetries?: number;
  children: React.ReactNode;
}

const LoadingWithError: React.FC<LoadingWithErrorProps> = ({
  isLoading,
  error,
  onRetry,
  loadingComponent,
  errorTitle = 'Failed to load data',
  errorDescription,
  showRetry = true,
  retryCount = 0,
  maxRetries = 3,
  children,
}) => {
  if (isLoading) {
    return loadingComponent || <DefaultLoadingSkeleton />;
  }

  if (error) {
    const canRetry = showRetry && onRetry && retryCount < maxRetries;

    return (
      <Alert variant="destructive" className="m-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <div className="flex-1 space-y-2">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{errorTitle}</p>
                <p className="text-sm">
                  {errorDescription || error.message || 'An error occurred while loading the data.'}
                </p>
                
                {canRetry && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Button onClick={onRetry} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    {retryCount > 0 && (
                      <span className="text-xs text-gray-500">
                        Attempt {retryCount}/{maxRetries}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  return <>{children}</>;
};

const DefaultLoadingSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

export default LoadingWithError;
