import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, FileText, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ClaimsSubmission: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'submitted' | 'paid' | 'denied' | 'rejected'>('all');

  const { data: claims, isLoading } = useQuery({
    queryKey: ['claims', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('claims')
        .select(`
          *,
          clients (first_name, last_name),
          users (first_name, last_name),
          payers (name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied':
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading claims...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: 'all' | 'draft' | 'submitted' | 'paid' | 'denied' | 'rejected') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Claim</span>
        </Button>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims?.map((claim) => (
          <Card key={claim.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">
                      Claim #{claim.claim_number}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(claim.status)}
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Patient:</strong> {claim.clients?.first_name} {claim.clients?.last_name}
                    </div>
                    <div>
                      <strong>Provider:</strong> {claim.users?.first_name} {claim.users?.last_name}
                    </div>
                    <div>
                      <strong>Payer:</strong> {claim.payers?.name}
                    </div>
                    <div>
                      <strong>Service Date:</strong> {new Date(claim.service_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Total Amount:</strong> ${parseFloat(claim.total_amount.toString()).toFixed(2)}
                    </div>
                    <div>
                      <strong>Paid Amount:</strong> ${parseFloat(claim.paid_amount.toString()).toFixed(2)}
                    </div>
                    <div>
                      <strong>Patient Responsibility:</strong> ${parseFloat(claim.patient_responsibility.toString()).toFixed(2)}
                    </div>
                    <div>
                      <strong>Submission Date:</strong> {claim.submission_date ? new Date(claim.submission_date).toLocaleDateString() : 'Not submitted'}
                    </div>
                  </div>

                  {(claim.denial_reason || claim.rejection_reason) && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">
                          {claim.status === 'denied' ? 'Denial Reason:' : 'Rejection Reason:'}
                        </span>
                      </div>
                      <p className="text-red-700 mt-1">
                        {claim.denial_reason || claim.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {claim.status === 'draft' && (
                    <Button size="sm" className="flex items-center space-x-1">
                      <Send className="h-3 w-3" />
                      <span>Submit</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {claims?.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'No claims match your search criteria.' 
              : 'Get started by creating your first claim.'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Claim
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClaimsSubmission;
