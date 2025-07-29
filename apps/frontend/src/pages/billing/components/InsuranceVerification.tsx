import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Search, Plus, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { billingService } from '@/services/billingService';
import VerificationModal from './verification/VerificationModal';

const InsuranceVerification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'expired'>('all');
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: verifications, isLoading } = useQuery({
    queryKey: ['insurance-verifications', searchTerm, statusFilter],
    queryFn: async () => {
      // Get all verifications and filter on the frontend for now
      // In a real implementation, you might want to add search and filter parameters to the backend
      const allVerifications = await billingService.getAllVerifications();
      
      let filteredVerifications = allVerifications;
      
      if (statusFilter !== 'all') {
        filteredVerifications = filteredVerifications.filter(v => v.status === statusFilter);
      }

      if (searchTerm) {
        // Filter by client name
        filteredVerifications = filteredVerifications.filter(v => 
          v.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredVerifications;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isVerificationDue = (nextVerificationDate: string | null) => {
    if (!nextVerificationDate) return false;
    const dueDate = new Date(nextVerificationDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading verifications...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'verified' | 'expired') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Verification</span>
        </Button>
      </div>

      {/* Verifications List */}
      <div className="space-y-4">
        {verifications?.map((verification) => (
          <Card key={verification.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">
                      {verification.client?.firstName} {verification.client?.lastName}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(verification.status)}
                      <Badge className={getStatusColor(verification.status)}>
                        {verification.status}
                      </Badge>
                    </div>
                    {isVerificationDue(verification.nextVerificationDate) && (
                      <Badge variant="destructive">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due Soon
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Insurance:</strong> {verification.clientInsurance?.insuranceCompany}
                    </div>
                    <div>
                      <strong>Policy:</strong> {verification.clientInsurance?.policyNumber}
                    </div>
                    <div>
                      <strong>Verified:</strong> {new Date(verification.verificationDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>By:</strong> {verification.verifiedBy}
                    </div>
                  </div>

                  {verification.benefitsVerified && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {verification.deductibleAmount && (
                        <div>
                          <strong>Deductible:</strong> ${verification.deductibleAmount}
                          {verification.deductibleMet && ` (Met: $${verification.deductibleMet})`}
                        </div>
                      )}
                      {verification.copayAmount && (
                        <div>
                          <strong>Copay:</strong> ${verification.copayAmount}
                        </div>
                      )}
                      {verification.outOfPocketMax && (
                        <div>
                          <strong>OOP Max:</strong> ${verification.outOfPocketMax}
                          {verification.outOfPocketMet && ` (Met: $${verification.outOfPocketMet})`}
                        </div>
                      )}
                      {verification.authorizationRequired && (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span>Auth Required</span>
                        </div>
                      )}
                    </div>
                  )}

                  {verification.nextVerificationDate && (
                    <div className="text-sm text-gray-600">
                      <strong>Next Verification:</strong> {new Date(verification.nextVerificationDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedVerification(verification);
                    setShowModal(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {verifications?.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'No verifications match your search criteria.' 
              : 'Get started by creating your first insurance verification.'
            }
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Verification
          </Button>
        </div>
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVerification(null);
        }}
        verification={selectedVerification}
      />
    </div>
  );
};

export default InsuranceVerification;
