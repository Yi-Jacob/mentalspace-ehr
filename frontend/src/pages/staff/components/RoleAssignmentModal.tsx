
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { Label } from '@/components/shared/ui/label';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Badge } from '@/components/shared/ui/badge';
import { UserPlus, AlertTriangle, Info } from 'lucide-react';
import { UserRole } from '@/types/staff';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentRoles: UserRole[];
}

const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  currentRoles
}) => {
  const { assignRole, isAssigningRole } = useEnhancedStaffRoles();
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);

  const allRoles: UserRole[] = [
    'Practice Administrator',
    'Clinical Administrator',
    'Clinician',
    'Supervisor',
    'Intern',
    'Assistant',
    'Associate',
    'Practice Scheduler',
    'Practice Biller',
    'Biller for Assigned Patients Only'
  ];

  const roleDescriptions: Record<UserRole, string> = {
    'Practice Administrator': 'Full system access, can manage users and practice settings',
    'Clinical Administrator': 'Access to all patient records, requires Clinician role',
    'Clinician': 'Provide services to assigned patients, create clinical notes',
    'Supervisor': 'Supervise other clinicians, access supervisee patient records',
    'Intern': 'Similar to Clinician but with limitations, cannot bill independently',
    'Assistant': 'Limited clinical access, cannot bill insurance independently',
    'Associate': 'Limited clinical access, cannot bill insurance independently',
    'Practice Scheduler': 'Manage schedules for all clinicians, add/edit patients',
    'Practice Biller': 'Full billing access to all patients in the practice',
    'Biller for Assigned Patients Only': 'Billing access limited to assigned patients'
  };

  const getAvailableRoles = () => {
    return allRoles.filter(role => !currentRoles.includes(role));
  };

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
    setShowValidationError(false);
  };

  const validateRoleSelection = (roles: UserRole[]): string | null => {
    // Clinical Administrator requires Clinician role
    if (roles.includes('Clinical Administrator') && 
        !roles.includes('Clinician') && 
        !currentRoles.includes('Clinician')) {
      return 'Clinical Administrator role requires Clinician role to be assigned first.';
    }
    return null;
  };

  const handleAssignRoles = async () => {
    const validationError = validateRoleSelection(selectedRoles);
    if (validationError) {
      setShowValidationError(true);
      return;
    }

    if (selectedRoles.length === 0) {
      setShowValidationError(true);
      return;
    }

    try {
      // Assign roles one by one
      for (const role of selectedRoles) {
        assignRole({ userId, role });
      }
      
      // Reset form and close modal
      setSelectedRoles([]);
      setShowValidationError(false);
      onClose();
    } catch (error) {
      console.error('Error assigning roles:', error);
    }
  };

  const handleClose = () => {
    setSelectedRoles([]);
    setShowValidationError(false);
    onClose();
  };

  const availableRoles = getAvailableRoles();
  const validationError = validateRoleSelection(selectedRoles);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Assign Roles to {userName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Roles */}
          {currentRoles.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Current Roles:</Label>
              <div className="flex flex-wrap gap-2">
                {currentRoles.map(role => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Roles */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Roles to Assign:
            </Label>
            
            {availableRoles.length > 0 ? (
              <div className="space-y-3">
                {availableRoles.map(role => (
                  <div key={role} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={() => handleRoleToggle(role)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={role} className="font-medium cursor-pointer">
                        {role}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {roleDescriptions[role]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This user already has all available roles assigned.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Validation Errors */}
          {(showValidationError || validationError) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {validationError || 'Please select at least one role to assign.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Role Assignment Rules */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Role Assignment Rules:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Clinical Administrator role requires Clinician role</li>
                <li>• Interns, Assistants, and Associates cannot bill insurance independently</li>
                <li>• Practice Administrators have full system access</li>
                <li>• Supervisors can access their supervisees' patient records</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignRoles}
            disabled={isAssigningRole || selectedRoles.length === 0 || availableRoles.length === 0}
          >
            {isAssigningRole ? 'Assigning...' : `Assign ${selectedRoles.length} Role${selectedRoles.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleAssignmentModal;
