
import React, { useState } from 'react';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import PageTabs from '@/components/ui/PageTabs';
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

      <PageTabs
        value={activeTab}
        onValueChange={setActiveTab}

        items={[
          {
            id: 'calendar',
            label: 'Calendar',
            icon: Calendar,
            content: <CalendarView />
          },
          {
            id: 'appointments',
            label: 'Appointments',
            icon: Clock,
            content: <AppointmentManagement />
          },
          {
            id: 'schedules',
            label: 'Work Schedules',
            icon: Users,
            content: <WorkScheduleManagement />
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            content: <SchedulingSettings />
          }
        ]}
      />
    </PageLayout>
  );
};

export default Scheduling;
