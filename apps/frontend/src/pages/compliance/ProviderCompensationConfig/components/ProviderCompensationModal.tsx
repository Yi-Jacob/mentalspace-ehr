import React from 'react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { type ProviderCompensationConfig } from '@/services/complianceService';
import { type StaffProfile } from '@/services/staffService';

interface ProviderCompensationModalProps {
  editingConfig: ProviderCompensationConfig | null;
  isPracticeAdmin: boolean;
  currentStaffProfileId?: string;
  staffProfiles?: StaffProfile[];
  user: any;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

const ProviderCompensationModal: React.FC<ProviderCompensationModalProps> = ({
  editingConfig,
  isPracticeAdmin,
  currentStaffProfileId,
  staffProfiles,
  user,
  onSubmit,
  onCancel,
  isPending,
}) => {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {editingConfig ? 'Edit Compensation Configuration' : 'Add Compensation Configuration'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="provider_id">Provider</Label>
            <Select 
              name="provider_id" 
              defaultValue={editingConfig?.providerId || (isPracticeAdmin ? '' : currentStaffProfileId)} 
              required
              disabled={!isPracticeAdmin && !!currentStaffProfileId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider..." />
              </SelectTrigger>
              <SelectContent>
                {isPracticeAdmin ? (
                  staffProfiles?.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.firstName} {profile.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={currentStaffProfileId || ''}>
                    {user?.firstName} {user?.lastName}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="compensation_type">Compensation Type</Label>
            <Select name="compensation_type" defaultValue={editingConfig?.compensationType || 'session_based'} required>
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session_based">Per Session</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="base_session_rate">Base Session Rate ($)</Label>
            <Input
              name="base_session_rate"
              type="number"
              step="0.01"
              min="0"
              defaultValue={editingConfig?.baseSessionRate || ''}
              placeholder="Enter session rate"
            />
          </div>
          
          <div>
            <Label htmlFor="base_hourly_rate">Base Hourly Rate ($)</Label>
            <Input
              name="base_hourly_rate"
              type="number"
              step="0.01"
              min="0"
              defaultValue={editingConfig?.baseHourlyRate || ''}
              placeholder="Enter hourly rate"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="experience_tier">Experience Tier</Label>
            <Select name="experience_tier" defaultValue={editingConfig?.experienceTier?.toString() || '1'}>
              <SelectTrigger>
                <SelectValue placeholder="Select tier..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Tier 1 (0-2 years)</SelectItem>
                <SelectItem value="2">Tier 2 (3-5 years)</SelectItem>
                <SelectItem value="3">Tier 3 (6-10 years)</SelectItem>
                <SelectItem value="4">Tier 4 (10+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="effective_date">Effective Date</Label>
            <Input
              name="effective_date"
              type="date"
              defaultValue={editingConfig?.effectiveDate ? new Date(editingConfig.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="expiration_date">Expiration Date (Optional)</Label>
          <Input
            name="expiration_date"
            type="date"
            defaultValue={editingConfig?.expirationDate ? new Date(editingConfig.expirationDate).toISOString().split('T')[0] : ''}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="evening_differential">Evening Differential ($/hr)</Label>
            <Input
              name="evening_differential"
              type="number"
              step="0.01"
              min="0"
              defaultValue={editingConfig?.eveningDifferential || '0'}
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label htmlFor="weekend_differential">Weekend Differential ($/hr)</Label>
            <Input
              name="weekend_differential"
              type="number"
              step="0.01"
              min="0"
              defaultValue={editingConfig?.weekendDifferential || '0'}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_overtime_eligible"
            name="is_overtime_eligible"
            defaultChecked={editingConfig?.isOvertimeEligible || false}
            className="rounded border-gray-300"
          />
          <Label htmlFor="is_overtime_eligible">Eligible for overtime pay</Label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
          >
            {isPending 
              ? 'Saving...' 
              : (editingConfig ? 'Update Configuration' : 'Save Configuration')
            }
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ProviderCompensationModal;
