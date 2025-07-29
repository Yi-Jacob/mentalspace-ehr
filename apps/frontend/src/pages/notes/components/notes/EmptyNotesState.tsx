
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { FileText } from 'lucide-react';

const EmptyNotesState: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
        <p className="text-gray-600">No clinical notes match your current filters.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyNotesState;
