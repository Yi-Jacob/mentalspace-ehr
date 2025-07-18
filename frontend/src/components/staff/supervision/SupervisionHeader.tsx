
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCog, Plus } from 'lucide-react';

interface SupervisionHeaderProps {
  onNewSession: () => void;
}

const SupervisionHeader: React.FC<SupervisionHeaderProps> = ({ onNewSession }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="p-4 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl shadow-lg shadow-orange-200/50 transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <UserCog className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 bg-clip-text text-transparent">
            Supervision Management
          </h2>
          <p className="text-gray-600 mt-1">Manage supervision relationships and track progress</p>
        </div>
      </div>
      <Button 
        onClick={onNewSession}
        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="h-5 w-5 mr-2" />
        New Session
      </Button>
    </div>
  );
};

export default SupervisionHeader;
