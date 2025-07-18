
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const ProgressNoteLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

export const ProgressNoteNotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">Note not found</p>
      <Button onClick={() => navigate('/documentation')} className="mt-4">
        Back to Documentation
      </Button>
    </div>
  );
};
