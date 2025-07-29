import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { DollarSign, Calendar, Clock, FileText, Users } from 'lucide-react';
import { complianceService } from '@/services/complianceService';

const PaymentCalculations: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [periodFilter, setPeriodFilter] = useState('current');

  const { data: paymentCalculations, isLoading } = useQuery({
    queryKey: ['payment-calculations', statusFilter, periodFilter],
    queryFn: async () => {
      return complianceService.getPaymentCalculations(statusFilter, periodFilter);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatCompensationType = (type: string) => {
    return type === 'session_based' ? 'Session Based' : 'Hourly';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading payment calculations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'completed' | 'cancelled') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4" />
          <span>Process Payments</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${paymentCalculations?.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.grossAmount.toString()), 0).toFixed(2) || '0.00'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${paymentCalculations?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.grossAmount.toString()), 0).toFixed(2) || '0.00'}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${paymentCalculations?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.grossAmount.toString()), 0).toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Count</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(paymentCalculations?.map(p => p.userId)).size || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Calculations List */}
      <div className="space-y-4">
        {paymentCalculations?.map((calculation) => (
          <Card key={calculation.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">
                      {calculation.user?.firstName} {calculation.user?.lastName}
                    </h4>
                    <Badge className={getStatusColor(calculation.status)}>
                      {calculation.status}
                    </Badge>
                    <Badge variant="outline">
                      {formatCompensationType(calculation.compensationType)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        <strong>Period:</strong> {new Date(calculation.payPeriodStart).toLocaleDateString()} - {new Date(calculation.payPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                    {calculation.totalSessions > 0 && (
                      <div>
                        <strong>Sessions:</strong> {calculation.totalSessions}
                      </div>
                    )}
                    {calculation.totalHours > 0 && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span><strong>Hours:</strong> {calculation.totalHours}</span>
                      </div>
                    )}
                    <div>
                      <strong>Created:</strong> {new Date(calculation.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Gross Amount:</strong> 
                      <span className="text-green-600 font-semibold ml-1">
                        ${parseFloat(calculation.grossAmount.toString()).toFixed(2)}
                      </span>
                    </div>
                    {calculation.deductions > 0 && (
                      <div>
                        <strong>Deductions:</strong> 
                        <span className="text-red-600 ml-1">
                          -${parseFloat(calculation.deductions.toString()).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div>
                      <strong>Net Amount:</strong> 
                      <span className="text-blue-600 font-semibold ml-1">
                        ${parseFloat(calculation.netAmount.toString()).toFixed(2)}
                      </span>
                    </div>
                    {calculation.regularHours > 0 && (
                      <div>
                        <strong>Regular Hours:</strong> {calculation.regularHours}
                        {calculation.overtimeHours > 0 && (
                          <span className="text-orange-600 ml-2">
                            (OT: {calculation.overtimeHours})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {calculation.processedAt && calculation.processedByUser && (
                    <div className="text-sm text-gray-600">
                      <strong>Processed by:</strong> {calculation.processedByUser.firstName} {calculation.processedByUser.lastName}
                      <span className="ml-2">
                        on {new Date(calculation.processedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {calculation.calculationDetails && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <details className="cursor-pointer">
                        <summary className="font-medium text-gray-700">Calculation Details</summary>
                        <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                          {JSON.stringify(calculation.calculationDetails, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {calculation.status === 'pending' && (
                    <Button size="sm" className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>Process</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paymentCalculations?.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment calculations found</h3>
          <p className="text-gray-600 mb-4">
            {statusFilter !== 'all' || periodFilter !== 'all'
              ? 'No calculations match your filter criteria.'
              : 'Payment calculations will appear here as they are processed.'
            }
          </p>
          <Button>
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payments
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentCalculations;
