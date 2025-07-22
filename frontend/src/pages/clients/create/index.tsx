import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';

const CreateClientPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/clients');
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={UserPlus}
        title="Add New Client"
        description="Create a new client record"

        action={
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
        }
      />

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Client Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Add New Client</h3>
              <p className="text-gray-500">
                Client creation form will be implemented here.
              </p>
            </div>
          </CardContent>
        </Card>
    </PageLayout>
  );
};

export default CreateClientPage; 