
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Users, Clock, TrendingUp, Download } from 'lucide-react';

const ClinicalReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  // Mock data
  const clinicalMetrics = {
    totalNotes: 1248,
    notesCompleted: 1156,
    notesOverdue: 92,
    avgCompletionTime: 2.3,
    complianceRate: 92.6
  };

  const notesByType = [
    { type: 'Progress Notes', count: 456, percentage: 36.5 },
    { type: 'Initial Assessments', count: 234, percentage: 18.8 },
    { type: 'Treatment Plans', count: 198, percentage: 15.9 },
    { type: 'Discharge Notes', count: 156, percentage: 12.5 },
    { type: 'Crisis Notes', count: 89, percentage: 7.1 },
    { type: 'Other', count: 115, percentage: 9.2 }
  ];

  const providerProductivity = [
    { provider: 'Dr. Smith', notes: 156, avgTime: 1.8, compliance: 95 },
    { provider: 'Dr. Johnson', notes: 142, avgTime: 2.1, compliance: 89 },
    { provider: 'Dr. Brown', notes: 134, avgTime: 2.5, compliance: 93 },
    { provider: 'Dr. Davis', notes: 98, avgTime: 3.2, compliance: 85 }
  ];

  const diagnosisDistribution = [
    { diagnosis: 'Anxiety Disorders', count: 89, percentage: 26.0 },
    { diagnosis: 'Depressive Disorders', count: 76, percentage: 22.2 },
    { diagnosis: 'ADHD', count: 45, percentage: 13.2 },
    { diagnosis: 'PTSD', count: 38, percentage: 11.1 },
    { diagnosis: 'Bipolar Disorder', count: 32, percentage: 9.4 },
    { diagnosis: 'Other', count: 62, percentage: 18.1 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clinical Reports</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="outcomes">Patient Outcomes</SelectItem>
              <SelectItem value="quality">Quality Metrics</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Clinical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold">{clinicalMetrics.totalNotes}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{clinicalMetrics.notesCompleted}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{clinicalMetrics.notesOverdue}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time (hrs)</p>
                <p className="text-2xl font-bold">{clinicalMetrics.avgCompletionTime}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{clinicalMetrics.complianceRate}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documentation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="productivity">Provider Productivity</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={notesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {notesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notesByType.map((note, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Productivity Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={providerProductivity}>
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
                {providerProductivity.map((provider, index) => (
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
                        <span className="font-semibold">{provider.avgTime}h</span> avg time
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
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={diagnosisDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="diagnosis" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Outcomes Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-gray-600">Treatment Goals Met</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Patient Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">12%</div>
                  <div className="text-sm text-gray-600">Readmission Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicalReports;
