
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';

interface QuickAction {
  id: string;
  title: string;
  description?: string;
  priority: number;
}

interface ActiveActionsCardProps {
  actions: QuickAction[];
}

const ActiveActionsCard: React.FC<ActiveActionsCardProps> = ({ actions }) => {
  if (actions.length === 0) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Active Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.slice(0, 3).map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <Badge variant={action.priority === 3 ? "destructive" : action.priority === 2 ? "default" : "secondary"}>
                {action.priority === 3 ? 'High' : action.priority === 2 ? 'Medium' : 'Low'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveActionsCard;
