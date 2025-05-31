
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Building2, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Payer, PayerWithContracts } from '@/types/billing';
import AddPayerModal from './payer/AddPayerModal';
import EditPayerModal from './payer/EditPayerModal';
import PayerDetailsModal from './payer/PayerDetailsModal';

const PayerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayer, setEditingPayer] = useState<Payer | null>(null);
  const [selectedPayer, setSelectedPayer] = useState<Payer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payers = [], isLoading } = useQuery({
    queryKey: ['payers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('payers')
        .select('*')
        .order('name');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Payer[];
    },
  });

  const deletePayerMutation = useMutation({
    mutationFn: async (payerId: string) => {
      const { error } = await supabase
        .from('payers')
        .delete()
        .eq('id', payerId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payer deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['payers'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete payer",
        variant: "destructive",
      });
      console.error('Delete payer error:', error);
    },
  });

  const filteredPayers = payers.filter(payer =>
    payer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPayerTypeBadge = (type: string) => {
    const colors = {
      'in_network': 'bg-green-100 text-green-800',
      'out_of_network': 'bg-yellow-100 text-yellow-800',
      'government': 'bg-blue-100 text-blue-800',
      'self_pay': 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.self_pay;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payer Management</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payers..."
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
              <p className="text-gray-500 mt-2">Loading payers...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPayers.map((payer) => (
                <div
                  key={payer.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPayer(payer)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payer.name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          {payer.electronic_payer_id && (
                            <span>ID: {payer.electronic_payer_id}</span>
                          )}
                          {payer.phone_number && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{payer.phone_number}</span>
                            </div>
                          )}
                          {payer.contact_email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{payer.contact_email}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getPayerTypeBadge(payer.payer_type)}>
                            {payer.payer_type.replace('_', ' ')}
                          </Badge>
                          {payer.requires_authorization && (
                            <Badge variant="outline">
                              Auth Required
                            </Badge>
                          )}
                          {!payer.is_active && (
                            <Badge variant="secondary">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPayer(payer);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPayers.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No payers found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPayerModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
      
      {editingPayer && (
        <EditPayerModal 
          payer={editingPayer}
          open={!!editingPayer} 
          onOpenChange={(open) => !open && setEditingPayer(null)} 
        />
      )}

      {selectedPayer && (
        <PayerDetailsModal 
          payer={selectedPayer}
          open={!!selectedPayer} 
          onOpenChange={(open) => !open && setSelectedPayer(null)} 
        />
      )}
    </div>
  );
};

export default PayerManagement;
