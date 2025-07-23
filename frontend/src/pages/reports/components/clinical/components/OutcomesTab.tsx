
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClinicalReportsData } from '@/hooks/useReportData';

interface OutcomesTabProps {
  data: ClinicalReportsData;
}

const OutcomesTab: React.FC<OutcomesTabProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Outcomes Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.complianceRate.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Notes Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{data.avgCompletionTime.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Avg Completion Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{data.totalNotes}</div>
            <div className="text-sm text-gray-600">Total Notes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutcomesTab;
