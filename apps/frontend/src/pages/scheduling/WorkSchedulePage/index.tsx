
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { schedulingService, ScheduleException, ProviderSchedule } from '@/services/schedulingService';
import ScheduleCard from '../components/work-schedule/ScheduleCard';
import ExceptionCard from '../components/work-schedule/ExceptionCard';
import AddScheduleModal from '../components/AddScheduleModal';
import AddExceptionModal from '../components/AddExceptionModal';
import DeleteExceptionModal from '../components/DeleteExceptionModal';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkScheduleManagement = () => {
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false);
  const [editingException, setEditingException] = useState<ScheduleException | null>(null);
  const [showDeleteExceptionModal, setShowDeleteExceptionModal] = useState(false);
  const [deletingException, setDeletingException] = useState<ScheduleException | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ProviderSchedule | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleEditException = (exception: ScheduleException) => {
    setEditingException(exception);
    setShowAddExceptionModal(true);
  };

  const handleCloseExceptionModal = () => {
    setShowAddExceptionModal(false);
    setEditingException(null);
  };

  const handleDeleteException = (exception: ScheduleException) => {
    setDeletingException(exception);
    setShowDeleteExceptionModal(true);
  };

  const handleConfirmDeleteException = async () => {
    if (!deletingException) return;
    
    try {
      setIsDeleting(true);
      await schedulingService.deleteScheduleException(deletingException.id);
      
      toast({
        title: "Exception Deleted",
        description: "The schedule exception has been deleted successfully.",
      });
      
      setShowDeleteExceptionModal(false);
      setDeletingException(null);
      
      // Invalidate the query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['schedule-exceptions'] });
    } catch (error) {
      console.error('Failed to delete exception:', error);
      toast({
        title: "Error",
        description: "Failed to delete exception. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteExceptionModal(false);
    setDeletingException(null);
  };

  const handleEditSchedule = (schedule: ProviderSchedule) => {
    setEditingSchedule(schedule);
    setShowAddScheduleModal(true);
  };

  const handleCloseScheduleModal = () => {
    setShowAddScheduleModal(false);
    setEditingSchedule(null);
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
              onEditSchedule={handleEditSchedule}
            />

            <ExceptionCard
              exceptions={exceptions || []}
              isLoading={exceptionsLoading}
              onEditException={handleEditException}
              onDeleteException={handleDeleteException}
            />
          </div>
        </div>
      </PageLayout>

      <AddScheduleModal 
        open={showAddScheduleModal} 
        onOpenChange={handleCloseScheduleModal}
        editingSchedule={editingSchedule}
        isEditMode={!!editingSchedule}
      />
      <AddExceptionModal 
        open={showAddExceptionModal} 
        onOpenChange={handleCloseExceptionModal} 
        editingException={editingException}
      />
      <DeleteExceptionModal
        open={showDeleteExceptionModal}
        onOpenChange={handleCloseDeleteModal}
        exception={deletingException}
        onConfirmDelete={handleConfirmDeleteException}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default WorkScheduleManagement;
