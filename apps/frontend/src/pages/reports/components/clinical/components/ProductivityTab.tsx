
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ClinicalReportsData } from '@/hooks/useReportData';

interface ProductivityTabProps {
  data: ClinicalReportsData;
}

const ProductivityTab: React.FC<ProductivityTabProps> = ({ data }) => {
  if (!data.providerProductivity || data.providerProductivity.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No productivity data available</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Provider Productivity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.providerProductivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="notes" fill="#8884d8" name="Notes Completed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.providerProductivity.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{provider.provider}</div>
                    <div className="text-sm text-gray-600">
                      {provider.notes} notes completed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <span className="font-semibold">{provider.avgTime.toFixed(1)}h</span> avg time
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{provider.compliance}%</span> compliance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductivityTab;
