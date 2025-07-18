
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserCheck, AlertTriangle } from 'lucide-react';
import { useStaffManagement } from '@/hooks/useStaffManagement';

const AdminRoleRestorer: React.FC = () => {
  const { assignAdminRole, isAssigningAdmin } = useStaffManagement();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Access Restricted
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You don't have the Practice Administrator role required to access the staff management module.
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Click the button below to restore your Practice Administrator privileges and continue managing staff.
            </p>
            
            <Button
              onClick={() => assignAdminRole()}
              disabled={isAssigningAdmin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              {isAssigningAdmin ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Restoring Access...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Restore Administrator Role
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            This will assign you the Practice Administrator role and refresh the page to apply permissions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoleRestorer;
