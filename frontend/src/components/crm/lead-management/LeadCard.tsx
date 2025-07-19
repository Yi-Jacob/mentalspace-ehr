
import React from 'react';
import { Card, CardContent } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Phone, Mail, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  priority: string;
  concerns?: string;
  preferred_contact: string;
  insurance?: string;
  date_received: string;
  last_contact_date?: string;
  next_followup_date?: string;
  notes?: string;
}

interface LeadCardProps {
  lead: Lead;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

const LeadCard = ({ lead, getStatusColor, getPriorityColor }: LeadCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold text-lg">{lead.name}</h4>
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
              <Badge className={getPriorityColor(lead.priority)}>
                {lead.priority} Priority
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                {lead.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span><strong>Source:</strong> {lead.source || 'Not specified'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <strong>Concerns:</strong> {lead.concerns || 'Not specified'}
                </div>
                <div>
                  <strong>Insurance:</strong> {lead.insurance || 'Not specified'}
                </div>
                <div>
                  <strong>Preferred Contact:</strong> {lead.preferred_contact}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span><strong>Received:</strong> {format(new Date(lead.date_received), 'MMM d, yyyy')}</span>
                </div>
                {lead.last_contact_date && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span><strong>Last Contact:</strong> {format(new Date(lead.last_contact_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {lead.next_followup_date && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span><strong>Next Follow-up:</strong> {format(new Date(lead.next_followup_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>

            {lead.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{lead.notes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button size="sm">Update Status</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
