import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { DollarSign, Calendar, Clock, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentCalculations: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [periodFilter, setPeriodFilter] = useState('current');

  const { data: paymentCalculations, isLoading } = useQuery({
    queryKey: ['payment-calculations', statusFilter, periodFilter],
    queryFn: async () => {
      let query = supabase
        .from('payment_calculations')
        .select(`
          *,
          user:users!payment_calculations_user_id_fkey(first_name, last_name),
          processed_by_user:users!payment_calculations_processed_by_fkey(first_name, last_name)
        `)
        .order('pay_period_start', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Filter by period
      if (periodFilter === 'current') {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        query = query.gte('pay_period_start', startOfWeek.toISOString().split('T')[0]);
      } else if (periodFilter === 'last_month') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query = query.gte('pay_period_start', lastMonth.toISOString().split('T')[0]);
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
                  ${paymentCalculations?.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.gross_amount.toString()), 0).toFixed(2) || '0.00'}
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
                  ${paymentCalculations?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.gross_amount.toString()), 0).toFixed(2) || '0.00'}
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
                  ${paymentCalculations?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.gross_amount.toString()), 0).toFixed(2) || '0.00'}
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
                  {new Set(paymentCalculations?.map(p => p.user_id)).size || 0}
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
                      {calculation.user?.first_name} {calculation.user?.last_name}
                    </h4>
                    <Badge className={getStatusColor(calculation.status)}>
                      {calculation.status}
                    </Badge>
                    <Badge variant="outline">
                      {formatCompensationType(calculation.compensation_type)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        <strong>Period:</strong> {new Date(calculation.pay_period_start).toLocaleDateString()} - {new Date(calculation.pay_period_end).toLocaleDateString()}
                      </span>
                    </div>
                    {calculation.total_sessions > 0 && (
                      <div>
                        <strong>Sessions:</strong> {calculation.total_sessions}
                      </div>
                    )}
                    {calculation.total_hours > 0 && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span><strong>Hours:</strong> {calculation.total_hours}</span>
                      </div>
                    )}
                    <div>
                      <strong>Created:</strong> {new Date(calculation.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Gross Amount:</strong> 
                      <span className="text-green-600 font-semibold ml-1">
                        ${parseFloat(calculation.gross_amount.toString()).toFixed(2)}
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
                        ${parseFloat(calculation.net_amount.toString()).toFixed(2)}
                      </span>
                    </div>
                    {calculation.regular_hours > 0 && (
                      <div>
                        <strong>Regular Hours:</strong> {calculation.regular_hours}
                        {calculation.overtime_hours > 0 && (
                          <span className="text-orange-600 ml-2">
                            (OT: {calculation.overtime_hours})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {calculation.processed_at && calculation.processed_by_user && (
                    <div className="text-sm text-gray-600">
                      <strong>Processed by:</strong> {calculation.processed_by_user.first_name} {calculation.processed_by_user.last_name}
                      <span className="ml-2">
                        on {new Date(calculation.processed_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {calculation.calculation_details && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <details className="cursor-pointer">
                        <summary className="font-medium text-gray-700">Calculation Details</summary>
                        <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                          {JSON.stringify(calculation.calculation_details, null, 2)}
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
