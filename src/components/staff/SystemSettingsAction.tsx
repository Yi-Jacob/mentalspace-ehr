
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ArrowRight } from 'lucide-react';

interface SystemSettingsActionProps {
  onNavigate: () => void;
}

const SystemSettingsAction: React.FC<SystemSettingsActionProps> = ({ onNavigate }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onNavigate}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>System Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3">Configure practice-wide settings</p>
        <Button size="sm" className="w-full">
          <span>Access</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettingsAction;
