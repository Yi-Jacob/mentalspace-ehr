
import React, { useState } from 'react';
import { Label } from '@/components/basic/label';
import { Users, User, UserCheck, X, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userType: 'staff' | 'client';
  jobTitle?: string;
  department?: string;
}

interface UserSelectionFieldProps {
  users: User[];
  selectedUserIds: string[];
  onUserChange: (value: string[]) => void;
  disabled?: boolean;
  isEditing?: boolean;
  conversationType?: 'individual' | 'group';
}

const UserSelectionField: React.FC<UserSelectionFieldProps> = ({
  users,
  selectedUserIds,
  onUserChange,
  disabled = false,
  isEditing = false,
  conversationType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));

  const getUserIcon = (userType: 'staff' | 'client') => {
    return userType === 'staff' ? <UserCheck className="h-4 w-4 text-blue-600" /> : <User className="h-4 w-4 text-green-600" />;
  };

  const getUserTypeLabel = (userType: 'staff' | 'client') => {
    return userType === 'staff' ? 'Staff' : 'Client';
  };

  const getUserDisplayInfo = (user: User) => {
    const baseInfo = `${user?.firstName} ${user?.lastName}`;
    const typeLabel = getUserTypeLabel(user?.userType);
    
    if (user?.userType === 'staff' && user?.jobTitle) {
      return `${baseInfo} (${user.jobTitle})`;
    }
    
    return `${baseInfo} (${typeLabel})`;
  };

  const handleUserToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onUserChange(selectedUserIds.filter(id => id !== userId));
    } else {
      onUserChange([...selectedUserIds, userId]);
    }
  };

  const removeUser = (userId: string) => {
    onUserChange(selectedUserIds.filter(id => id !== userId));
  };

  // Separate users into clients and staff, then sort each group alphabetically
  const clients = users.filter(user => user.userType === 'client')
    .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  
  const staff = users.filter(user => user.userType === 'staff')
    .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

  const getSelectedCount = () => {
    if (selectedUserIds.length === 0) return 'Choose recipients';
    if (selectedUserIds.length === 1) return `${selectedUsers[0]?.firstName} ${selectedUsers[0]?.lastName}`;
    return `${selectedUserIds.length} recipients selected`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="user" className="text-sm font-medium">
        {isEditing ? 'Manage Participants' : 'Select Recipients'} *
        {isEditing && conversationType && (
          <span className="ml-2 text-xs font-normal text-gray-500">
            ({conversationType === 'group' ? 'Group Chat' : 'Individual Chat'})
          </span>
        )}
      </Label>
      
      {disabled && selectedUsers.length > 0 ? (
        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                {getUserIcon(user.userType)}
                <span>{getUserDisplayInfo(user)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="flex items-center space-x-2">
                  {getUserIcon(user.userType)}
                  <span>{getUserDisplayInfo(user)}</span>
                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Multi-Select Dropdown */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              disabled={disabled}
              className="w-full justify-between"
            >
              <span className="text-left">{getSelectedCount()}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {/* Clients Section */}
                {clients.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                      Clients
                    </div>
                    {clients.map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleUserToggle(user.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                            className="rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {getUserIcon(user.userType)}
                          <span className="flex-1">{getUserDisplayInfo(user)}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Staff Section */}
                {staff.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                      Staff
                    </div>
                    {staff.map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleUserToggle(user.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                            className="rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {getUserIcon(user.userType)}
                          <span className="flex-1">{getUserDisplayInfo(user)}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserSelectionField;
