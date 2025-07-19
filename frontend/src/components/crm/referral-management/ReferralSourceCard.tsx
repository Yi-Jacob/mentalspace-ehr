
import React from 'react';
import { Card, CardContent } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Phone, Mail, MapPin, Star, TrendingUp } from 'lucide-react';

interface ReferralSource {
  id: string;
  name: string;
  organization?: string;
  type: string;
  specialty?: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship_strength: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ReferralSourceCardProps {
  source: ReferralSource;
  getRelationshipColor: (relationship: string) => string;
}

const ReferralSourceCard = ({ source, getRelationshipColor }: ReferralSourceCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold text-lg">{source.name}</h4>
              <Badge className={getRelationshipColor(source.relationship_strength)}>
                {source.relationship_strength}
              </Badge>
              <Badge variant="outline">{source.type}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{source.organization}</span>
                </div>
                {source.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{source.email}</span>
                  </div>
                )}
                {source.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{source.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <strong>Specialty:</strong> {source.specialty || 'Not specified'}
                </div>
                <div>
                  <strong>Status:</strong> {source.status}
                </div>
                <div>
                  <strong>Added:</strong> {new Date(source.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span><strong>This Month:</strong> {Math.floor(Math.random() * 10)} referrals</span>
                </div>
                <div>
                  <strong>Total Referrals:</strong> {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span><strong>Conversion:</strong> {Math.floor(Math.random() * 30) + 60}%</span>
                </div>
              </div>
            </div>

            {source.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{source.notes}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 ml-4">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button size="sm">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSourceCard;
