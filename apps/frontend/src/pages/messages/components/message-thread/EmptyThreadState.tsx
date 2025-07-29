
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { MessageSquare } from 'lucide-react';

const EmptyThreadState: React.FC = () => {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm h-full">
      <CardContent className="p-6 flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
          <p className="text-sm">Choose a client conversation from the list to start messaging</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyThreadState;
