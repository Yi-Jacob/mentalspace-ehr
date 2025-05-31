
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import VerificationModal from './verification/VerificationModal';

const InsuranceVerification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: verifications, isLoading } = useQuery({
    queryKey: ['insurance-verifications', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('insurance_verifications')
        .select(`
          *,
          clients (
            first_name,
            last_name,
            date_of_birth
          ),
          client_insurance (
            insurance_company,
            policy_number
          ),
          users (
            first_name,
            last_name
          )
        `)
        .order('verification_date', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        // Use a simpler search approach that works with Supabase
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
        
        if (clientData && clientData.length > 0) {
          const clientIds = clientData.map(c => c.id);
          query = query.in('client_id', clientIds);
        } else {
          return []; // No matching clients found
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
                      {verification.clients?.first_name} {verification.clients?.last_name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(verification.status)}
                      <Badge className={getStatusColor(verification.status)}>
                        {verification.status}
                      </Badge>
                    </div>
                    {isVerificationDue(verification.next_verification_date) && (
                      <Badge variant="destructive">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due Soon
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Insurance:</strong> {verification.client_insurance?.insurance_company}
                    </div>
                    <div>
                      <strong>Policy:</strong> {verification.client_insurance?.policy_number}
                    </div>
                    <div>
                      <strong>Verified:</strong> {new Date(verification.verification_date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>By:</strong> {verification.users?.first_name} {verification.users?.last_name}
                    </div>
                  </div>

                  {verification.benefits_verified && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {verification.deductible_amount && (
                        <div>
                          <strong>Deductible:</strong> ${verification.deductible_amount}
                          {verification.deductible_met && ` (Met: $${verification.deductible_met})`}
                        </div>
                      )}
                      {verification.copay_amount && (
                        <div>
                          <strong>Copay:</strong> ${verification.copay_amount}
                        </div>
                      )}
                      {verification.out_of_pocket_max && (
                        <div>
                          <strong>OOP Max:</strong> ${verification.out_of_pocket_max}
                          {verification.out_of_pocket_met && ` (Met: $${verification.out_of_pocket_met})`}
                        </div>
                      )}
                      {verification.authorization_required && (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span>Auth Required</span>
                        </div>
                      )}
                    </div>
                  )}

                  {verification.next_verification_date && (
                    <div className="text-sm text-gray-600">
                      <strong>Next Verification:</strong> {new Date(verification.next_verification_date).toLocaleDateString()}
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
