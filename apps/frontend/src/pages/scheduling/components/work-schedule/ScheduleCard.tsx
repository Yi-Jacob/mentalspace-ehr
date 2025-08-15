
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Clock, Calendar, Edit, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ProviderSchedule } from '@/services/schedulingService';



interface ScheduleCardProps {
  schedules: ProviderSchedule[];
  isLoading: boolean;
  dayMapping: Record<string, string>;
  getStatusColor: (status: string) => string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedules,
  isLoading,
  dayMapping,
  getStatusColor,
}) => {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Clock className="h-5 w-5" />
            <span>Weekly Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <div className="text-gray-600 font-medium">Loading schedules...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (schedules?.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Clock className="h-5 w-5" />
            <span>Weekly Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No weekly schedule set</h3>
            <p className="text-sm">Add your regular working hours to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Clock className="h-5 w-5" />
          <span>Weekly Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {schedules?.map((schedule) => (
            <div 
              key={schedule.id} 
              className="border-0 rounded-xl p-4 bg-gradient-to-r from-white to-purple-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  {dayMapping[schedule.dayOfWeek.toLowerCase() as keyof typeof dayMapping] || schedule.dayOfWeek}
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(schedule.status)} border font-medium px-3 py-1`}>
                    {schedule.status.replace('_', ' ')}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-purple-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Working Hours:</span>
                  </span>
                  <span className="font-semibold text-blue-700">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                
                {schedule.breakStartTime && schedule.breakEndTime && (
                  <div className="flex items-center justify-between p-2 bg-orange-50/50 rounded-lg">
                    <span className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>Break:</span>
                    </span>
                    <span className="font-semibold text-orange-700">
                      {schedule.breakStartTime} - {schedule.breakEndTime}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-2 bg-green-50/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <span>Available:</span>
                  </span>
                  <span className={`inline-flex items-center font-semibold ${schedule.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {schedule.isAvailable ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {schedule.isAvailable ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 p-2 bg-gray-50/50 rounded-lg">
                  <span>Effective:</span>
                  <span className="font-medium">
                    {format(new Date(schedule.effectiveFrom), 'MMM d, yyyy')}
                    {schedule.effectiveUntil && ` - ${format(new Date(schedule.effectiveUntil), 'MMM d, yyyy')}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
