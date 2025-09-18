import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { SelectField } from '@/components/basic/select';
import { Stethoscope, Plus, X, User } from 'lucide-react';
import { ClientFormData } from '@/types/clientType';
import { staffService } from '@/services/staffService';
import { clinicianAssignmentService } from '@/services/clinicianAssignmentService';

interface ClinicianAssignmentTabProps {
  formData: ClientFormData;
  onDataChange?: () => void;
}


interface StaffOption {
  value: string;
  label: string;
  jobTitle?: string;
  department?: string;
}

export const ClinicianAssignmentTab: React.FC<ClinicianAssignmentTabProps> = ({
  formData,
  onDataChange,
}) => {
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [selectedClinicianId, setSelectedClinicianId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  // Load staff options
  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoadingStaff(true);
        const staffProfiles = await staffService.getAvailableStaffProfiles();
        const options = staffProfiles.map(staff => ({
          value: staff.id,
          label: `${staff.firstName} ${staff.lastName}`,
          jobTitle: staff.jobTitle,
          department: staff.department,
        }));
        
        setStaffOptions(options);
      } catch (error) {
        console.error('Error loading staff:', error);
      } finally {
        setIsLoadingStaff(false);
      }
    };

    loadStaff();
  }, []);

  const handleAddClinician = async () => {
    if (!selectedClinicianId) {
      return;
    }

    // Check if clinician is already assigned
    const isAlreadyAssigned = formData.clinicians?.some(assignment => 
      assignment.clinician.user.id === selectedClinicianId
    );
    
    if (isAlreadyAssigned) {
      return;
    }

    setIsAdding(true);
    try {
      if (formData.id) {
        await clinicianAssignmentService.assignClinician(formData.id, selectedClinicianId);
        onDataChange?.(); // Refresh client data
      }
      
      setSelectedClinicianId('');
    } catch (error) {
      console.error('Error adding clinician:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveClinician = async (clinicianId: string) => {
    try {
      if (formData.id) {
        await clinicianAssignmentService.removeClinician(formData.id, clinicianId);
        onDataChange?.(); // Refresh client data
      }
    } catch (error) {
      console.error('Error removing clinician:', error);
    }
  };

  const availableStaffOptions = staffOptions.filter(
    staff => !formData.clinicians?.some(assignment => assignment.clinician.id === staff.value)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Assigned Clinicians</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Assignments */}
          <div className="space-y-4">
            {(formData.clinicians && formData.clinicians.length > 0) ? (
              <div className="space-y-3">
                {/* Show assigned clinicians with full data */}
                {formData.clinicians && formData.clinicians.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {assignment.clinician.formalName || `${assignment.clinician.user.firstName} ${assignment.clinician.user.lastName}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.clinician.jobTitle && (
                            <span>{assignment.clinician.jobTitle}</span>
                          )}
                          {assignment.clinician.department && (
                            <span className="ml-2">• {assignment.clinician.department}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {assignment.clinician.clinicianType && (
                            <span>{assignment.clinician.clinicianType}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveClinician(assignment.clinician.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">No Clinicians Assigned</div>
                <div className="text-sm text-gray-400">
                  Add clinicians using the form below to assign them to this client.
                </div>
              </div>
            )}
          </div>

          {/* Add New Clinician */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Clinician</h3>
            <div className="flex space-x-3">
              <div className="flex-1">
                <SelectField
                  label="Select Clinician"
                  value={selectedClinicianId}
                  onValueChange={setSelectedClinicianId}
                  placeholder="Choose a clinician to assign..."
                  options={availableStaffOptions}
                  disabled={isLoadingStaff || availableStaffOptions.length === 0}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddClinician}
                  disabled={!selectedClinicianId || isAdding || isLoadingStaff}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </div>
            </div>
            {availableStaffOptions.length === 0 && !isLoadingStaff && (
              <p className="text-sm text-gray-500 mt-2">
                All available clinicians are already assigned to this client.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
