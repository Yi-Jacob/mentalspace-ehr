import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Building2, Plus, Search, Edit, FileText, DollarSign } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { billingService } from '@/services/billingService';
import PayerModal from '../components/payer/PayerModal';
import ContractModal from '../components/payer/ContractModal';
import FeeScheduleModal from '../components/payer/FeeScheduleModal';

const PayerManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<any>(null);
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showFeeScheduleModal, setShowFeeScheduleModal] = useState(false);

  const { data: payers, isLoading } = useQuery({
    queryKey: ['payers', searchTerm],
    queryFn: async () => {
      // Get all payers and filter on the frontend for now
      // In a real implementation, you might want to add search parameter to the backend
      const allPayers = await billingService.getAllPayers();
      
      if (searchTerm) {
        return allPayers.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return allPayers;
    },
  });

  const getPayerTypeColor = (type: string) => {
    switch (type) {
      case 'in_network':
        return 'bg-green-100 text-green-800';
      case 'out_of_network':
        return 'bg-yellow-100 text-yellow-800';
      case 'self_pay':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPayerType = (type: string) => {
    switch (type) {
      case 'in_network':
        return 'In-Network';
      case 'out_of_network':
        return 'Out-of-Network';
      case 'self_pay':
        return 'Self-Pay';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <PageLayout variant="simple">
        <PageHeader
          icon={Building2}
          title="Payer Management"
          description="Manage insurance companies, contracts, and fee schedules"
        />
        <div className="text-center py-8">Loading payers...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Building2}
        title="Payer Management"
        description="Manage insurance companies, contracts, and fee schedules"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button onClick={() => setShowPayerModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Payer</span>
          </Button>
        </div>

        {/* Payers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payers?.map((payer) => (
            <Card key={payer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{payer.name}</CardTitle>
                    <Badge className={getPayerTypeColor(payer.payerType)}>
                      {formatPayerType(payer.payerType)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPayer(payer);
                      setShowPayerModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {payer.electronicPayerId && (
                  <div className="text-sm text-gray-600">
                    <strong>Payer ID:</strong> {payer.electronicPayerId}
                  </div>
                )}
                
                {payer.phoneNumber && (
                  <div className="text-sm text-gray-600">
                    <strong>Phone:</strong> {payer.phoneNumber}
                  </div>
                )}

                {payer.requiresAuthorization && (
                  <Badge variant="outline" className="text-xs">
                    Requires Authorization
                  </Badge>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayer(payer);
                      setShowContractModal(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Contracts</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayer(payer);
                      setShowFeeScheduleModal(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <DollarSign className="h-3 w-3" />
                    <span>Fees</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {payers?.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No payers match your search criteria.' : 'Get started by adding your first payer.'}
            </p>
            <Button onClick={() => setShowPayerModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payer
            </Button>
          </div>
        )}

        {/* Modals */}
        <PayerModal
          isOpen={showPayerModal}
          onClose={() => {
            setShowPayerModal(false);
            setSelectedPayer(null);
          }}
          payer={selectedPayer}
        />

        <ContractModal
          isOpen={showContractModal}
          onClose={() => {
            setShowContractModal(false);
            setSelectedPayer(null);
          }}
          payer={selectedPayer}
        />

        <FeeScheduleModal
          isOpen={showFeeScheduleModal}
          onClose={() => {
            setShowFeeScheduleModal(false);
            setSelectedPayer(null);
          }}
          payer={selectedPayer}
        />
      </div>
    </PageLayout>
  );
};

export default PayerManagementPage;
