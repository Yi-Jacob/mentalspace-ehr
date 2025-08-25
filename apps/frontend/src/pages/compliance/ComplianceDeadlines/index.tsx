
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const ComplianceDeadlines: React.FC = () => {
  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={AlertTriangle}
        title="Compliance Deadlines"
        description="Manage regulatory deadlines and compliance requirements"
      />

      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Deadlines</h3>
          <p className="text-gray-600">
            This page will contain compliance deadline management functionality.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default ComplianceDeadlines;
