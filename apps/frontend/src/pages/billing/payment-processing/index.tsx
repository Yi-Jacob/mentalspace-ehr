import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { CreditCard, Search, Plus, DollarSign, Calendar } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { billingService } from '@/services/billingService';

const PaymentProcessingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', searchTerm, statusFilter],
    queryFn: async () => {
      // Get all payments and filter on the frontend for now
      // In a real implementation, you might want to add search and filter parameters to the backend
      const allPayments = await billingService.getAllPayments();
      
      let filteredPayments = allPayments;
      
      if (statusFilter !== 'all') {
        filteredPayments = filteredPayments.filter(p => p.status === statusFilter);
      }

      if (searchTerm) {
        // Filter by payment number or client name
        filteredPayments = filteredPayments.filter(p => 
          p.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredPayments;
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
    return (
      <PageLayout variant="simple">
        <PageHeader
          icon={CreditCard}
          title="Payment Processing"
          description="Process payments and manage patient accounts"
        />
        <div className="text-center py-8">Loading payments...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={CreditCard}
        title="Payment Processing"
        description="Process payments and manage patient accounts"
      />

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
            
            <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'completed' | 'failed' | 'refunded') => setStatusFilter(value)}>
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
                        Payment #{payment.paymentNumber}
                      </h4>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Patient:</strong> {payment.client?.firstName} {payment.client?.lastName}
                      </div>
                      <div>
                        <strong>Claim:</strong> {payment.claim?.claimNumber || 'Direct Payment'}
                      </div>
                      <div>
                        <strong>Payer:</strong> {payment.payer?.name || 'Patient'}
                      </div>
                      <div>
                        <strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Amount:</strong> ${parseFloat(payment.paymentAmount.toString()).toFixed(2)}
                      </div>
                      <div>
                        <strong>Processing Fee:</strong> ${parseFloat(payment.processingFee?.toString() || '0').toFixed(2)}
                      </div>
                      <div>
                        <strong>Net Amount:</strong> ${parseFloat(payment.netAmount?.toString() || payment.paymentAmount.toString()).toFixed(2)}
                      </div>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span><strong>Method:</strong> {formatPaymentMethod(payment.paymentMethod)}</span>
                      </div>
                    </div>

                    {payment.creditCardLastFour && (
                      <div className="text-sm text-gray-600">
                        <strong>Card ending in:</strong> **** {payment.creditCardLastFour}
                      </div>
                    )}

                    {payment.referenceNumber && (
                      <div className="text-sm text-gray-600">
                        <strong>Reference:</strong> {payment.referenceNumber}
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
    </PageLayout>
  );
};

export default PaymentProcessingPage;
