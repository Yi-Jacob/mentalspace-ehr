
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuditLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Audit logs functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
