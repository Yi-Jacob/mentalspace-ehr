
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ScheduleData {
  id: string;
  is_available: boolean;
  status: string;
}

interface ExceptionData {
  id: string;
  exception_date: string;
}

interface ScheduleStatsOverviewProps {
  schedules: ScheduleData[];
  exceptions: ExceptionData[];
}

const ScheduleStatsOverview: React.FC<ScheduleStatsOverviewProps> = ({
  schedules,
  exceptions,
}) => {
  const availableDays = schedules?.filter(s => s.is_available).length || 0;
  const activeSchedules = schedules?.filter(s => s.status === 'active').length || 0;
  const upcomingExceptions = exceptions?.filter(e => new Date(e.exception_date) >= new Date()).length || 0;
  const pendingApproval = schedules?.filter(s => s.status === 'pending_approval').length || 0;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <TrendingUp className="h-5 w-5" />
          <span>Schedule Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {availableDays}
            </div>
            <div className="text-sm text-blue-700 font-medium">Available Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {activeSchedules}
            </div>
            <div className="text-sm text-green-700 font-medium">Active Schedules</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {upcomingExceptions}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Upcoming Exceptions</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {pendingApproval}
            </div>
            <div className="text-sm text-orange-700 font-medium">Pending Approval</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleStatsOverview;
