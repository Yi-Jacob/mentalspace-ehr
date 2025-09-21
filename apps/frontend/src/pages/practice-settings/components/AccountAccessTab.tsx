import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Users, 
  Shield, 
  CheckSquare, 
  Upload, 
  Activity, 
  Key, 
  Pill 
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType;
}

const PracticeInformationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    practiceName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phoneNumber: '',
    faxNumber: '',
    preferredEmail: '',
    practiceWebAddress: '',
    npi: '',
    federalTaxId: '',
    placeOfServiceCode: '',
    taxonomyCode: '',
    timeZone: 'America/New_York'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving practice information:', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Practice Information</span>
        </CardTitle>
        <CardDescription>
          Change your practice's name, contact information, and login settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="practiceName">Practice Name</Label>
            <Input
              id="practiceName"
              value={formData.practiceName}
              onChange={(e) => handleInputChange('practiceName', e.target.value)}
              placeholder="Enter practice name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              placeholder="Suite 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={(e) => handleInputChange('zip', e.target.value)}
              placeholder="12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faxNumber">Fax Number</Label>
            <Input
              id="faxNumber"
              value={formData.faxNumber}
              onChange={(e) => handleInputChange('faxNumber', e.target.value)}
              placeholder="(555) 123-4568"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredEmail">Preferred Email Contact</Label>
            <Input
              id="preferredEmail"
              type="email"
              value={formData.preferredEmail}
              onChange={(e) => handleInputChange('preferredEmail', e.target.value)}
              placeholder="contact@practice.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="practiceWebAddress">Practice Web Address</Label>
            <Input
              id="practiceWebAddress"
              value={formData.practiceWebAddress}
              onChange={(e) => handleInputChange('practiceWebAddress', e.target.value)}
              placeholder="https://www.practice.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="npi">National Provider Identifier (NPI)</Label>
            <Input
              id="npi"
              value={formData.npi}
              onChange={(e) => handleInputChange('npi', e.target.value)}
              placeholder="1234567890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="federalTaxId">Federal Tax ID Number</Label>
            <Input
              id="federalTaxId"
              value={formData.federalTaxId}
              onChange={(e) => handleInputChange('federalTaxId', e.target.value)}
              placeholder="12-3456789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeOfServiceCode">Place-of-Service Code</Label>
            <Input
              id="placeOfServiceCode"
              value={formData.placeOfServiceCode}
              onChange={(e) => handleInputChange('placeOfServiceCode', e.target.value)}
              placeholder="11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxonomyCode">Taxonomy Code</Label>
            <Input
              id="taxonomyCode"
              value={formData.taxonomyCode}
              onChange={(e) => handleInputChange('taxonomyCode', e.target.value)}
              placeholder="101Y00000X"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select value={formData.timeZone} onValueChange={(value) => handleInputChange('timeZone', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SubscriptionSection: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState({
    therapyNotesAccounts: {
      firstClinician: true,
      additionalClinicians: 0,
      schedulersBillers: 0
    },
    therapyFuel: false,
    telehealth: {
      basic: true,
      premium: false
    },
    clearinghouseServices: {
      realTimeEligibility: false,
      electronicClaims: false,
      remittanceAdvice: false,
      mailedPaperClaims: false
    },
    appointmentReminders: {
      textPhone: false,
      email: true
    },
    ePrescribe: false
  });

  const handleToggle = (section: string, field: string, value: boolean) => {
    setSubscriptionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNumberChange = (section: string, field: string, value: number) => {
    setSubscriptionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Subscription</span>
        </CardTitle>
        <CardDescription>
          Change payment options, update your billing information, and add or remove services from your bill.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* TherapyNotes Accounts */}
        <div className="space-y-4">
          <h4 className="font-semibold">TherapyNotes Accounts</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">First Clinician</p>
                <p className="text-sm text-gray-600">$69/month</p>
              </div>
              <Switch checked={subscriptionData.therapyNotesAccounts.firstClinician} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Additional Clinicians</p>
                <p className="text-sm text-gray-600">$40/month each</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('therapyNotesAccounts', 'additionalClinicians', Math.max(0, subscriptionData.therapyNotesAccounts.additionalClinicians - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center">{subscriptionData.therapyNotesAccounts.additionalClinicians}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('therapyNotesAccounts', 'additionalClinicians', subscriptionData.therapyNotesAccounts.additionalClinicians + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Schedulers/Billers</p>
                <p className="text-sm text-gray-600">Free</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('therapyNotesAccounts', 'schedulersBillers', Math.max(0, subscriptionData.therapyNotesAccounts.schedulersBillers - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center">{subscriptionData.therapyNotesAccounts.schedulersBillers}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberChange('therapyNotesAccounts', 'schedulersBillers', subscriptionData.therapyNotesAccounts.schedulersBillers + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* TherapyFuel */}
        <div className="space-y-4">
          <h4 className="font-semibold">TherapyFuel</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Each Clinician</p>
              <p className="text-sm text-gray-600">$40/month</p>
            </div>
            <Switch 
              checked={subscriptionData.therapyFuel} 
              onCheckedChange={(checked) => setSubscriptionData(prev => ({ ...prev, therapyFuel: checked }))}
            />
          </div>
        </div>

        {/* Telehealth */}
        <div className="space-y-4">
          <h4 className="font-semibold">TherapyNotes Telehealth</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Telehealth</p>
                <p className="text-sm text-gray-600">Free</p>
              </div>
              <Switch 
                checked={subscriptionData.telehealth.basic} 
                onCheckedChange={(checked) => handleToggle('telehealth', 'basic', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Premium Telehealth</p>
                <p className="text-sm text-gray-600">$15/month per clinician</p>
              </div>
              <Switch 
                checked={subscriptionData.telehealth.premium} 
                onCheckedChange={(checked) => handleToggle('telehealth', 'premium', checked)}
              />
            </div>
          </div>
        </div>

        {/* Clearinghouse Services */}
        <div className="space-y-4">
          <h4 className="font-semibold">Clearinghouse Services</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real Time Eligibility Requests</p>
                <p className="text-sm text-gray-600">$0.14 each</p>
              </div>
              <Switch 
                checked={subscriptionData.clearinghouseServices.realTimeEligibility} 
                onCheckedChange={(checked) => handleToggle('clearinghouseServices', 'realTimeEligibility', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Electronic Claims</p>
                <p className="text-sm text-gray-600">$0.14 each</p>
              </div>
              <Switch 
                checked={subscriptionData.clearinghouseServices.electronicClaims} 
                onCheckedChange={(checked) => handleToggle('clearinghouseServices', 'electronicClaims', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Remittance Advice (ERAs)</p>
                <p className="text-sm text-gray-600">$0.14 per claim</p>
              </div>
              <Switch 
                checked={subscriptionData.clearinghouseServices.remittanceAdvice} 
                onCheckedChange={(checked) => handleToggle('clearinghouseServices', 'remittanceAdvice', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mailed Paper Claims</p>
                <p className="text-sm text-gray-600">$1.00 each</p>
              </div>
              <Switch 
                checked={subscriptionData.clearinghouseServices.mailedPaperClaims} 
                onCheckedChange={(checked) => handleToggle('clearinghouseServices', 'mailedPaperClaims', checked)}
              />
            </div>
          </div>
        </div>

        {/* Appointment Reminders */}
        <div className="space-y-4">
          <h4 className="font-semibold">Appointment Reminders</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Text/Phone Reminders</p>
                <p className="text-sm text-gray-600">$0.14 each</p>
              </div>
              <Switch 
                checked={subscriptionData.appointmentReminders.textPhone} 
                onCheckedChange={(checked) => handleToggle('appointmentReminders', 'textPhone', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Reminders</p>
                <p className="text-sm text-gray-600">Free</p>
              </div>
              <Switch 
                checked={subscriptionData.appointmentReminders.email} 
                onCheckedChange={(checked) => handleToggle('appointmentReminders', 'email', checked)}
              />
            </div>
          </div>
        </div>

        {/* ePrescribe */}
        <div className="space-y-4">
          <h4 className="font-semibold">TherapyNotes ePrescribe</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Each Prescriber</p>
              <p className="text-sm text-gray-600">$65/month</p>
            </div>
            <Switch 
              checked={subscriptionData.ePrescribe} 
              onCheckedChange={(checked) => setSubscriptionData(prev => ({ ...prev, ePrescribe: checked }))}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Update Subscription</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PatientRecordsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    accountNumbers: false,
    socialSecurityNumbers: false
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Patient Records</span>
        </CardTitle>
        <CardDescription>
          Enable or disable optional features for patient records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account Numbers</p>
              <p className="text-sm text-gray-600">Practice-assigned internal account numbers for patients (usually not recommended)</p>
            </div>
            <Switch 
              checked={settings.accountNumbers} 
              onCheckedChange={(checked) => handleToggle('accountNumbers', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Social Security Numbers</p>
              <p className="text-sm text-gray-600">Ask for social security numbers for each patient (usually not recommended)</p>
            </div>
            <Switch 
              checked={settings.socialSecurityNumbers} 
              onCheckedChange={(checked) => handleToggle('socialSecurityNumbers', checked)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SecuritySection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security</span>
        </CardTitle>
        <CardDescription>
          Configure security features for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Security settings will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

const ToDoListSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckSquare className="h-5 w-5" />
          <span>To-Do List</span>
        </CardTitle>
        <CardDescription>
          Enable or disable to-do list reminders or change the timing of certain reminders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">To-do list settings will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

const PracticeLogoSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Practice Logo</span>
        </CardTitle>
        <CardDescription>
          Upload a practice logo to be used on printed documents and on your patient portal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Logo upload functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

const ActivityLogSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Activity Log</span>
        </CardTitle>
        <CardDescription>
          Search a log of user activity to see what each user has accessed or changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Activity log functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

const ChangePasswordSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Change Your Password</span>
        </CardTitle>
        <CardDescription>
          Stay secure and update your password at any time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Password change functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

const EPrescribeSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Pill className="h-5 w-5" />
          <span>ePrescribe</span>
        </CardTitle>
        <CardDescription>
          Configure TherapyNotes ePrescribe for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">ePrescribe configuration will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

const AccountAccessTab: React.FC = () => {
  const sections: SettingSection[] = [
    {
      id: 'practice-information',
      title: 'Practice Information',
      description: 'Change your practice\'s name, contact information, and login settings.',
      icon: Building2,
      component: PracticeInformationSection
    },
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Change payment options, update your billing information, and add or remove services from your bill.',
      icon: CreditCard,
      component: SubscriptionSection
    },
    {
      id: 'patient-records',
      title: 'Patient Records',
      description: 'Enable or disable optional features for patient records.',
      icon: Users,
      component: PatientRecordsSection
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Configure security features for your practice.',
      icon: Shield,
      component: SecuritySection
    },
    {
      id: 'todo-list',
      title: 'To-Do List',
      description: 'Enable or disable to-do list reminders or change the timing of certain reminders.',
      icon: CheckSquare,
      component: ToDoListSection
    },
    {
      id: 'practice-logo',
      title: 'Practice Logo',
      description: 'Upload a practice logo to be used on printed documents and on your patient portal.',
      icon: Upload,
      component: PracticeLogoSection
    },
    {
      id: 'activity-log',
      title: 'Activity Log',
      description: 'Search a log of user activity to see what each user has accessed or changed.',
      icon: Activity,
      component: ActivityLogSection
    },
    {
      id: 'change-password',
      title: 'Change Your Password',
      description: 'Stay secure and update your password at any time.',
      icon: Key,
      component: ChangePasswordSection
    },
    {
      id: 'eprescribe',
      title: 'ePrescribe',
      description: 'Configure TherapyNotes ePrescribe for your practice.',
      icon: Pill,
      component: EPrescribeSection
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const SectionComponent = section.component;
        return <SectionComponent key={section.id} />;
      })}
    </div>
  );
};

export default AccountAccessTab;
