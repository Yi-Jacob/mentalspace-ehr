
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import WorkScheduleHeader from './work-schedule/WorkScheduleHeader';
import ScheduleCard from './work-schedule/ScheduleCard';
import ExceptionCard from './work-schedule/ExceptionCard';
import ScheduleStatsOverview from './work-schedule/ScheduleStatsOverview';
import AddScheduleModal from './AddScheduleModal';
import AddExceptionModal from './AddExceptionModal';

const WorkScheduleManagement = () => {
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false);

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['provider-schedules'],
    queryFn: async () => {
      return await schedulingService.getProviderSchedules();
    },
  });

  const { data: exceptions, isLoading: exceptionsLoading } = useQuery({
    queryKey: ['schedule-exceptions'],
    queryFn: async () => {
      return await schedulingService.getScheduleExceptions();
    },
  });

  const dayMapping = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'pending_approval':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'rejected':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <div className="space-y-6 bg-gradient-to-br from-white to-purple-50/30 min-h-screen p-6">
        <WorkScheduleHeader
          onAddSchedule={() => setShowAddScheduleModal(true)}
          onAddException={() => setShowAddExceptionModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ScheduleCard
          schedules={schedules || []}
          isLoading={schedulesLoading}
          dayMapping={dayMapping}
          getStatusColor={getStatusColor}
        />

        <ExceptionCard
          exceptions={exceptions || []}
          isLoading={exceptionsLoading}
        />
        </div>

        <ScheduleStatsOverview
          schedules={schedules || []}
          exceptions={exceptions || []}
        />
      </div>

      <AddScheduleModal 
        open={showAddScheduleModal} 
        onOpenChange={setShowAddScheduleModal} 
      />
      <AddExceptionModal 
        open={showAddExceptionModal} 
        onOpenChange={setShowAddExceptionModal} 
      />
    </>
  );
};

export default WorkScheduleManagement;
