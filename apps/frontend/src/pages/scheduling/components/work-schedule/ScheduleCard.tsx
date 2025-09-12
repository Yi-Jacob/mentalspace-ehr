
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { LoadingState } from '@/components/basic/loading-state';
import EmptyState from '@/components/EmptyState';
import { Clock, Calendar, Edit, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ProviderSchedule } from '@/services/schedulingService';

interface ScheduleCardProps {
  schedules: ProviderSchedule[];
  isLoading: boolean;
  dayMapping: Record<string, string>;
  getStatusColor: (status: string) => string;
  onEditSchedule?: (schedule: ProviderSchedule) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedules,
  isLoading,
  dayMapping,
  getStatusColor,
  onEditSchedule,
}) => {
  // Sort schedules by dayOfWeek (Monday = 1, Sunday = 0)
  const sortedSchedules = React.useMemo(() => {
    const dayOrder = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0 };
    return [...schedules].sort((a, b) => {
      const dayA = dayOrder[a.dayOfWeek.toLowerCase() as keyof typeof dayOrder] ?? 0;
      const dayB = dayOrder[b.dayOfWeek.toLowerCase() as keyof typeof dayOrder] ?? 0;
      return dayA - dayB;
    });
  }, [schedules]);

  if (isLoading) {
    return <LoadingState count={3} />;
  }

  if (sortedSchedules?.length === 0) {
    return (
      <EmptyState
        title="No weekly schedule set"
        description="Add your regular working hours to get started"
        icon={Clock}
      />
    );
  }

  // Define table columns for schedules
  const columns: TableColumn<ProviderSchedule>[] = [
    {
      key: 'day',
      header: 'Day',
      accessor: (schedule) => (
        <div className="font-semibold text-gray-800">
          {dayMapping[schedule.dayOfWeek.toLowerCase() as keyof typeof dayMapping] || schedule.dayOfWeek}
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (schedule) => dayMapping[schedule.dayOfWeek.toLowerCase() as keyof typeof dayMapping] || schedule.dayOfWeek
    },
    {
      key: 'workingHours',
      header: 'Working Hours',
      accessor: (schedule) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-blue-700">
            {schedule.startTime} - {schedule.endTime}
          </span>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (schedule) => `${schedule.startTime} - ${schedule.endTime}`
    },
    {
      key: 'break',
      header: 'Break Time',
      accessor: (schedule) => (
        schedule.breakStartTime && schedule.breakEndTime ? (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-orange-700">
              {schedule.breakStartTime} - {schedule.breakEndTime}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">No break</span>
        )
      ),
      sortable: false,
      searchable: true,
      searchValue: (schedule) => schedule.breakStartTime && schedule.breakEndTime ? `${schedule.breakStartTime} - ${schedule.breakEndTime}` : 'No break'
    },
    {
      key: 'available',
      header: 'Available',
      accessor: (schedule) => (
        <div className={`inline-flex items-center font-semibold ${schedule.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
          {schedule.isAvailable ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <XCircle className="h-4 w-4 mr-1" />
          )}
          {schedule.isAvailable ? 'Yes' : 'No'}
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (schedule) => schedule.isAvailable ? 'Yes' : 'No'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (schedule) => (
        <Badge className={`${getStatusColor(schedule.status)} border font-medium px-3 py-1`}>
          {schedule.status.replace('_', ' ')}
        </Badge>
      ),
      sortable: true,
      searchable: true,
      searchValue: (schedule) => schedule.status.replace('_', ' ')
    },
    {
      key: 'effective',
      header: 'Effective Period',
      accessor: (schedule) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {format(new Date(schedule.effectiveFrom), 'MMM d, yyyy')}
          </div>
          {schedule.effectiveUntil && (
            <div className="text-gray-500">
              to {format(new Date(schedule.effectiveUntil), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (schedule) => `${format(new Date(schedule.effectiveFrom), 'MMM d, yyyy')} ${schedule.effectiveUntil ? `to ${format(new Date(schedule.effectiveUntil), 'MMM d, yyyy')}` : ''}`
    }
  ];

  return (
        <Table
          data={sortedSchedules}
          columns={columns}
          sortable={true}
          pagination={false}
          searchable={true}
          selectable={false}
          actions={onEditSchedule ? [{
            label: 'Edit Schedule',
            icon: <Edit className="h-4 w-4" />,
            onClick: (schedule) => onEditSchedule(schedule),
            variant: 'ghost'
          }] : []}
          emptyMessage={
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No weekly schedule set</h3>
              <p className="text-sm">Add your regular working hours to get started</p>
            </div>
          }
          loading={isLoading}
        />
  );
};

export default ScheduleCard;
