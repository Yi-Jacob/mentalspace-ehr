
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import WorkScheduleHeader from '../components/work-schedule/WorkScheduleHeader';
import ScheduleCard from '../components/work-schedule/ScheduleCard';
import ExceptionCard from '../components/work-schedule/ExceptionCard';
import ScheduleStatsOverview from '../components/work-schedule/ScheduleStatsOverview';
import AddScheduleModal from '../components/AddScheduleModal';
import AddExceptionModal from '../components/AddExceptionModal';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Calendar, Plus } from 'lucide-react';

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
      <PageLayout variant="gradient">
        <PageHeader
          icon={Calendar}
          title="Work Schedule Management"
          description="Manage provider work schedules, availability, and exceptions"
          action={
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Schedule</span>
              </button>
              <button
                onClick={() => setShowAddExceptionModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Exception</span>
              </button>
            </div>
          }
        />

        <div className="space-y-6">
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
      </PageLayout>

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
