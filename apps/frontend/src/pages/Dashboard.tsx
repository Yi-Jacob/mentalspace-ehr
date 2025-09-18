
import { 
  LayoutDashboard,
} from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const Dashboard = () => {
  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description={`${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`}
      />
    </PageLayout>
  );
};

export default Dashboard;
