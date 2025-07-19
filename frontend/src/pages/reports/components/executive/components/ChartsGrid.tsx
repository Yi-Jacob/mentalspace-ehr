
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ExecutiveDashboardData } from '@/hooks/useReportData';

interface ChartsGridProps {
  dashboardData: ExecutiveDashboardData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ChartsGrid: React.FC<ChartsGridProps> = ({ dashboardData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {dashboardData.patientDemographics && dashboardData.patientDemographics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.patientDemographics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${Math.round((value / dashboardData.patientDemographics.reduce((sum, item) => sum + item.value, 0)) * 100)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {dashboardData.providerUtilization && dashboardData.providerUtilization.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Provider Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.providerUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                <Bar dataKey="utilization" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartsGrid;
