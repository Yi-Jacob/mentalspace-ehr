
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddStaffAction: React.FC = () => {
  const navigate = useNavigate();

  const handleAddStaff = () => {
    navigate('/staff/add');
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleAddStaff}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Add New Staff</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3">Create new user accounts and assign roles</p>
        <Button size="sm" className="w-full">
          <span>Access</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddStaffAction;
