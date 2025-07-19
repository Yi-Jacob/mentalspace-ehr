
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Button } from '@/components/shared/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { errorLogger } from '@/services/errorLogging';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName, onError } = this.props;
    
    // Log error with context
    errorLogger.logError(error, {
      component: componentName || 'Unknown Component',
      action: 'Component Render',
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      },
    }, 'high');

    this.setState({ errorInfo });
    onError?.(error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showErrorDetails = false, enableRetry = true } = this.props;
      const { error, retryCount } = this.state;
      const canRetry = enableRetry && retryCount < this.maxRetries;

      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-6 space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm">
                    {error?.message || 'An unexpected error occurred. Please try again.'}
                  </p>
                </div>
                
                {showErrorDetails && error?.stack && (
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium">
                      <Bug className="inline h-3 w-3 mr-1" />
                      Error Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {error.stack}
                    </pre>
                  </details>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {canRetry && (
                    <Button onClick={this.handleRetry} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again ({this.maxRetries - retryCount} left)
                    </Button>
                  )}
                  <Button onClick={this.handleReload} variant="outline" size="sm">
                    Reload Page
                  </Button>
                </div>
                
                {retryCount > 0 && (
                  <p className="text-xs text-gray-600">
                    Retry attempt: {retryCount}/{this.maxRetries}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
