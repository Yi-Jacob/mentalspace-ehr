import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Edit, Award, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types/staffType';
import { staffService } from '@/services/staffService';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { StaffInfoTab } from './components/StaffInfoTab';

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
                <span className="font-medium">{staff.staffProfile.department}</span>
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
        {/* Main Content */}
        <div className="lg:col-span-2">
          <StaffInfoTab staff={staff} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
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
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Roles</span>
                <span className="text-sm text-gray-900">{staff.roles?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StaffDetailPage; 