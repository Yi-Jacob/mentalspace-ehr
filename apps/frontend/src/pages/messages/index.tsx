import { MessageSquare } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import MessageComponent from '@/components/MessageComponent';

const MessageManagement = () => {
  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={MessageSquare}
        title="Messages"
        description="Secure communication with clients and team members"
      />

      <div className="mt-4 h-[calc(100vh-180px)] min-h-0">
        <MessageComponent />
      </div>
    </PageLayout>
  );
};

export default MessageManagement;
