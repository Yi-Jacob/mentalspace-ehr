
import React from 'react';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Users, User, UserCheck } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'staff' | 'client';
  jobTitle?: string;
  department?: string;
}

interface UserSelectionFieldProps {
  users: User[];
  selectedUserId: string;
  onUserChange: (value: string) => void;
  disabled?: boolean;
}

const UserSelectionField: React.FC<UserSelectionFieldProps> = ({
  users,
  selectedUserId,
  onUserChange,
  disabled = false,
}) => {
  const selectedUser = users.find(user => user.id === selectedUserId);

  const getUserIcon = (userType: 'staff' | 'client') => {
    return userType === 'staff' ? <UserCheck className="h-4 w-4 text-blue-600" /> : <User className="h-4 w-4 text-green-600" />;
  };

  const getUserTypeLabel = (userType: 'staff' | 'client') => {
    return userType === 'staff' ? 'Staff' : 'Client';
  };

  const getUserDisplayInfo = (user: User) => {
    const baseInfo = `${user.firstName} ${user.lastName}`;
    const typeLabel = getUserTypeLabel(user.userType);
    
    if (user.userType === 'staff' && user.jobTitle) {
      return `${baseInfo} (${user.jobTitle})`;
    }
    
    return `${baseInfo} (${typeLabel})`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="user" className="text-sm font-medium">
        Select Recipient *
      </Label>
      {disabled && selectedUser ? (
        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            {getUserIcon(selectedUser.userType)}
            <span>{getUserDisplayInfo(selectedUser)}</span>
            {selectedUser.email && <span className="text-sm text-gray-500">({selectedUser.email})</span>}
          </div>
        </div>
      ) : (
        <Select value={selectedUserId} onValueChange={onUserChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a recipient to message" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center space-x-2">
                  {getUserIcon(user.userType)}
                  <span>{getUserDisplayInfo(user)}</span>
                  {user.email && <span className="text-sm text-gray-500">({user.email})</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default UserSelectionField;
