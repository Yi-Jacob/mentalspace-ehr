
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import CalendarView from '@/pages/scheduling/components/CalendarView';
import WorkScheduleManagement from '@/pages/scheduling/components/WorkScheduleManagement';
import AppointmentManagement from '@/pages/scheduling/components/AppointmentManagement';
import SchedulingSettings from '@/pages/scheduling/components/SchedulingSettings';

const Scheduling = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Calendar}
        title="Scheduling"
        description="Manage appointments, work schedules, and calendar integration"

      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Work Schedules</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <CalendarView />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentManagement />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <WorkScheduleManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SchedulingSettings />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Scheduling;
