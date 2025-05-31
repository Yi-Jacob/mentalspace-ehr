
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Receipt, Send, Download, Mail, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { StatementWithDetails } from '@/types/billing';

const StatementGeneration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: statements = [], isLoading } = useQuery({
    queryKey: ['patient-statements', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('patient_statements')
        .select(`
          *,
          client:clients(first_name, last_name, email),
          line_items:statement_line_items(*),
          created_by_user:users(first_name, last_name)
        `)
        .order('statement_date', { ascending: false });

      if (searchTerm) {
        query = query.or(`statement_number.ilike.%${searchTerm}%,client.first_name.ilike.%${searchTerm}%,client.last_name.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as StatementWithDetails[];
    },
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'portal':
        return <Download className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Statement Generation</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Batch Generate
          </Button>
          <Button>
            <Receipt className="h-4 w-4 mr-2" />
            Create Statement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Statements</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-muted-foreground">
              Across all statements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Delivery Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Successful deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Statements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Need follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search statements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading statements...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statements.map((statement) => (
                <div
                  key={statement.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Receipt className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{statement.statement_number}</h3>
                          <Badge className={getStatusBadge(statement.status)}>
                            {statement.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{statement.client?.first_name} {statement.client?.last_name}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(statement.statement_date).toLocaleDateString()}</span>
                          </div>
                          {statement.delivery_method && (
                            <div className="flex items-center space-x-1">
                              {getDeliveryMethodIcon(statement.delivery_method)}
                              <span className="capitalize">{statement.delivery_method}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-red-600" />
                            <span className="font-medium">Balance: ${statement.current_balance}</span>
                          </div>
                          <span>Total: ${statement.total_amount}</span>
                          {statement.payments_received > 0 && (
                            <span className="text-green-600">
                              Paid: ${statement.payments_received}
                            </span>
                          )}
                        </div>
                        {statement.due_date && (
                          <div className="mt-1 text-sm text-gray-500">
                            Due: {new Date(statement.due_date).toLocaleDateString()}
                            {new Date(statement.due_date) < new Date() && (
                              <span className="text-red-600 ml-2">(Overdue)</span>
                            )}
                          </div>
                        )}
                        {statement.line_items && statement.line_items.length > 0 && (
                          <div className="mt-2 text-sm text-gray-500">
                            {statement.line_items.length} service{statement.line_items.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      {statement.status === 'draft' && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      {statement.status === 'sent' && statement.client?.email && (
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Resend
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {statements.length === 0 && (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No statements found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatementGeneration;
