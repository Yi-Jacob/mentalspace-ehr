
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { MessageSquare } from 'lucide-react';

const EmptyThreadState: React.FC = () => {
  return (
    <Card className="border-0 shadow-lg bg-white h-full">
      <CardContent className="p-4 flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-semibold mb-1">Select a conversation</h3>
          <p className="text-xs">Choose a conversation from the list to start messaging</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyThreadState;
