import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calculator, Calendar, DollarSign, Clock, Users, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { complianceService, WeeklyPaymentCalculation, PaymentCalculationSummary } from '@/services/complianceService';
import { format } from 'date-fns';

const PaymentCalculations: React.FC = () => {
  // Generate week options for the last 12 weeks
  const generateWeekOptions = () => {
    const weeks = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + i * 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekKey = weekStart.toISOString().split('T')[0];
      const weekLabel = `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`;
      
      weeks.push({ key: weekKey, label: weekLabel, start: weekStart });
    }
    return weeks;
  };

  const weekOptions = generateWeekOptions();
  const currentWeek = weekOptions[0];

  const [selectedWeek, setSelectedWeek] = useState<string>(currentWeek.key);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const queryClient = useQueryClient();

  // Get weekly payment calculations for all providers
  const { data: weeklyCalculations, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ['weekly-payment-calculations', selectedWeek],
    queryFn: () => complianceService.getWeeklyPaymentCalculations(selectedWeek),
  });

  // Get specific provider calculation if selected
  const { data: providerCalculation, isLoading: isLoadingProvider } = useQuery({
    queryKey: ['provider-payment-calculation', selectedProvider, selectedWeek],
    queryFn: () => complianceService.getWeeklyPaymentCalculation(selectedProvider, selectedWeek),
    enabled: !!selectedProvider && selectedProvider !== 'all',
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: ({ providerId, payPeriodWeek }: { providerId: string; payPeriodWeek: string }) =>
      complianceService.processPayment(providerId, payPeriodWeek),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-payment-calculations'] });
      queryClient.invalidateQueries({ queryKey: ['provider-payment-calculation'] });
    },
  });

  // Calculate summary statistics
  const summaryStats = weeklyCalculations ? {
    totalProviders: weeklyCalculations.length,
    totalSessions: weeklyCalculations.reduce((sum, calc) => sum + calc.totalSessions, 0),
    totalHours: weeklyCalculations.reduce((sum, calc) => sum + calc.totalHours, 0),
    totalAmount: weeklyCalculations.reduce((sum, calc) => sum + calc.totalAmount, 0),
  } : null;

  const handleProcessPayment = (providerId: string) => {
    processPaymentMutation.mutate({ providerId, payPeriodWeek: selectedWeek });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  // Define columns for the main table
  const providerColumns: TableColumn<PaymentCalculationSummary>[] = [
    {
      key: 'providerName',
      header: 'Provider',
      accessor: (item) => <span className="font-medium">{item.providerName}</span>,
      sortable: true,
    },
    {
      key: 'totalSessions',
      header: 'Sessions',
      accessor: (item) => item.totalSessions,
      sortable: true,
    },
    {
      key: 'totalHours',
      header: 'Hours',
      accessor: (item) => formatHours(item.totalHours),
      sortable: true,
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      accessor: (item) => <span className="font-semibold">{formatCurrency(item.totalAmount)}</span>,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => (
        <Badge variant={item.status === 'processed' ? 'default' : 'secondary'}>
          {item.status === 'processed' ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Processed
            </>
          ) : (
            <>
              <AlertTriangle className="h-3 w-3 mr-1" />
              Pending
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <Button
          size="sm"
          onClick={() => handleProcessPayment(item.providerId)}
          disabled={item.status === 'processed' || item.totalSessions === 0}
        >
          Process Payment
        </Button>
      ),
    },
  ];

  // Define columns for the sessions table
  const sessionColumns: TableColumn<any>[] = [
    {
      key: 'clientName',
      header: 'Client',
      accessor: (item) => <span className="font-medium">{item.clientName}</span>,
      sortable: true,
    },
    {
      key: 'sessionDate',
      header: 'Date',
      accessor: (item) => format(new Date(item.sessionDate), 'MMM dd, yyyy'),
      sortable: true,
    },
    {
      key: 'sessionType',
      header: 'Type',
      accessor: (item) => item.sessionType,
      sortable: true,
    },
    {
      key: 'durationMinutes',
      header: 'Duration',
      accessor: (item) => `${item.durationMinutes} min`,
      sortable: true,
    },
    {
      key: 'calculatedAmount',
      header: 'Amount',
      accessor: (item) => formatCurrency(item.calculatedAmount),
      sortable: true,
    },
    {
      key: 'isNoteSigned',
      header: 'Status',
      accessor: (item) => (
        <Badge variant={item.isNoteSigned ? 'default' : 'destructive'}>
          {item.isNoteSigned ? 'Signed' : 'Unsigned'}
        </Badge>
      ),
    },
  ];

  if (isLoadingWeekly) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={Calculator}
          title="Payment Calculations"
          description="Calculate and process provider payments and bonuses"
        />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment calculations...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Calculator}
        title="Payment Calculations"
        description="Calculate and process provider payments and bonuses"
      />

      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Pay Period Week</label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekOptions.map((week) => (
                      <SelectItem key={week.key} value={week.key}>
                        {week.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Provider</label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Providers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    {weeklyCalculations?.map((calc) => (
                      <SelectItem key={calc.providerId} value={calc.providerId}>
                        {calc.providerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        {summaryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Providers</p>
                    <p className="text-2xl font-bold text-blue-600">{summaryStats.totalProviders}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-green-600">{summaryStats.totalSessions}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-purple-600">{formatHours(summaryStats.totalHours)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.totalAmount)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Provider Payment Calculations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Payment Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              data={weeklyCalculations || []}
              columns={providerColumns}
              sortable
              emptyMessage="No payment calculations found for this period"
            />
          </CardContent>
        </Card>

        {/* Detailed Provider View */}
        {selectedProvider && selectedProvider !== 'all' && providerCalculation && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Calculation - {providerCalculation.providerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-blue-700">{providerCalculation.totalSessions}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Total Hours</p>
                    <p className="text-2xl font-bold text-green-700">{formatHours(providerCalculation.totalHours)}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Total Amount</p>
                    <p className="text-2xl font-bold text-purple-700">{formatCurrency(providerCalculation.totalAmount)}</p>
                  </div>
                </div>

                {/* Compensation Config */}
                {providerCalculation.compensationConfig && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Compensation Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {providerCalculation.compensationConfig.compensationType}
                      </div>
                      {providerCalculation.compensationConfig.baseSessionRate && (
                        <div>
                          <span className="font-medium">Base Session Rate:</span> {formatCurrency(providerCalculation.compensationConfig.baseSessionRate)}
                        </div>
                      )}
                      {providerCalculation.compensationConfig.baseHourlyRate && (
                        <div>
                          <span className="font-medium">Base Hourly Rate:</span> {formatCurrency(providerCalculation.compensationConfig.baseHourlyRate)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sessions List */}
                <div>
                  <h4 className="font-semibold mb-4">Sessions</h4>
                  <Table
                    data={providerCalculation.sessions}
                    columns={sessionColumns}
                    sortable
                    emptyMessage="No sessions found"
                  />
                </div>

                {/* Process Payment Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleProcessPayment(selectedProvider)}
                    disabled={providerCalculation.totalSessions === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default PaymentCalculations;
