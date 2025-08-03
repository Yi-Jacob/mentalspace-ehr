import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Edit, Phone, Building, Award, Clock, DollarSign, Shield, FileText, Users } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types/staffType';
import { staffService } from '@/services/staffService';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import CategorySection from '@/components/basic/CategorySection';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const StaffDetailPage = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStaffDetails = async () => {
    if (!staffId) return;
    
    try {
      const staffData = await staffService.getStaff(staffId);
      setStaff(staffData);
    } catch (err) {
      console.error('Error fetching staff details:', err);
      toast({
        title: "Error",
        description: "Failed to load staff details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetails();
  }, [staffId]);

  const handleEditStaff = () => {
    navigate(`/staff/${staffId}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  if (loading) {
    return <LoadingSpinner message="Loading staff details..." />;
  }

  if (!staff) {
    return (
      <EmptyState 
        title="Staff member not found"
        description="The staff member you're looking for doesn't exist or has been removed."
        icon={User}
      />
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={User}
        title={`${staff.firstName} ${staff.lastName}`}
        description={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {staff.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{staff.email}</span>
              </div>
            )}
            
            {staff.staffProfile?.hireDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Hired: {formatDate(staff.staffProfile.hireDate)}</span>
              </div>
            )}
            
            {staff.staffProfile?.department && (
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>{staff.staffProfile.department}</span>
              </div>
            )}
          </div>
        }
        badge={
          <Badge variant={getStatusBadgeVariant(staff.isActive)}>
            {staff.isActive ? 'Active' : 'Inactive'}
          </Badge>
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleEditStaff}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Staff</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <CategorySection
            title="Personal Information"
            description="Basic personal and contact details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{staff.firstName} {staff.lastName}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{staff.email}</p>
              </div>
              
              {staff.staffProfile?.phoneNumber && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{staff.staffProfile.phoneNumber}</span>
                  </p>
                </div>
              )}
              
              {staff.staffProfile?.employeeId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="text-gray-900">{staff.staffProfile.employeeId}</p>
                </div>
              )}
            </div>
          </CategorySection>

          {/* Professional Information */}
          <CategorySection
            title="Professional Information"
            description="Job details and credentials"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.staffProfile?.jobTitle && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Job Title</label>
                  <p className="text-gray-900">{staff.staffProfile.jobTitle}</p>
                </div>
              )}
              
              {staff.staffProfile?.department && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900">{staff.staffProfile.department}</p>
                </div>
              )}
              
              {staff.staffProfile?.npiNumber && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">NPI Number</label>
                  <p className="text-gray-900">{staff.staffProfile.npiNumber}</p>
                </div>
              )}
              
              {staff.staffProfile?.licenseNumber && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">License Number</label>
                  <p className="text-gray-900">{staff.staffProfile.licenseNumber}</p>
                </div>
              )}
              
              {staff.staffProfile?.licenseState && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">License State</label>
                  <p className="text-gray-900">{staff.staffProfile.licenseState}</p>
                </div>
              )}
              
              {staff.staffProfile?.licenseExpiryDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">License Expiry</label>
                  <p className="text-gray-900">{formatDate(staff.staffProfile.licenseExpiryDate)}</p>
                </div>
              )}
            </div>
          </CategorySection>

          {/* Employment Details */}
          <CategorySection
            title="Employment Details"
            description="Hire date, billing information, and status"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.staffProfile?.hireDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Hire Date</label>
                  <p className="text-gray-900">{formatDate(staff.staffProfile.hireDate)}</p>
                </div>
              )}
              
              {staff.staffProfile?.terminationDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Termination Date</label>
                  <p className="text-gray-900">{formatDate(staff.staffProfile.terminationDate)}</p>
                </div>
              )}
              
              {staff.staffProfile?.billingRate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Billing Rate</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>${staff.staffProfile.billingRate}/hour</span>
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Can Bill Insurance</label>
                <Badge variant={staff.staffProfile?.canBillInsurance ? "default" : "secondary"}>
                  {staff.staffProfile?.canBillInsurance ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </CategorySection>

          {/* Emergency Contact */}
          {(staff.staffProfile?.emergencyContactName || staff.staffProfile?.emergencyContactPhone) && (
            <CategorySection
              title="Emergency Contact"
              description="Emergency contact information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.staffProfile?.emergencyContactName && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Contact Name</label>
                    <p className="text-gray-900">{staff.staffProfile.emergencyContactName}</p>
                  </div>
                )}
                
                {staff.staffProfile?.emergencyContactPhone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{staff.staffProfile.emergencyContactPhone}</span>
                    </p>
                  </div>
                )}
              </div>
            </CategorySection>
          )}

          {/* Notes */}
          {staff.staffProfile?.notes && (
            <CategorySection
              title="Notes"
              description="Additional notes and comments"
            >
              <div className="space-y-2">
                <p className="text-gray-900 whitespace-pre-wrap">{staff.staffProfile.notes}</p>
              </div>
            </CategorySection>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <CategorySection
            title="Quick Stats"
            description="Key information at a glance"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant={getStatusBadgeVariant(staff.isActive)}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm text-gray-900">{formatDate(staff.createdAt)}</span>
              </div>
              
              {staff.staffProfile?.supervisorId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Has Supervisor</span>
                  <Badge variant="outline">Yes</Badge>
                </div>
              )}
            </div>
          </CategorySection>

          {/* Actions */}
          <CategorySection
            title="Quick Actions"
            description="Common actions for this staff member"
          >
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleEditStaff}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {/* TODO: Implement view performance */}}
              >
                <Award className="h-4 w-4 mr-2" />
                View Performance
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {/* TODO: Implement view schedule */}}
              >
                <Clock className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {/* TODO: Implement view clients */}}
              >
                <Users className="h-4 w-4 mr-2" />
                View Clients
              </Button>
            </div>
          </CategorySection>
        </div>
      </div>
    </PageLayout>
  );
};

export default StaffDetailPage; 