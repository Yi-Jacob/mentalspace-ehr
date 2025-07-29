
import React from 'react';
import { Button } from '@/components/basic/button';
import { useNavigate } from 'react-router-dom';

export const TreatmentPlanLoadingState = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  );
};

export const TreatmentPlanNotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">Treatment plan not found</p>
      <Button onClick={() => navigate('/notes')} className="mt-4">
        Back to Notes
      </Button>
    </div>
  );
};
