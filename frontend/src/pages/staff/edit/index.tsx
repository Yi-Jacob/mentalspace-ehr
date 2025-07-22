import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';

const EditStaffPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/staff');
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Edit}
        title="Edit Staff Member"
        description="Update staff member information"

        action={
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Staff
          </Button>
        }
      />

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Staff Member Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Edit Staff Member</h3>
              <p className="text-gray-500 mb-6">
                Staff member ID: {id}
              </p>
              <p className="text-gray-500">
                Edit form will be implemented here.
              </p>
            </div>
          </CardContent>
        </Card>
    </PageLayout>
  );
};

export default EditStaffPage; 