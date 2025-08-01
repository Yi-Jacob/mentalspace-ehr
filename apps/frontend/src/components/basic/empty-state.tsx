import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      {icon && (
        <CardContent className="flex justify-center py-8">
          {icon}
        </CardContent>
      )}
    </Card>
  );
};

export const SimpleEmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {message}
    </div>
  );
}; 