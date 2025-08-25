import React from 'react';
import { FileText } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const SessionCompletionTracking: React.FC = () => {
  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={FileText}
        title="Session Completion Tracking"
        description="Track session completion rates and compliance requirements"
      />

      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Session Completion Tracking</h3>
          <p className="text-gray-600">
            This page will contain session completion tracking functionality.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default SessionCompletionTracking;
