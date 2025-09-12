
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ScheduleException } from '@/services/schedulingService';

interface ExceptionCardProps {
  exceptions: ScheduleException[];
  isLoading: boolean;
  onEditException?: (exception: ScheduleException) => void;
  onDeleteException?: (exception: ScheduleException) => void;
}

const ExceptionCard: React.FC<ExceptionCardProps> = ({
  exceptions,
  isLoading,
  onEditException,
  onDeleteException,
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

  // Define table columns for exceptions
  const columns: TableColumn<ScheduleException>[] = [
    {
      key: 'date',
      header: 'Date',
      accessor: (exception) => (
        <div className="font-semibold text-gray-800">
          {format(new Date(exception.exceptionDate), 'MMM d, yyyy')}
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (exception) => format(new Date(exception.exceptionDate), 'MMM d, yyyy')
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (exception) => (
        <Badge 
          className={`font-medium px-3 py-1 ${
            exception.isUnavailable 
              ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300' 
              : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300'
          }`}
        >
          {exception.isUnavailable ? 'Unavailable' : 'Modified Hours'}
        </Badge>
      ),
      sortable: true,
      searchable: true,
      searchValue: (exception) => exception.isUnavailable ? 'Unavailable' : 'Modified Hours'
    },
    {
      key: 'hours',
      header: 'Hours',
      accessor: (exception) => (
        !exception.isUnavailable && exception.startTime && exception.endTime ? (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-700">
              {exception.startTime} - {exception.endTime}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        )
      ),
      sortable: false,
      searchable: true,
      searchValue: (exception) => !exception.isUnavailable && exception.startTime && exception.endTime ? `${exception.startTime} - ${exception.endTime}` : 'N/A'
    },
    {
      key: 'reason',
      header: 'Reason',
      accessor: (exception) => (
        exception.reason ? (
          <span className="font-semibold text-purple-700">{exception.reason}</span>
        ) : (
          <span className="text-gray-400">No reason provided</span>
        )
      ),
      sortable: true,
      searchable: true,
      searchValue: (exception) => exception.reason || 'No reason provided'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (exception) => (
        exception.approvedAt ? (
          <div className="text-xs text-green-600 bg-green-50/50 rounded-lg font-medium px-2 py-1">
            ✓ Approved on {format(new Date(exception.approvedAt), 'MMM d, yyyy')}
          </div>
        ) : (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            Pending
          </Badge>
        )
      ),
      sortable: true,
      searchable: true,
      searchValue: (exception) => exception.approvedAt ? 'Approved' : 'Pending'
    }
  ];

  // Define actions for the table
  const actions = [];
  if (onEditException) {
    actions.push({
      label: 'Edit Exception',
      icon: <Edit className="h-4 w-4" />,
      onClick: (exception) => onEditException(exception),
      variant: 'ghost' as const
    });
  }
  if (onDeleteException) {
    actions.push({
      label: 'Delete Exception',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (exception) => onDeleteException(exception),
      variant: 'ghost' as const
    });
  }

  return (
        <Table
          data={exceptions || []}
          columns={columns}
          sortable={true}
          pagination={false}
          searchable={true}
          selectable={false}
          actions={actions}
          emptyMessage={
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No schedule exceptions</h3>
              <p className="text-sm">Add holidays, time off, or special hours</p>
            </div>
          }
          loading={isLoading}
        />
  );
};

export default ExceptionCard;
