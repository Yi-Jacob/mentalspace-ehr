
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Phone, Mail, MapPin, Building, Users, Download } from 'lucide-react';

const ContactDatabase = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const contacts = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      organization: 'Family Medicine Associates',
      position: 'Primary Care Physician',
      category: 'Healthcare Provider',
      email: 's.johnson@fma.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      specialty: 'Family Medicine',
      relationship: 'Active Referrer',
      tags: ['Referral Source', 'Primary Care', 'Anxiety Specialist'],
      notes: 'Excellent referral source for anxiety disorders. Prefers phone communication.',
      lastContact: '2024-01-15',
      addedDate: '2023-03-10'
    },
    {
      id: 2,
      name: 'Jennifer Martinez',
      organization: 'Blue Cross Blue Shield',
      position: 'Provider Relations Manager',
      category: 'Insurance',
      email: 'j.martinez@bcbs.com',
      phone: '(555) 987-6543',
      address: '456 Insurance Blvd, Anytown, ST 12345',
      specialty: 'Provider Relations',
      relationship: 'Business Contact',
      tags: ['Insurance', 'Provider Relations', 'BCBS'],
      notes: 'Primary contact for BCBS provider issues and pre-authorizations.',
      lastContact: '2024-01-10',
      addedDate: '2023-05-15'
    },
    {
      id: 3,
      name: 'Michael Chen',
      organization: 'Wellness Community Center',
      position: 'Program Director',
      category: 'Community Partner',
      email: 'm.chen@wellnesscenter.org',
      phone: '(555) 456-7890',
      address: '789 Community Dr, Anytown, ST 12345',
      specialty: 'Community Mental Health',
      relationship: 'Partner',
      tags: ['Community Health', 'Support Groups', 'Wellness'],
      notes: 'Collaborates on community mental health programs and support groups.',
      lastContact: '2024-01-08',
      addedDate: '2023-07-20'
    }
  ];

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Active Referrer': return 'bg-green-100 text-green-800';
      case 'Business Contact': return 'bg-blue-100 text-blue-800';
      case 'Partner': return 'bg-purple-100 text-purple-800';
      case 'Vendor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddContact = (formData: FormData) => {
    console.log('Adding new contact:', Object.fromEntries(formData));
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
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Healthcare Provider">Healthcare Providers</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
              <SelectItem value="Community Partner">Community Partners</SelectItem>
              <SelectItem value="Vendor">Vendors</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddContact(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input name="organization" />
                </div>
                <div>
                  <Label htmlFor="position">Position/Title</Label>
                  <Input name="position" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthcare Provider">Healthcare Provider</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Community Partner">Community Partner</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Specialty/Focus</Label>
                  <Input name="specialty" />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship Type</Label>
                  <Select name="relationship">
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active Referrer">Active Referrer</SelectItem>
                      <SelectItem value="Business Contact">Business Contact</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input name="tags" placeholder="e.g., Primary Care, Referral Source, Insurance" />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea name="notes" rows={3} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Contact</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">{contact.name}</h4>
                    <Badge className={getRelationshipColor(contact.relationship)}>
                      {contact.relationship}
                    </Badge>
                    <Badge variant="outline">{contact.category}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{contact.organization}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{contact.position}</span>
                      </div>
                      <div>
                        <strong>Specialty:</strong> {contact.specialty}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-xs">{contact.address}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <strong>Last Contact:</strong> {new Date(contact.lastContact).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Added:</strong> {new Date(contact.addedDate).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {contact.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{contact.notes}</p>
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
                  <Button size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContactDatabase;
