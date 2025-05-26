
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';

interface ManageRolesActionProps {
  onNavigate: () => void;
}

const ManageRolesAction: React.FC<ManageRolesActionProps> = ({ onNavigate }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onNavigate}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Manage Roles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3">Assign and modify user roles</p>
        <Button size="sm" className="w-full">
          <span>Access</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManageRolesAction;
