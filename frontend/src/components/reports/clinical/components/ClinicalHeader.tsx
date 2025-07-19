
import React from 'react';
import { Button } from '@/components/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Download, RefreshCw } from 'lucide-react';

interface ClinicalHeaderProps {
  timeRange: string;
  reportType: string;
  onTimeRangeChange: (value: string) => void;
  onReportTypeChange: (value: string) => void;
  onRefresh: () => void;
}

const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({
  timeRange,
  reportType,
  onTimeRangeChange,
  onReportTypeChange,
  onRefresh
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Clinical Reports</h2>
      <div className="flex items-center space-x-4">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
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
        
        <Select value={reportType} onValueChange={onReportTypeChange}>
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

        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>

        <Button className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
};

export default ClinicalHeader;
