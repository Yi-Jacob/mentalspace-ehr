
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InsuranceVerification as InsuranceVerificationType } from '@/types/billing';

const InsuranceVerification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['insurance-verifications', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('insurance_verifications')
        .select(`
          *,
          client:clients(first_name, last_name, email),
          insurance:client_insurance(insurance_company, policy_number),
          verified_by_user:users(first_name, last_name)
        `)
        .order('verification_date', { ascending: false });

      if (searchTerm) {
        query = query.or(`client.first_name.ilike.%${searchTerm}%,client.last_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'verified': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'denied': 'bg-red-100 text-red-800',
      'expired': 'bg-orange-100 text-orange-800',
      'needs_update': 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredVerifications = verifications.filter(verification =>
    verification.client?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.client?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.insurance?.insurance_company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Insurance Verification</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Verification
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search verifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading verifications...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVerifications.map((verification) => (
                <div
                  key={verification.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {getStatusIcon(verification.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {verification.client?.first_name} {verification.client?.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {verification.insurance?.insurance_company} - {verification.insurance?.policy_number}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Verified: {new Date(verification.verification_date).toLocaleDateString()}</span>
                          {verification.verified_by_user && (
                            <span>By: {verification.verified_by_user.first_name} {verification.verified_by_user.last_name}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getStatusBadge(verification.status)}>
                            {verification.status.replace('_', ' ')}
                          </Badge>
                          {verification.benefits_verified && (
                            <Badge variant="outline">
                              Benefits Verified
                            </Badge>
                          )}
                          {verification.authorization_required && (
                            <Badge variant="outline">
                              Auth Required
                            </Badge>
                          )}
                        </div>
                        {verification.copay_amount && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Copay:</span> ${verification.copay_amount}
                            {verification.deductible_amount && (
                              <span className="ml-4">
                                <span className="font-medium">Deductible:</span> ${verification.deductible_amount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Re-verify
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredVerifications.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No insurance verifications found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceVerification;
