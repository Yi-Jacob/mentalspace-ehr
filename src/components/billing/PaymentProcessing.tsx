
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentProcessing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          clients (first_name, last_name),
          claims (claim_number),
          payers (name)
        `)
        .order('payment_date', { ascending: false });

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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'ach':
        return 'ACH';
      case 'cash':
        return 'Cash';
      case 'check':
        return 'Check';
      case 'insurance':
        return 'Insurance';
      default:
        return method;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search payments..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Process Payment</span>
        </Button>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {payments?.map((payment) => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">
                      Payment #{payment.payment_number}
                    </h4>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Patient:</strong> {payment.clients?.first_name} {payment.clients?.last_name}
                    </div>
                    <div>
                      <strong>Claim:</strong> {payment.claims?.claim_number || 'Direct Payment'}
                    </div>
                    <div>
                      <strong>Payer:</strong> {payment.payers?.name || 'Patient'}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Amount:</strong> ${parseFloat(payment.payment_amount.toString()).toFixed(2)}
                    </div>
                    <div>
                      <strong>Processing Fee:</strong> ${parseFloat(payment.processing_fee?.toString() || '0').toFixed(2)}
                    </div>
                    <div>
                      <strong>Net Amount:</strong> ${parseFloat(payment.net_amount?.toString() || payment.payment_amount.toString()).toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <span><strong>Method:</strong> {formatPaymentMethod(payment.payment_method)}</span>
                    </div>
                  </div>

                  {payment.credit_card_last_four && (
                    <div className="text-sm text-gray-600">
                      <strong>Card ending in:</strong> **** {payment.credit_card_last_four}
                    </div>
                  )}

                  {payment.reference_number && (
                    <div className="text-sm text-gray-600">
                      <strong>Reference:</strong> {payment.reference_number}
                    </div>
                  )}

                  {payment.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 text-sm">{payment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {payment.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {payments?.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'No payments match your search criteria.' 
              : 'Get started by processing your first payment.'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;
