
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderTabProps {
  title: string;
  message: string;
}

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title, message }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          {message}
        </div>
      </CardContent>
    </Card>
  );
};
