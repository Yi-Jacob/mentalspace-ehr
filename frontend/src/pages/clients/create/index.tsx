import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateClientPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/clients');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Button>
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-3 rounded-xl">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Add New Client
              </h1>
              <p className="text-gray-600 mt-1">Create a new client record</p>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default CreateClientPage; 