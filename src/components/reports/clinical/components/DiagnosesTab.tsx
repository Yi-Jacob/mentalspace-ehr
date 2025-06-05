
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ClinicalReportsData } from '@/hooks/useReportData';

interface DiagnosesTabProps {
  data: ClinicalReportsData;
}

const DiagnosesTab: React.FC<DiagnosesTabProps> = ({ data }) => {
  if (!data.diagnosisDistribution || data.diagnosisDistribution.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No diagnosis data available</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.diagnosisDistribution} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="diagnosis" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DiagnosesTab;
