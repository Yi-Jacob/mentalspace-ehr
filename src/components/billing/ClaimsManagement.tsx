
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, FileText, DollarSign, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ClaimWithDetails } from '@/types/billing';

const ClaimsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['claims', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('claims')
        .select(`
          *,
          client:clients(first_name, last_name, email),
          provider:users(first_name, last_name),
          payer:payers(name, payer_type),
          line_items:claim_line_items(*)
        `)
        .order('service_date', { ascending: false });

      if (searchTerm) {
        query = query.or(`claim_number.ilike.%${searchTerm}%,client.first_name.ilike.%${searchTerm}%,client.last_name.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800',
      'denied': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'partial': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Claims Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Claim
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading claims...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{claim.claim_number}</h3>
                          <Badge className={getStatusBadge(claim.status)}>
                            {claim.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{claim.client?.first_name} {claim.client?.last_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(claim.service_date).toLocaleDateString()}</span>
                          </div>
                          <span>{claim.payer?.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            <span className="font-medium">Total: ${claim.total_amount}</span>
                          </div>
                          {claim.paid_amount > 0 && (
                            <span className="text-green-600">
                              Paid: ${claim.paid_amount}
                            </span>
                          )}
                          {claim.patient_responsibility > 0 && (
                            <span className="text-orange-600">
                              Patient: ${claim.patient_responsibility}
                            </span>
                          )}
                        </div>
                        {claim.line_items && claim.line_items.length > 0 && (
                          <div className="mt-2 text-sm text-gray-500">
                            {claim.line_items.length} line item{claim.line_items.length !== 1 ? 's' : ''}
                            {claim.line_items.length > 0 && (
                              <span className="ml-2">
                                ({claim.line_items.map((item: any) => item.cpt_code).join(', ')})
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
                      {claim.status === 'draft' && (
                        <Button size="sm">
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {claims.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No claims found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsManagement;
