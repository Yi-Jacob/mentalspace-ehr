import React, { useState, useEffect } from 'react';
import { User, Edit, Mail, Phone, MapPin, Calendar, Shield, Users, Stethoscope, Clock, Award, Lock } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { usersService, UserProfile, UpdateProfileData } from '@/services/usersService';
import { useAuth } from '@/hooks/useAuth';

const MyProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateProfileData>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await usersService.getMyProfile();
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) {
      setEditData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        middleName: profile.middleName,
        suffix: profile.suffix,
        email: profile.email,
        userName: profile.userName,
        // Staff fields
        phoneNumber: profile.phoneNumber,
        mobilePhone: profile.mobilePhone,
        workPhone: profile.workPhone,
        homePhone: profile.homePhone,
        canReceiveText: profile.canReceiveText,
        address1: profile.address1,
        address2: profile.address2,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        formalName: profile.formalName,
        clinicianType: profile.clinicianType,
        supervisionType: profile.supervisionType,
        userComments: profile.userComments,
        notes: profile.notes,
        // Client fields
        preferredName: profile.preferredName,
        pronouns: profile.pronouns,
        administrativeSex: profile.administrativeSex,
        genderIdentity: profile.genderIdentity,
        sexualOrientation: profile.sexualOrientation,
        timezone: profile.timezone,
        race: profile.race,
        ethnicity: profile.ethnicity,
        languages: profile.languages,
        maritalStatus: profile.maritalStatus,
        employmentStatus: profile.employmentStatus,
        religiousAffiliation: profile.religiousAffiliation,
        smokingStatus: profile.smokingStatus,
        appointmentReminders: profile.appointmentReminders,
        patientComments: profile.patientComments,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedProfile = await usersService.updateMyProfile(editData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string | boolean) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError(null);
  };

  const handlePasswordInputChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setPasswordError(null);
  };

  const handlePasswordSave = async () => {
    try {
      setIsLoading(true);
      setPasswordError(null);
      
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New password and confirmation password do not match');
        return;
      }

      await usersService.updatePassword(passwordData);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
      console.error('Error updating password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError(null);
  };

  if (isLoading && !profile) {
    return (
      <PageLayout variant="gradient">
        <LoadingSpinner message="Loading your profile..." />
      </PageLayout>
    );
  }

  if (error && !profile) {
    return (
      <PageLayout variant="gradient">
        <EmptyState
          title="Failed to load profile"
          description={error}
          actionLabel="Retry"
          onAction={loadProfile}
          icon={User}
        />
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout variant="gradient">
        <EmptyState
          title="Profile not found"
          description="Your profile could not be found."
          icon={User}
        />
      </PageLayout>
    );
  }

  const getDisplayName = () => {
    const name = `${profile.firstName} ${profile.lastName}`;
    if (profile.preferredName && profile.preferredName !== profile.firstName) {
      return `${name} (${profile.preferredName})`;
    }
    return name;
  };

  const getRoleBadge = () => {
    const role = profile.roles[0];
    const variant = role === 'admin' ? 'destructive' : role === 'supervisor' ? 'default' : 'secondary';
    return <Badge variant={variant}>{role}</Badge>;
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={User}
        title={getDisplayName()}
        description={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {profile.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            )}
            
            {profile.phoneNumber && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{profile.phoneNumber}</span>
              </div>
            )}
            
            {(profile.city || profile.state) && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}, {profile.state}</span>
              </div>
            )}
          </div>
        }
        badge={getRoleBadge()}
        action={
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEdit}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.lastName}</p>
                  )}
                </div>
                {profile.middleName && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Middle Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.middleName || ''}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.middleName}</p>
                    )}
                  </div>
                )}
                {profile.suffix && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Suffix</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.suffix || ''}
                        onChange={(e) => handleInputChange('suffix', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.suffix}</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.email}</p>
                )}
              </div>
              {profile.userName && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.userName || ''}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.userName}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Staff Information */}
          {profile.userType === 'staff' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Staff Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.jobTitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Job Title</label>
                      <p className="mt-1 text-gray-900">{profile.jobTitle}</p>
                    </div>
                  )}
                  {profile.department && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Department</label>
                      <p className="mt-1 text-gray-900">{profile.department}</p>
                    </div>
                  )}
                  {profile.employeeId && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Employee ID</label>
                      <p className="mt-1 text-gray-900">{profile.employeeId}</p>
                    </div>
                  )}
                  {profile.hireDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Hire Date</label>
                      <p className="mt-1 text-gray-900">{new Date(profile.hireDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                
                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.phoneNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.phoneNumber || ''}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{profile.phoneNumber}</p>
                        )}
                      </div>
                    )}
                    {profile.mobilePhone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Mobile</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.mobilePhone || ''}
                            onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{profile.mobilePhone}</p>
                        )}
                      </div>
                    )}
                    {profile.workPhone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Work Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.workPhone || ''}
                            onChange={(e) => handleInputChange('workPhone', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{profile.workPhone}</p>
                        )}
                      </div>
                    )}
                    {profile.homePhone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Home Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.homePhone || ''}
                            onChange={(e) => handleInputChange('homePhone', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{profile.homePhone}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                {(profile.address1 || profile.city || profile.state) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.address1 && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.address1 || ''}
                              onChange={(e) => handleInputChange('address1', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{profile.address1}</p>
                          )}
                        </div>
                      )}
                      {profile.address2 && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">Address Line 2</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.address2 || ''}
                              onChange={(e) => handleInputChange('address2', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{profile.address2}</p>
                          )}
                        </div>
                      )}
                      {profile.city && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">City</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.city || ''}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{profile.city}</p>
                          )}
                        </div>
                      )}
                      {profile.state && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">State</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.state || ''}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{profile.state}</p>
                          )}
                        </div>
                      )}
                      {profile.zipCode && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.zipCode || ''}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{profile.zipCode}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Client Information */}
          {profile.userType === 'client' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Client Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.preferredName && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.preferredName || ''}
                          onChange={(e) => handleInputChange('preferredName', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile.preferredName}</p>
                      )}
                    </div>
                  )}
                  {profile.pronouns && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pronouns</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.pronouns || ''}
                          onChange={(e) => handleInputChange('pronouns', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile.pronouns}</p>
                      )}
                    </div>
                  )}
                  {profile.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="mt-1 text-gray-900">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  )}
                  {profile.timezone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Timezone</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.timezone || ''}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile.timezone}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supervision Relationships */}
          {(profile.supervisors.length > 0 || profile.supervisees.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Supervision</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.supervisors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Supervisors</h4>
                    <div className="space-y-2">
                      {profile.supervisors.map((supervisor) => (
                        <div key={supervisor.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {supervisor.firstName} {supervisor.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{supervisor.email}</p>
                          {supervisor.jobTitle && (
                            <p className="text-sm text-gray-500">{supervisor.jobTitle}</p>
                          )}
                          <Badge variant="outline" className="mt-1">
                            {supervisor.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.supervisees.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Supervisees</h4>
                    <div className="space-y-2">
                      {profile.supervisees.map((supervisee) => (
                        <div key={supervisee.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {supervisee.firstName} {supervisee.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{supervisee.email}</p>
                          {supervisee.jobTitle && (
                            <p className="text-sm text-gray-500">{supervisee.jobTitle}</p>
                          )}
                          <Badge variant="outline" className="mt-1">
                            {supervisee.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assigned Clients (for staff) */}
          {profile.userType === 'staff' && profile.assignedClients && profile.assignedClients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Assigned Clients</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.assignedClients.map((client) => (
                    <div key={client.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {client.preferredName || `${client.firstName} ${client.lastName}`}
                      </p>
                      {client.email && (
                        <p className="text-sm text-gray-600">{client.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Clinician (for clients) */}
          {profile.userType === 'client' && profile.assignedClinicians && profile.assignedClinicians.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Assigned Clinicians</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.assignedClinicians.map((clinician) => (
                    <div key={clinician.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {clinician.firstName} {clinician.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{clinician.email}</p>
                      {clinician.jobTitle && (
                        <p className="text-sm text-gray-500">{clinician.jobTitle}</p>
                      )}
                      {clinician.department && (
                        <p className="text-sm text-gray-500">{clinician.department}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Licenses (for staff) */}
          {profile.userType === 'staff' && profile.licenses && profile.licenses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Licenses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.licenses.map((license) => (
                    <div key={license.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{license.licenseType}</p>
                      <p className="text-sm text-gray-600">{license.licenseNumber}</p>
                      <p className="text-sm text-gray-500">
                        {license.licenseState} • Expires: {new Date(license.licenseExpirationDate).toLocaleDateString()}
                      </p>
                      <Badge variant={license.licenseStatus === 'active' ? 'default' : 'secondary'} className="mt-1">
                        {license.licenseStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700">User Type</label>
                <p className="mt-1 text-gray-900 capitalize">{profile.userType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Roles</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile.roles.map((role) => (
                    <Badge key={role} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <Badge variant={profile.isActive ? 'default' : 'secondary'}>
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-gray-900">{new Date(profile.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isChangingPassword ? (
                <>
                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{passwordError}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your new password"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handlePasswordCancel}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePasswordSave}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Keep your account secure by updating your password regularly.
                  </p>
                  <Button
                    onClick={handlePasswordChange}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyProfilePage;
