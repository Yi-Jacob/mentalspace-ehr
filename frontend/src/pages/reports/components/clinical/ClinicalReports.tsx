
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClinicalReportsData } from '@/hooks/useReportData';
import ClinicalHeader from './components/ClinicalHeader';
import ClinicalMetricsGrid from './components/ClinicalMetricsGrid';
import NotesTab from './components/NotesTab';
import ProductivityTab from './components/ProductivityTab';
import DiagnosesTab from './components/DiagnosesTab';
import OutcomesTab from './components/OutcomesTab';
import ClinicalLoadingState from './components/ClinicalLoadingState';
import ClinicalErrorState from './components/ClinicalErrorState';
import ClinicalEmptyState from './components/ClinicalEmptyState';

const ClinicalReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const { data: clinicalData, isLoading, error, refetch } = useClinicalReportsData(timeRange);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return <ClinicalLoadingState />;
  }

  if (error) {
    return <ClinicalErrorState onRetry={() => refetch()} />;
  }

  if (!clinicalData) {
    return <ClinicalEmptyState />;
  }

  return (
    <div className="space-y-6">
      <ClinicalHeader
        timeRange={timeRange}
        reportType={reportType}
        onTimeRangeChange={setTimeRange}
        onReportTypeChange={setReportType}
        onRefresh={() => refetch()}
      />

      <ClinicalMetricsGrid data={clinicalData} />

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="productivity">Provider Productivity</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-6">
          <NotesTab data={clinicalData} colors={COLORS} />
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <ProductivityTab data={clinicalData} />
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-6">
          <DiagnosesTab data={clinicalData} />
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <OutcomesTab data={clinicalData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicalReports;
