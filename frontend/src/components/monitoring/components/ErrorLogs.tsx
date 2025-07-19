
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { getStatusBadgeVariant, getStatusIcon } from '../utils/statusUtils';

interface ErrorLogsProps {
  errorLogs: any[];
}

const ErrorLogs = ({ errorLogs }: ErrorLogsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Errors</CardTitle>
        <CardDescription>
          Latest application errors and their severity levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorLogs.length > 0 ? (
          <div className="space-y-2">
            {errorLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(log.severity)}
                  <div>
                    <p className="font-medium">{log.error.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.context.component} - {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(log.severity)}>
                  {log.severity}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent errors found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorLogs;
