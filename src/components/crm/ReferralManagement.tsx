
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Phone, Mail, MapPin, Star, TrendingUp } from 'lucide-react';

const ReferralManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const referralSources = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      organization: 'Family Medicine Associates',
      type: 'Healthcare Provider',
      specialty: 'Family Medicine',
      email: 's.johnson@fma.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      referralsThisMonth: 8,
      totalReferrals: 45,
      conversionRate: 85,
      status: 'Active',
      relationship: 'Strong',
      lastContact: '2024-01-15',
      notes: 'Excellent source for anxiety and depression referrals. Prefers phone communication.'
    },
    {
      id: 2,
      name: 'Valley Medical Center',
      organization: 'Valley Medical Center',
      type: 'Hospital',
      specialty: 'Emergency Medicine',
      email: 'referrals@valleymedical.com',
      phone: '(555) 987-6543',
      address: '456 Hospital Ave, Anytown, ST 12345',
      referralsThisMonth: 6,
      totalReferrals: 32,
      conversionRate: 72,
      status: 'Active',
      relationship: 'Good',
      lastContact: '2024-01-10',
      notes: 'Refers crisis cases and trauma patients. Fast turnaround needed.'
    },
    {
      id: 3,
      name: 'Wellness Community Clinic',
      organization: 'Wellness Community Clinic',
      type: 'Community Health',
      specialty: 'Primary Care',
      email: 'intake@wellnessclinic.org',
      phone: '(555) 456-7890',
      address: '789 Community Dr, Anytown, ST 12345',
      referralsThisMonth: 4,
      totalReferrals: 28,
      conversionRate: 68,
      status: 'Active',
      relationship: 'Developing',
      lastContact: '2024-01-08',
      notes: 'Focus on underserved populations. Sliding scale arrangements needed.'
    }
  ];

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Strong': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Developing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddReferralSource = (formData: FormData) => {
    console.log('Adding new referral source:', Object.fromEntries(formData));
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search referral sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Healthcare Provider">Healthcare Providers</SelectItem>
              <SelectItem value="Hospital">Hospitals</SelectItem>
              <SelectItem value="Community Health">Community Health</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Referral Source</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Referral Source</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddReferralSource(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Contact Name</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input name="organization" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthcare Provider">Healthcare Provider</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Community Health">Community Health</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input name="specialty" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" type="email" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input name="phone" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input name="address" />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea name="notes" rows={3} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Referral Source</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Referral Sources List */}
      <div className="space-y-4">
        {referralSources.map((source) => (
          <Card key={source.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">{source.name}</h4>
                    <Badge className={getRelationshipColor(source.relationship)}>
                      {source.relationship}
                    </Badge>
                    <Badge variant="outline">{source.type}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{source.organization}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{source.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{source.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <strong>Specialty:</strong> {source.specialty}
                      </div>
                      <div>
                        <strong>Last Contact:</strong> {new Date(source.lastContact).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Status:</strong> {source.status}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span><strong>This Month:</strong> {source.referralsThisMonth} referrals</span>
                      </div>
                      <div>
                        <strong>Total Referrals:</strong> {source.totalReferrals}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span><strong>Conversion:</strong> {source.conversionRate}%</span>
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
        ))}
      </div>
    </div>
  );
};

export default ReferralManagement;
