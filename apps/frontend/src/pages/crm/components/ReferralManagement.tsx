
import React, { useState } from 'react';
import { Skeleton } from '@/components/basic/skeleton';
import { useToast } from '@/hooks/use-toast';
import ReferralManagementHeader from './referral-management/ReferralManagementHeader';
import ReferralSourceCard from './referral-management/ReferralSourceCard';
import AddReferralSourceModal from './referral-management/AddReferralSourceModal';

// Mock hooks for now since the database tables don't exist yet
const useReferralSources = () => ({
  data: [],
  isLoading: false
});

const useCreateReferralSource = () => ({
  mutateAsync: async (data: any) => Promise.resolve(data),
  isPending: false
});

const ReferralManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { data: referralSources, isLoading } = useReferralSources();
  const createReferralSource = useCreateReferralSource();
  const { toast } = useToast();

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Strong': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Developing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddReferralSource = async (formData: FormData) => {
    try {
      const data = {
        name: formData.get('name') as string,
        organization: formData.get('organization') as string,
        type: formData.get('type') as string,
        specialty: formData.get('specialty') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        notes: formData.get('notes') as string,
      };

      await createReferralSource.mutateAsync(data);
      setShowAddModal(false);
      toast({
        title: "Success",
        description: "Referral source added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add referral source",
        variant: "destructive"
      });
    }
  };

  const filteredSources = referralSources?.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || source.type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReferralManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        onAddReferralSource={() => setShowAddModal(true)}
      />

      <div className="space-y-4">
        {filteredSources.map((source) => (
          <ReferralSourceCard
            key={source.id}
            source={source}
            getRelationshipColor={getRelationshipColor}
          />
        ))}
      </div>

      <AddReferralSourceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddReferralSource}
        isPending={createReferralSource.isPending}
      />
    </div>
  );
};

export default ReferralManagement;
