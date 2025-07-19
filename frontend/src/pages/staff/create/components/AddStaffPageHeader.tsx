
import React from 'react';
import { Button } from '@/components/shared/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AddStaffPageHeaderProps {
  onCancel: () => void;
}

const AddStaffPageHeader: React.FC<AddStaffPageHeaderProps> = ({ onCancel }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="p-3 hover:bg-white/80 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
            Add New Team Member
          </h1>
          <p className="text-gray-600 mt-1">Create a new user account and configure their access</p>
        </div>
      </div>
    </div>
  );
};

export default AddStaffPageHeader;
