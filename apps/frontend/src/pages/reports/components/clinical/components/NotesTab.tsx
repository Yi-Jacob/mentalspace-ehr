
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ClinicalReportsData } from '@/hooks/useReportData';

interface DocumentationTabProps {
  data: ClinicalReportsData;
  colors: string[];
}

const DocumentationTab: React.FC<DocumentationTabProps> = ({ data, colors }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {data.notesByType && data.notesByType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notes by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.notesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.notesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Documentation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.notesByType && data.notesByType.map((note, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium">{note.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{note.count}</div>
                  <div className="text-xs text-gray-500">{note.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationTab;
