
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/basic/dialog';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Plus, Search, Mail, Calendar, Users, BarChart3, Eye, Send } from 'lucide-react';

const CampaignManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const campaigns = [
    {
      id: 1,
      name: 'Monthly Mental Health Newsletter',
      type: 'Email Newsletter',
      status: 'Active',
      audience: 'All Referral Sources',
      recipientCount: 150,
      sendDate: '2024-01-15',
      lastSent: '2024-01-15',
      openRate: 68,
      clickRate: 12,
      description: 'Monthly newsletter featuring mental health tips, practice updates, and educational content.',
      nextSend: '2024-02-15'
    },
    {
      id: 2,
      name: 'New Provider Introduction',
      type: 'Email Campaign',
      status: 'Scheduled',
      audience: 'Healthcare Providers',
      recipientCount: 85,
      sendDate: '2024-01-20',
      lastSent: null,
      openRate: null,
      clickRate: null,
      description: 'Introduction campaign for new therapist joining the practice.',
      nextSend: '2024-01-20'
    },
    {
      id: 3,
      name: 'Quarterly Practice Update',
      type: 'Email Campaign',
      status: 'Draft',
      audience: 'All Contacts',
      recipientCount: 200,
      sendDate: null,
      lastSent: '2023-10-15',
      openRate: 72,
      clickRate: 15,
      description: 'Quarterly update on practice achievements, new services, and upcoming changes.',
      nextSend: null
    },
    {
      id: 4,
      name: 'Holiday Outreach',
      type: 'Direct Mail',
      status: 'Completed',
      audience: 'Top Referrers',
      recipientCount: 25,
      sendDate: '2023-12-15',
      lastSent: '2023-12-15',
      openRate: null,
      clickRate: null,
      description: 'Holiday greeting cards with practice appreciation message to top referral sources.',
      nextSend: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateCampaign = (formData: FormData) => {
    console.log('Creating new campaign:', Object.fromEntries(formData));
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Campaign</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateCampaign(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
                      <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                      <SelectItem value="Direct Mail">Direct Mail</SelectItem>
                      <SelectItem value="Phone Outreach">Phone Outreach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select name="audience">
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Contacts">All Contacts</SelectItem>
                      <SelectItem value="Healthcare Providers">Healthcare Providers</SelectItem>
                      <SelectItem value="All Referral Sources">All Referral Sources</SelectItem>
                      <SelectItem value="Top Referrers">Top Referrers</SelectItem>
                      <SelectItem value="Insurance Contacts">Insurance Contacts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sendDate">Send Date</Label>
                  <Input name="sendDate" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" rows={3} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Campaign</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.recipientCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(campaigns.filter(c => c.openRate).reduce((sum, c) => sum + c.openRate!, 0) / campaigns.filter(c => c.openRate).length)}%
                </p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">{campaign.name}</h4>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span><strong>Audience:</strong> {campaign.audience}</span>
                      </div>
                      <div>
                        <strong>Recipients:</strong> {campaign.recipientCount}
                      </div>
                      {campaign.sendDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span><strong>Send Date:</strong> {new Date(campaign.sendDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {campaign.lastSent && (
                        <div>
                          <strong>Last Sent:</strong> {new Date(campaign.lastSent).toLocaleDateString()}
                        </div>
                      )}
                      {campaign.nextSend && (
                        <div>
                          <strong>Next Send:</strong> {new Date(campaign.nextSend).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {campaign.openRate !== null && (
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span><strong>Open Rate:</strong> {campaign.openRate}%</span>
                        </div>
                      )}
                      {campaign.clickRate !== null && (
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span><strong>Click Rate:</strong> {campaign.clickRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{campaign.description}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {campaign.status === 'Draft' && (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  {campaign.openRate !== null && (
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignManagement;
