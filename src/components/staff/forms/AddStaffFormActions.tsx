
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface AddStaffFormActionsProps {
  isCreatingStaff: boolean;
  onCancel: () => void;
}

const AddStaffFormActions: React.FC<AddStaffFormActionsProps> = ({
  isCreatingStaff,
  onCancel
}) => {
  return (
    <div className="flex justify-start space-x-4 pt-6">
      <Button 
        type="submit" 
        disabled={isCreatingStaff}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
        size="lg"
      >
        {isCreatingStaff ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Creating...
          </>
        ) : (
          <>
            <Save className="h-5 w-5 mr-2" />
            Save New User
          </>
        )}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 transition-all duration-300 px-8 py-3"
        size="lg"
      >
        <X className="h-5 w-5 mr-2" />
        Cancel
      </Button>
    </div>
  );
};

export default AddStaffFormActions;
