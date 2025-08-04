import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { StaffMember } from '@/types/staffType';
import { formatDate } from '@/utils/dateUtils';
import { Phone, DollarSign, MapPin, Calendar, Building, Award, FileText } from 'lucide-react';

interface StaffInfoTabProps {
  staff: StaffMember;
}

export const StaffInfoTab: React.FC<StaffInfoTabProps> = ({ staff }) => {
  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFullName = () => {
    return [staff.firstName, staff.middleName, staff.lastName, staff.suffix].filter(Boolean).join(' ');
  };

  const hasPhoneNumbers = staff.mobilePhone || staff.workPhone || staff.homePhone || staff.staffProfile?.phoneNumber;
  const hasAddress = staff.address1 || staff.city || staff.state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Staff Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Personal & Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoSection title="Personal Information">
            <div className="grid grid-cols-1 gap-4">
              <InfoDisplay 
                label="Full Name" 
                value={getFullName()} 
              />
              <InfoDisplay label="Email" value={staff.email} />
              <InfoDisplay label="Username" value={staff.userName} />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 block">Can Receive Text</label>
                <Badge variant={staff.canReceiveText ? "default" : "secondary"} className="text-xs">
                  {staff.canReceiveText ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </InfoSection>

          <InfoSection title="Contact Information">
            <div className="space-y-4">
              {/* Phone Numbers */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Phone Numbers</label>
                <div className="space-y-2">
                  {staff.mobilePhone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Mobile:</span>
                      <span className="text-gray-700">{staff.mobilePhone}</span>
                    </div>
                  )}
                  {staff.workPhone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Work:</span>
                      <span className="text-gray-700">{staff.workPhone}</span>
                    </div>
                  )}
                  {staff.homePhone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Home:</span>
                      <span className="text-gray-700">{staff.homePhone}</span>
                    </div>
                  )}
                  {staff.staffProfile?.phoneNumber && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Profile:</span>
                      <span className="text-gray-700">{staff.staffProfile.phoneNumber}</span>
                    </div>
                  )}
                  {!hasPhoneNumbers && (
                    <div className="text-sm text-gray-400 italic">No phone numbers provided</div>
                  )}
                </div>
              </div>
              
              {/* Address */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Address</label>
                <div className="text-sm">
                  {hasAddress ? (
                    <div className="space-y-1">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900">{staff.address1 || 'No street address'}</div>
                          {staff.address2 && <div className="text-gray-700">{staff.address2}</div>}
                          <div className="text-gray-700">
                            {[staff.city || 'No city', staff.state || 'No state', staff.zipCode || 'No zip'].join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">Not provided</div>
                  )}
                </div>
              </div>
            </div>
          </InfoSection>
        </div>

        {/* Professional & Licensing Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoSection title="Professional Information">
            <div className="grid grid-cols-1 gap-4">
              <InfoDisplay label="Employee ID" value={staff.staffProfile?.employeeId} />
              <InfoDisplay label="Job Title" value={staff.staffProfile?.jobTitle} />
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-400" />
                <InfoDisplay label="Department" value={staff.staffProfile?.department} />
              </div>
              <InfoDisplay label="Formal Name" value={staff.formalName} />
              <InfoDisplay label="Clinician Type" value={staff.clinicianType} />
              <InfoDisplay label="NPI Number" value={staff.staffProfile?.npiNumber} />
            </div>
          </InfoSection>

          <InfoSection title="Licensing Information">
            <div className="grid grid-cols-1 gap-4">
              <InfoDisplay label="License Number" value={staff.staffProfile?.licenseNumber} />
              <InfoDisplay label="License State" value={staff.staffProfile?.licenseState} />
              <InfoDisplay 
                label="License Expiry" 
                value={staff.staffProfile?.licenseExpiryDate ? formatDateOfBirth(staff.staffProfile.licenseExpiryDate) : null} 
              />
            </div>
          </InfoSection>
        </div>

        {/* Employment & Billing Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoSection title="Employment Details">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <InfoDisplay 
                  label="Hire Date" 
                  value={staff.staffProfile?.hireDate ? formatDateOfBirth(staff.staffProfile.hireDate) : null} 
                />
              </div>
              <InfoDisplay 
                label="Termination Date" 
                value={staff.staffProfile?.terminationDate ? formatDateOfBirth(staff.staffProfile.terminationDate) : null} 
              />
              <InfoDisplay 
                label="Member Since" 
                value={formatDateOfBirth(staff.createdAt)} 
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 block">Status</label>
                <Badge variant={staff.isActive ? "default" : "secondary"} className="text-xs">
                  {staff.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </InfoSection>

          <InfoSection title="Billing Information">
            <div className="grid grid-cols-1 gap-4">
              {staff.staffProfile?.billingRate && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 block">Billing Rate</label>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-900">${staff.staffProfile.billingRate}/hour</span>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 block">Can Bill Insurance</label>
                <Badge variant={staff.staffProfile?.canBillInsurance ? "default" : "secondary"} className="text-xs">
                  {staff.staffProfile?.canBillInsurance ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </InfoSection>
        </div>

        {/* Roles & Permissions */}
        <InfoSection title="Roles & Permissions">
          {staff.roles && staff.roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {staff.roles.map((role, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {role}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 italic text-sm">No roles assigned</div>
          )}
        </InfoSection>

        {/* Emergency Contact */}
        <InfoSection title="Emergency Contact">
          {staff.staffProfile?.emergencyContactName || staff.staffProfile?.emergencyContactPhone ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoDisplay label="Contact Name" value={staff.staffProfile?.emergencyContactName} />
                <InfoDisplay label="Contact Phone" value={staff.staffProfile?.emergencyContactPhone} />
              </div>
            </div>
          ) : (
            <div className="text-gray-400 italic text-sm">No emergency contact on file</div>
          )}
        </InfoSection>

        {/* Notes & Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoSection title="Notes">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {staff.staffProfile?.notes || 'No notes on file'}
              </div>
            </div>
          </InfoSection>

          <InfoSection title="User Comments">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {staff.userComments || 'No comments on file'}
              </div>
            </div>
          </InfoSection>
        </div>
      </CardContent>
    </Card>
  );
}; 