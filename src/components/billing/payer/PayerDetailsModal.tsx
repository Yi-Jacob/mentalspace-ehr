
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Phone, Mail, Globe, User, MapPin } from 'lucide-react';
import { Payer } from '@/types/billing';

interface PayerDetailsModalProps {
  payer: Payer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayerDetailsModal: React.FC<PayerDetailsModalProps> = ({ payer, open, onOpenChange }) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>{payer.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Badge className={getPayerTypeBadge(payer.payer_type)}>
              {payer.payer_type.replace('_', ' ')}
            </Badge>
            {payer.requires_authorization && (
              <Badge variant="outline">
                Authorization Required
              </Badge>
            )}
            {!payer.is_active && (
              <Badge variant="secondary">
                Inactive
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payer.electronic_payer_id && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Electronic ID:</span>
                    <span>{payer.electronic_payer_id}</span>
                  </div>
                )}
                {payer.phone_number && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{payer.phone_number}</span>
                  </div>
                )}
                {payer.fax_number && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Fax:</span>
                    <span>{payer.fax_number}</span>
                  </div>
                )}
                {payer.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={payer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {payer.website}
                    </a>
                  </div>
                )}
                {payer.contact_person && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{payer.contact_person}</span>
                  </div>
                )}
                {payer.contact_email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${payer.contact_email}`} className="text-blue-600 hover:underline">
                      {payer.contact_email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address</CardTitle>
              </CardHeader>
              <CardContent>
                {(payer.address_line_1 || payer.city || payer.state) ? (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      {payer.address_line_1 && <div>{payer.address_line_1}</div>}
                      {payer.address_line_2 && <div>{payer.address_line_2}</div>}
                      {(payer.city || payer.state || payer.zip_code) && (
                        <div>
                          {payer.city && payer.city}
                          {payer.city && payer.state && ', '}
                          {payer.state && payer.state}
                          {payer.zip_code && ` ${payer.zip_code}`}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">No address provided</span>
                )}
              </CardContent>
            </Card>
          </div>

          {payer.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{payer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayerDetailsModal;
