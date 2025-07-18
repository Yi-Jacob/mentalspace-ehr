
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Users, FileText, Award } from 'lucide-react';

interface SupervisionTabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

const SupervisionTabs: React.FC<SupervisionTabsProps> = ({ defaultValue, children }) => {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
        <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sessions" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
          >
            <Calendar className="h-4 w-4" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger 
            value="relationships" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
          >
            <Users className="h-4 w-4" />
            <span>Relationships</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
          >
            <FileText className="h-4 w-4" />
            <span>Supervision Notes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="progress" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
          >
            <Award className="h-4 w-4" />
            <span>Progress Tracking</span>
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export default SupervisionTabs;
