
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ScheduleException } from '@/services/schedulingService';

interface ExceptionCardProps {
  exceptions: ScheduleException[];
  isLoading: boolean;
}

const ExceptionCard: React.FC<ExceptionCardProps> = ({
  exceptions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Calendar className="h-5 w-5" />
            <span>Schedule Exceptions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              <div className="text-gray-600 font-medium">Loading exceptions...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exceptions?.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Calendar className="h-5 w-5" />
            <span>Schedule Exceptions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No schedule exceptions</h3>
            <p className="text-sm">Add holidays, time off, or special hours</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Calendar className="h-5 w-5" />
          <span>Schedule Exceptions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {exceptions?.map((exception) => (
            <div 
              key={exception.id} 
              className="border-0 rounded-xl p-4 bg-gradient-to-r from-white to-pink-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 transform group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  {format(new Date(exception.exceptionDate), 'MMM d, yyyy')}
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`font-medium px-3 py-1 ${
                      !exception.isAvailable 
                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300'
                    }`}
                  >
                    {!exception.isAvailable ? 'Unavailable' : 'Modified Hours'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-pink-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                {!exception.is_unavailable && exception.start_time && exception.end_time && (
                  <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg">
                    <span className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Modified Hours:</span>
                    </span>
                    <span className="font-semibold text-blue-700">
                      {exception.start_time} - {exception.end_time}
                    </span>
                  </div>
                )}
                
                {exception.reason && (
                  <div className="flex items-center justify-between p-2 bg-purple-50/50 rounded-lg">
                    <span className="flex items-center space-x-2">
                      <span>Reason:</span>
                    </span>
                    <span className="font-semibold text-purple-700">{exception.reason}</span>
                  </div>
                )}
                
                {exception.approved_at && (
                  <div className="text-xs text-green-600 p-2 bg-green-50/50 rounded-lg font-medium">
                    ✓ Approved on {format(new Date(exception.approved_at), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExceptionCard;
