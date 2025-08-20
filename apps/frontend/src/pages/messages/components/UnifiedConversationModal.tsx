import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Textarea } from '@/components/basic/textarea';
import { Badge } from '@/components/basic/badge';
import { Users, X, Plus, User, UserCheck, Building2, UserCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import { messageService } from '@/services/messageService';
import { useToast } from '@/hooks/use-toast';

interface UnifiedConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedClientId?: string;
}

interface UserOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'staff' | 'client';
  jobTitle?: string;
  department?: string;
  preferredName?: string;
}

const UnifiedConversationModal: React.FC<UnifiedConversationModalProps> = ({ 
  open, 
  onOpenChange,
  preselectedClientId 
}) => {
  const [title, setTitle] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [category, setCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [initialMessage, setInitialMessage] = useState('');
  const [conversationType, setConversationType] = useState<'individual' | 'group'>('individual');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set preselected client when modal opens
  useEffect(() => {
    if (open && preselectedClientId) {
      setSelectedUserIds([preselectedClientId]);
    }
  }, [open, preselectedClientId]);

  // Auto-determine conversation type based on selected users
  useEffect(() => {
    if (selectedUserIds.length === 2) {
      setConversationType('individual');
    } else if (selectedUserIds.length > 2) {
      setConversationType('group');
    }
  }, [selectedUserIds]);

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['all-users-for-conversation'],
    queryFn: async () => {
      return staffService.getAllUsers();
    },
    enabled: open, // Only fetch when modal is open
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return messageService.createConversationWithMessage({
        title: title || 'New Conversation',
        participantIds: selectedUserIds,
        category,
        priority,
        initialMessage,
        type: conversationType,
      });
    },
    onSuccess: () => {
      toast({
        title: "Conversation Created",
        description: "The conversation has been created successfully with your initial message.",
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
      console.error('Create conversation error:', error);
    },
  });

  const resetForm = () => {
    setTitle('');
    setSelectedUserIds(preselectedClientId ? [preselectedClientId] : []);
    setCategory('general');
    setPriority('normal');
    setInitialMessage('');
    setConversationType('individual');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one recipient.",
        variant: "destructive",
      });
      return;
    }
    if (!initialMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an initial message.",
        variant: "destructive",
      });
      return;
    }
    createConversationMutation.mutate();
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getSelectedUsers = () => {
    return users?.filter(user => selectedUserIds.includes(user.id)) || [];
  };

  const getUserIcon = (userType: 'staff' | 'client') => {
    return userType === 'staff' ? <Building2 className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />;
  };

  const getUserTypeBadge = (userType: 'staff' | 'client') => {
    return (
      <Badge variant={userType === 'staff' ? 'default' : 'secondary'} className="text-xs">
        {userType === 'staff' ? 'Staff' : 'Client'}
      </Badge>
    );
  };

  if (usersLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (usersError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <p className="text-red-500">Error loading users: {usersError.message}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>New Conversation</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipients Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Recipients *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Available Users */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Available Users</Label>
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
                  {users?.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                        selectedUserIds.includes(user.id)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        {getUserIcon(user.userType)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm truncate">
                              {user.firstName} {user.lastName}
                            </span>
                            {getUserTypeBadge(user.userType)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                          {user.userType === 'staff' && user.jobTitle && (
                            <div className="text-xs text-gray-500 truncate">
                              {user.jobTitle} {user.department && `• ${user.department}`}
                            </div>
                          )}
                          {user.userType === 'client' && user.preferredName && (
                            <div className="text-xs text-gray-500 truncate">
                              Preferred: {user.preferredName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Users */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">
                  Selected Recipients ({selectedUserIds.length})
                </Label>
                <div className="border rounded-lg p-3 min-h-[200px] bg-gray-50">
                  {getSelectedUsers().length > 0 ? (
                    <div className="space-y-2">
                      {getSelectedUsers().map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            {getUserIcon(user.userType)}
                            <span className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </span>
                            {getUserTypeBadge(user.userType)}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserSelection(user.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No recipients selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Conversation Type
            </Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="individual"
                  checked={conversationType === 'individual'}
                  onChange={(e) => setConversationType(e.target.value as 'individual' | 'group')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Individual ({selectedUserIds.length === 2 ? '✓' : 'Need 2 people'})</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="group"
                  checked={conversationType === 'group'}
                  onChange={(e) => setConversationType(e.target.value as 'individual' | 'group')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Group ({selectedUserIds.length >= 3 ? '✓' : 'Need 3+ people'})</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Conversation Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter conversation title (optional)"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-[60] bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="z-[60] bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Initial Message */}
          <div className="space-y-2">
            <Label htmlFor="initialMessage" className="text-sm font-medium">
              Initial Message *
            </Label>
            <Textarea
              id="initialMessage"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Type your initial message..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createConversationMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createConversationMutation.isPending || 
                selectedUserIds.length === 0 || 
                !initialMessage.trim() ||
                (conversationType === 'individual' && selectedUserIds.length !== 2) ||
                (conversationType === 'group' && selectedUserIds.length < 3)
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {createConversationMutation.isPending ? 'Creating...' : 'Create Conversation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedConversationModal;
