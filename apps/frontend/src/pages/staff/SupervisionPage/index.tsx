import React, { useState } from 'react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { UserCog, Plus } from 'lucide-react';
import { Button } from '@/components/basic/button';
import StaffSupervisionView from './components/StaffSupervisionView';

const SupervisionPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <PageLayout>
      <PageHeader
        title="Staff Supervision"
        description="Manage supervision relationships between staff members"
        icon={UserCog}
        action={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Supervision
          </Button>
        }
      />
      <StaffSupervisionView 
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    </PageLayout>
  );
};

export default SupervisionPage; 