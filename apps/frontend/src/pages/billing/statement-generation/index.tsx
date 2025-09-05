import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Receipt, Search, Plus, FileText, Send, Mail, Download } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
// TODO: Create patient statements backend and service
// import { statementService } from '@/services/statementService';

const StatementGenerationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: statements, isLoading } = useQuery({
    queryKey: ['patient-statements', searchTerm, statusFilter],
    queryFn: async () => {
      // TODO: Implement patient statements backend and service
      // For now, return empty array as placeholder
      console.log('Patient statements backend not yet implemented');
      return [];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <PageLayout variant="simple">
        <PageHeader
          icon={Receipt}
          title="Statement Generation"
          description="Generate and send patient statements"
        />
        <div className="text-center py-8">Loading statements...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Receipt}
        title="Statement Generation"
        description="Generate and send patient statements"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search statements..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Batch Send</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Generate Statement</span>
            </Button>
          </div>
        </div>

        {/* Statements List */}
        <div className="space-y-4">
          {statements?.map((statement) => (
            <Card key={statement.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">
                        Statement #{statement.statement_number}
                      </h4>
                      <Badge className={getStatusColor(statement.status)}>
                        {isOverdue(statement.due_date) && statement.status === 'sent' ? 'overdue' : statement.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Patient:</strong> {statement.clients?.first_name} {statement.clients?.last_name}
                      </div>
                      <div>
                        <strong>Statement Date:</strong> {new Date(statement.statement_date).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Due Date:</strong> {statement.due_date ? new Date(statement.due_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {statement.clients?.email || 'Not provided'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Total Amount:</strong> ${parseFloat(statement.total_amount.toString()).toFixed(2)}
                      </div>
                      <div>
                        <strong>Previous Balance:</strong> ${parseFloat(statement.previous_balance?.toString() || '0').toFixed(2)}
                      </div>
                      <div>
                        <strong>Payments Received:</strong> ${parseFloat(statement.payments_received?.toString() || '0').toFixed(2)}
                      </div>
                      <div>
                        <strong>Current Balance:</strong> 
                        <span className={parseFloat(statement.current_balance.toString()) > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                          ${parseFloat(statement.current_balance.toString()).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {statement.delivery_method && (
                      <div className="text-sm text-gray-600">
                        <strong>Delivery Method:</strong> {statement.delivery_method}
                      </div>
                    )}

                    {statement.email_sent_at && (
                      <div className="text-sm text-gray-600">
                        <strong>Email Sent:</strong> {new Date(statement.email_sent_at).toLocaleString()}
                        {statement.email_opened_at && (
                          <span className="ml-2 text-green-600">
                            (Opened: {new Date(statement.email_opened_at).toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}

                    {statement.payment_link && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-800">
                          <Mail className="h-4 w-4" />
                          <span className="font-medium">Online Payment Available</span>
                        </div>
                        <p className="text-blue-700 text-sm mt-1">
                          Patient can pay online using the payment link
                        </p>
                      </div>
                    )}

                    {statement.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700 text-sm">{statement.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>View</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                    {statement.status === 'draft' && (
                      <Button size="sm" className="flex items-center space-x-1">
                        <Send className="h-3 w-3" />
                        <span>Send</span>
                      </Button>
                    )}
                    {statement.status === 'sent' && statement.clients?.email && (
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>Resend</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {statements?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No statements found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No statements match your search criteria.' 
                : 'Get started by generating your first patient statement.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Statement
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default StatementGenerationPage;
