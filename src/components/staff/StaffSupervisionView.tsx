
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SupervisionHeader from './supervision/SupervisionHeader';
import SupervisionStatsCards from './supervision/SupervisionStatsCards';
import SupervisionTabs from './supervision/SupervisionTabs';
import SupervisionDashboard from './supervision/SupervisionDashboard';
import SupervisionSessions from './supervision/SupervisionSessions';
import SupervisionRelationships from './supervision/SupervisionRelationships';
import SupervisionReviews from './supervision/SupervisionReviews';
import SupervisionProgress from './supervision/SupervisionProgress';

const StaffSupervisionView: React.FC = () => {
  const handleNewSession = () => {
    console.log('New session clicked');
  };

  return (
    <div className="space-y-8">
      <SupervisionHeader onNewSession={handleNewSession} />
      <SupervisionStatsCards />
      
      <SupervisionTabs defaultValue="dashboard">
        <TabsContent value="dashboard" className="space-y-6">
          <SupervisionDashboard />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <SupervisionSessions />
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6">
          <SupervisionRelationships />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <SupervisionReviews />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <SupervisionProgress />
        </TabsContent>
      </SupervisionTabs>
    </div>
  );
};

export default StaffSupervisionView;
