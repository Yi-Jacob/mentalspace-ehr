import React, { useState } from 'react';
import { 
  Globe, 
  Video, 
  MessageSquare, 
  Bell, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';

const ClientPortalSection: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    customDomain: '',
    portalName: '',
    welcomeMessage: '',
    allowAppointmentScheduling: true,
    allowMessageSending: true,
    allowDocumentUpload: true,
    allowPaymentProcessing: false
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Client Portal</span>
        </CardTitle>
        <CardDescription>
          Configure your custom client portal on TherapyPortal.com.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Client Portal</p>
            <p className="text-sm text-gray-600">Allow clients to access their portal</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customDomain">Custom Domain</Label>
              <Input
                id="customDomain"
                value={settings.customDomain}
                onChange={(e) => handleInputChange('customDomain', e.target.value)}
                placeholder="yourpractice.therapyportal.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portalName">Portal Name</Label>
              <Input
                id="portalName"
                value={settings.portalName}
                onChange={(e) => handleInputChange('portalName', e.target.value)}
                placeholder="Your Practice Portal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                placeholder="Welcome to your patient portal..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Portal Features</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Allow Appointment Scheduling</span>
                  <Switch 
                    checked={settings.allowAppointmentScheduling} 
                    onCheckedChange={(checked) => handleToggle('allowAppointmentScheduling', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Allow Message Sending</span>
                  <Switch 
                    checked={settings.allowMessageSending} 
                    onCheckedChange={(checked) => handleToggle('allowMessageSending', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Allow Document Upload</span>
                  <Switch 
                    checked={settings.allowDocumentUpload} 
                    onCheckedChange={(checked) => handleToggle('allowDocumentUpload', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Allow Payment Processing</span>
                  <Switch 
                    checked={settings.allowPaymentProcessing} 
                    onCheckedChange={(checked) => handleToggle('allowPaymentProcessing', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TelehealthSection: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    premiumFeatures: false,
    waitingRoomEnabled: true,
    recordingEnabled: false,
    maxParticipants: 2,
    defaultDuration: 60
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Video className="h-5 w-5" />
          <span>Telehealth</span>
        </CardTitle>
        <CardDescription>
          Enable TherapyNotes Telehealth for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Telehealth</p>
            <p className="text-sm text-gray-600">Allow video sessions with clients</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Premium Features</p>
                <p className="text-sm text-gray-600">Advanced telehealth features ($15/month per clinician)</p>
              </div>
              <Switch 
                checked={settings.premiumFeatures} 
                onCheckedChange={(checked) => handleToggle('premiumFeatures', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Waiting Room</p>
                <p className="text-sm text-gray-600">Enable waiting room for sessions</p>
              </div>
              <Switch 
                checked={settings.waitingRoomEnabled} 
                onCheckedChange={(checked) => handleToggle('waitingRoomEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Recording</p>
                <p className="text-sm text-gray-600">Allow recording of telehealth sessions</p>
              </div>
              <Switch 
                checked={settings.recordingEnabled} 
                onCheckedChange={(checked) => handleToggle('recordingEnabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Select value={settings.maxParticipants.toString()} onValueChange={(value) => handleNumberChange('maxParticipants', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultDuration">Default Duration (minutes)</Label>
                <Select value={settings.defaultDuration.toString()} onValueChange={(value) => handleNumberChange('defaultDuration', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="45">45</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="90">90</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SecureMessagingSection: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    allowClientInitiated: true,
    autoResponseEnabled: false,
    autoResponseMessage: '',
    businessHoursOnly: true,
    businessHoursStart: '09:00',
    businessHoursEnd: '17:00'
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Secure Messaging</span>
        </CardTitle>
        <CardDescription>
          Enable and configure secure messaging for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Secure Messaging</p>
            <p className="text-sm text-gray-600">Allow secure communication with clients</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Client-Initiated Messages</p>
                <p className="text-sm text-gray-600">Clients can start new conversations</p>
              </div>
              <Switch 
                checked={settings.allowClientInitiated} 
                onCheckedChange={(checked) => handleToggle('allowClientInitiated', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Business Hours Only</p>
                <p className="text-sm text-gray-600">Restrict messaging to business hours</p>
              </div>
              <Switch 
                checked={settings.businessHoursOnly} 
                onCheckedChange={(checked) => handleToggle('businessHoursOnly', checked)}
              />
            </div>

            {settings.businessHoursOnly && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessHoursStart">Start Time</Label>
                  <Input
                    id="businessHoursStart"
                    type="time"
                    value={settings.businessHoursStart}
                    onChange={(e) => handleInputChange('businessHoursStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessHoursEnd">End Time</Label>
                  <Input
                    id="businessHoursEnd"
                    type="time"
                    value={settings.businessHoursEnd}
                    onChange={(e) => handleInputChange('businessHoursEnd', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Response</p>
                <p className="text-sm text-gray-600">Send automatic responses to new messages</p>
              </div>
              <Switch 
                checked={settings.autoResponseEnabled} 
                onCheckedChange={(checked) => handleToggle('autoResponseEnabled', checked)}
              />
            </div>

            {settings.autoResponseEnabled && (
              <div className="space-y-2">
                <Label htmlFor="autoResponseMessage">Auto-Response Message</Label>
                <Textarea
                  id="autoResponseMessage"
                  value={settings.autoResponseMessage}
                  onChange={(e) => handleInputChange('autoResponseMessage', e.target.value)}
                  placeholder="Thank you for your message. We will respond during business hours..."
                  rows={3}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentRemindersSection: React.FC = () => {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    phoneEnabled: false,
    emailAdvanceTime: 24,
    smsAdvanceTime: 2,
    phoneAdvanceTime: 1,
    customMessage: ''
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Patient Appointment Reminders</span>
        </CardTitle>
        <CardDescription>
          Enable and configure appointment reminders to be sent to scheduled patients.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Reminders</p>
              <p className="text-sm text-gray-600">Free</p>
            </div>
            <Switch 
              checked={settings.emailEnabled} 
              onCheckedChange={(checked) => handleToggle('emailEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Reminders</p>
              <p className="text-sm text-gray-600">$0.14 each</p>
            </div>
            <Switch 
              checked={settings.smsEnabled} 
              onCheckedChange={(checked) => handleToggle('smsEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Phone Reminders</p>
              <p className="text-sm text-gray-600">$0.14 each</p>
            </div>
            <Switch 
              checked={settings.phoneEnabled} 
              onCheckedChange={(checked) => handleToggle('phoneEnabled', checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Reminder Timing</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailAdvanceTime">Email (hours before)</Label>
              <Select value={settings.emailAdvanceTime.toString()} onValueChange={(value) => handleNumberChange('emailAdvanceTime', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smsAdvanceTime">SMS (hours before)</Label>
              <Select value={settings.smsAdvanceTime.toString()} onValueChange={(value) => handleNumberChange('smsAdvanceTime', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneAdvanceTime">Phone (hours before)</Label>
              <Select value={settings.phoneAdvanceTime.toString()} onValueChange={(value) => handleNumberChange('phoneAdvanceTime', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customMessage">Custom Reminder Message</Label>
          <Textarea
            id="customMessage"
            value={settings.customMessage}
            onChange={(e) => handleInputChange('customMessage', e.target.value)}
            placeholder="This is a reminder that you have an appointment..."
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SyncCalendarsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    googleCalendarEnabled: false,
    outlookEnabled: false,
    appleCalendarEnabled: false,
    syncDirection: 'both' // 'both', 'to_external', 'from_external'
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Sync Calendars With Other Applications</span>
        </CardTitle>
        <CardDescription>
          View your calendar on your mobile device or programs like Google Calendar or Outlook.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Google Calendar</p>
              <p className="text-sm text-gray-600">Sync with Google Calendar</p>
            </div>
            <Switch 
              checked={settings.googleCalendarEnabled} 
              onCheckedChange={(checked) => handleToggle('googleCalendarEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Microsoft Outlook</p>
              <p className="text-sm text-gray-600">Sync with Outlook Calendar</p>
            </div>
            <Switch 
              checked={settings.outlookEnabled} 
              onCheckedChange={(checked) => handleToggle('outlookEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Apple Calendar</p>
              <p className="text-sm text-gray-600">Sync with Apple Calendar</p>
            </div>
            <Switch 
              checked={settings.appleCalendarEnabled} 
              onCheckedChange={(checked) => handleToggle('appleCalendarEnabled', checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="syncDirection">Sync Direction</Label>
          <Select value={settings.syncDirection} onValueChange={(value) => handleSelectChange('syncDirection', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both Ways</SelectItem>
              <SelectItem value="to_external">To External Calendar Only</SelectItem>
              <SelectItem value="from_external">From External Calendar Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MultiplePracticeLocationsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: false,
    locations: [
      { id: 1, name: 'Main Office', address: '123 Main St', phone: '(555) 123-4567', isDefault: true }
    ]
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addLocation = () => {
    const newLocation = {
      id: settings.locations.length + 1,
      name: '',
      address: '',
      phone: '',
      isDefault: false
    };
    setSettings(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
  };

  const removeLocation = (id: number) => {
    setSettings(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id)
    }));
  };

  const updateLocation = (id: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      locations: prev.locations.map(loc => 
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Multiple Practice Locations</span>
        </CardTitle>
        <CardDescription>
          Enable enhanced features for practices with multiple locations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Multiple Locations</p>
            <p className="text-sm text-gray-600">Manage multiple practice locations</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Practice Locations</h4>
              <Button onClick={addLocation} size="sm">Add Location</Button>
            </div>

            <div className="space-y-4">
              {settings.locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">Location {location.id}</h5>
                    {!location.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeLocation(location.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Location Name</Label>
                      <Input
                        value={location.name}
                        onChange={(e) => updateLocation(location.id, 'name', e.target.value)}
                        placeholder="Main Office"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={location.phone}
                        onChange={(e) => updateLocation(location.id, 'phone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input
                        value={location.address}
                        onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                        placeholder="123 Main Street, City, State 12345"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PortalSchedulingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <ClientPortalSection />
      <TelehealthSection />
      <SecureMessagingSection />
      <AppointmentRemindersSection />
      <SyncCalendarsSection />
      <MultiplePracticeLocationsSection />
    </div>
  );
};

export default PortalSchedulingTab;
