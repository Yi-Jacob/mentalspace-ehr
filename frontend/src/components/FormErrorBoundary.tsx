
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  formName?: string;
}

const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({ children, formName = 'Form' }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`${formName} error:`, error, errorInfo);
    // In production, you might want to send this to an error reporting service
  };

  const fallback = (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">{formName} Error</p>
          <p className="text-sm">
            There was an error loading this form. Please refresh the page or contact support if the problem persists.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default FormErrorBoundary;
