
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';

interface AuditReportsActionProps {
  onNavigate: () => void;
}

const AuditReportsAction: React.FC<AuditReportsActionProps> = ({ onNavigate }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onNavigate}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Audit Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3">View system audit logs and reports</p>
        <Button size="sm" className="w-full">
          <span>Access</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuditReportsAction;
