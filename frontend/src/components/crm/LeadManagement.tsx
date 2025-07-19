
import React, { useState } from 'react';
import { Skeleton } from '@/components/shared/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useLeads, useCreateLead } from '@/hooks/useCrmData';
import LeadManagementHeader from './lead-management/LeadManagementHeader';
import LeadCard from './lead-management/LeadCard';
import AddLeadModal from './lead-management/AddLeadModal';

const LeadManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: leads, isLoading } = useLeads();
  const createLead = useCreateLead();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-100 text-red-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-green-100 text-green-800';
      case 'Converted': return 'bg-blue-100 text-blue-800';
      case 'Lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddLead = async (formData: FormData) => {
    try {
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        source: formData.get('source') as string,
        priority: formData.get('priority') as string,
        preferred_contact: formData.get('preferredContact') as string,
        concerns: formData.get('concerns') as string,
        insurance: formData.get('insurance') as string,
        notes: formData.get('notes') as string,
      };

      await createLead.mutateAsync(data);
      setShowAddModal(false);
      toast({
        title: "Success",
        description: "Lead added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive"
      });
    }
  };

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.source?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      <LeadManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddLead={() => setShowAddModal(true)}
      />

      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        ))}
      </div>

      <AddLeadModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddLead}
        isPending={createLead.isPending}
      />
    </div>
  );
};

export default LeadManagement;
