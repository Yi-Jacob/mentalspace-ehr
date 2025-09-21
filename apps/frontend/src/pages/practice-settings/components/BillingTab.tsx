import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';

const PracticeBillingSection: React.FC = () => {
  const [settings, setSettings] = useState({
    billingMethod: 'insurance_first', // 'insurance_first', 'self_pay_first', 'hybrid'
    defaultPaymentTerms: 30,
    lateFeeEnabled: false,
    lateFeeAmount: 0,
    lateFeePercentage: 0,
    gracePeriod: 0,
    autoStatementGeneration: true,
    statementFrequency: 'monthly', // 'weekly', 'monthly', 'quarterly'
    statementDeliveryMethod: 'email', // 'email', 'mail', 'both'
    billingAddress: {
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    },
    taxSettings: {
      taxEnabled: false,
      taxRate: 0,
      taxDescription: 'Sales Tax'
    },
    writeOffSettings: {
      autoWriteOffEnabled: false,
      writeOffThreshold: 0,
      writeOffDays: 90
    }
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  const handleTaxSettingsChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        [field]: value
      }
    }));
  };

  const handleWriteOffSettingsChange = (field: string, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      writeOffSettings: {
        ...prev.writeOffSettings,
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Practice Billing</span>
        </CardTitle>
        <CardDescription>
          Configure your practice-wide billing features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing Method */}
        <div className="space-y-4">
          <h4 className="font-medium">Billing Method</h4>
          <div className="space-y-2">
            <Label htmlFor="billingMethod">Default Billing Approach</Label>
            <Select value={settings.billingMethod} onValueChange={(value) => handleSelectChange('billingMethod', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insurance_first">Insurance First</SelectItem>
                <SelectItem value="self_pay_first">Self-Pay First</SelectItem>
                <SelectItem value="hybrid">Hybrid Approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="space-y-4">
          <h4 className="font-medium">Payment Terms</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPaymentTerms">Default Payment Terms (days)</Label>
              <Input
                id="defaultPaymentTerms"
                type="number"
                value={settings.defaultPaymentTerms}
                onChange={(e) => handleNumberChange('defaultPaymentTerms', parseInt(e.target.value) || 0)}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gracePeriod">Grace Period (days)</Label>
              <Input
                id="gracePeriod"
                type="number"
                value={settings.gracePeriod}
                onChange={(e) => handleNumberChange('gracePeriod', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Late Fees */}
        <div className="space-y-4">
          <h4 className="font-medium">Late Fee Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Late Fees</p>
                <p className="text-sm text-gray-600">Charge late fees for overdue accounts</p>
              </div>
              <Switch 
                checked={settings.lateFeeEnabled} 
                onCheckedChange={(checked) => handleToggle('lateFeeEnabled', checked)}
              />
            </div>

            {settings.lateFeeEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lateFeeAmount">Late Fee Amount ($)</Label>
                  <Input
                    id="lateFeeAmount"
                    type="number"
                    step="0.01"
                    value={settings.lateFeeAmount}
                    onChange={(e) => handleNumberChange('lateFeeAmount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFeePercentage">Late Fee Percentage (%)</Label>
                  <Input
                    id="lateFeePercentage"
                    type="number"
                    step="0.01"
                    value={settings.lateFeePercentage}
                    onChange={(e) => handleNumberChange('lateFeePercentage', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statement Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Statement Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Statement Generation</p>
                <p className="text-sm text-gray-600">Automatically generate statements</p>
              </div>
              <Switch 
                checked={settings.autoStatementGeneration} 
                onCheckedChange={(checked) => handleToggle('autoStatementGeneration', checked)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statementFrequency">Statement Frequency</Label>
                <Select value={settings.statementFrequency} onValueChange={(value) => handleSelectChange('statementFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statementDeliveryMethod">Delivery Method</Label>
                <Select value={settings.statementDeliveryMethod} onValueChange={(value) => handleSelectChange('statementDeliveryMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="mail">Mail Only</SelectItem>
                    <SelectItem value="both">Both Email and Mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h4 className="font-medium">Billing Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingName">Billing Name</Label>
              <Input
                id="billingName"
                value={settings.billingAddress.name}
                onChange={(e) => handleBillingAddressChange('name', e.target.value)}
                placeholder="Practice Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingPhone">Phone Number</Label>
              <Input
                id="billingPhone"
                value={settings.billingAddress.phone}
                onChange={(e) => handleBillingAddressChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress1">Address Line 1</Label>
              <Input
                id="billingAddress1"
                value={settings.billingAddress.address1}
                onChange={(e) => handleBillingAddressChange('address1', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingAddress2">Address Line 2</Label>
              <Input
                id="billingAddress2"
                value={settings.billingAddress.address2}
                onChange={(e) => handleBillingAddressChange('address2', e.target.value)}
                placeholder="Suite 100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                value={settings.billingAddress.city}
                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingState">State</Label>
              <Input
                id="billingState"
                value={settings.billingAddress.state}
                onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingZip">ZIP Code</Label>
              <Input
                id="billingZip"
                value={settings.billingAddress.zip}
                onChange={(e) => handleBillingAddressChange('zip', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Tax Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Tax</p>
                <p className="text-sm text-gray-600">Apply tax to patient bills</p>
              </div>
              <Switch 
                checked={settings.taxSettings.taxEnabled} 
                onCheckedChange={(checked) => handleTaxSettingsChange('taxEnabled', checked)}
              />
            </div>

            {settings.taxSettings.taxEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.taxSettings.taxRate}
                    onChange={(e) => handleTaxSettingsChange('taxRate', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxDescription">Tax Description</Label>
                  <Input
                    id="taxDescription"
                    value={settings.taxSettings.taxDescription}
                    onChange={(e) => handleTaxSettingsChange('taxDescription', e.target.value)}
                    placeholder="Sales Tax"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Write-off Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Write-off Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Write-off</p>
                <p className="text-sm text-gray-600">Automatically write off small balances</p>
              </div>
              <Switch 
                checked={settings.writeOffSettings.autoWriteOffEnabled} 
                onCheckedChange={(checked) => handleWriteOffSettingsChange('autoWriteOffEnabled', checked)}
              />
            </div>

            {settings.writeOffSettings.autoWriteOffEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="writeOffThreshold">Write-off Threshold ($)</Label>
                  <Input
                    id="writeOffThreshold"
                    type="number"
                    step="0.01"
                    value={settings.writeOffSettings.writeOffThreshold}
                    onChange={(e) => handleWriteOffSettingsChange('writeOffThreshold', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="writeOffDays">Write-off After (days)</Label>
                  <Input
                    id="writeOffDays"
                    type="number"
                    value={settings.writeOffSettings.writeOffDays}
                    onChange={(e) => handleWriteOffSettingsChange('writeOffDays', parseInt(e.target.value) || 0)}
                    placeholder="90"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PatientBillingSection: React.FC = () => {
  const [settings, setSettings] = useState({
    copayCollection: {
      enabled: true,
      collectAtAppointment: true,
      allowPartialPayment: true
    },
    paymentPlans: {
      enabled: true,
      defaultPlanDuration: 3, // months
      minimumPaymentAmount: 25,
      allowCustomPlans: true
    },
    financialAssistance: {
      enabled: true,
      requireDocumentation: true,
      approvalWorkflow: 'manual' // 'manual', 'automatic'
    },
    billingPreferences: {
      sendStatements: true,
      includeInsuranceInfo: true,
      includePaymentHistory: true,
      allowOnlinePayments: true
    },
    collectionSettings: {
      autoReminders: true,
      reminderFrequency: 'weekly', // 'daily', 'weekly', 'monthly'
      maxReminders: 3,
      escalationEnabled: false
    }
  });

  const handleToggle = (section: string, field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNumberChange = (section: string, field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSelectChange = (section: string, field: string, value: string) => {
    setSettings(prev => ({
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
          <Users className="h-5 w-5" />
          <span>Patient Billing</span>
        </CardTitle>
        <CardDescription>
          Configure patient billing settings for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Copay Collection */}
        <div className="space-y-4">
          <h4 className="font-medium">Copay Collection</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Copay Collection</p>
                <p className="text-sm text-gray-600">Collect copays from patients</p>
              </div>
              <Switch 
                checked={settings.copayCollection.enabled} 
                onCheckedChange={(checked) => handleToggle('copayCollection', 'enabled', checked)}
              />
            </div>

            {settings.copayCollection.enabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collect at Appointment</p>
                    <p className="text-sm text-gray-600">Collect copay when patient arrives</p>
                  </div>
                  <Switch 
                    checked={settings.copayCollection.collectAtAppointment} 
                    onCheckedChange={(checked) => handleToggle('copayCollection', 'collectAtAppointment', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Partial Payment</p>
                    <p className="text-sm text-gray-600">Accept partial copay payments</p>
                  </div>
                  <Switch 
                    checked={settings.copayCollection.allowPartialPayment} 
                    onCheckedChange={(checked) => handleToggle('copayCollection', 'allowPartialPayment', checked)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Plans */}
        <div className="space-y-4">
          <h4 className="font-medium">Payment Plans</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Payment Plans</p>
                <p className="text-sm text-gray-600">Allow patients to pay in installments</p>
              </div>
              <Switch 
                checked={settings.paymentPlans.enabled} 
                onCheckedChange={(checked) => handleToggle('paymentPlans', 'enabled', checked)}
              />
            </div>

            {settings.paymentPlans.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultPlanDuration">Default Duration (months)</Label>
                  <Input
                    id="defaultPlanDuration"
                    type="number"
                    value={settings.paymentPlans.defaultPlanDuration}
                    onChange={(e) => handleNumberChange('paymentPlans', 'defaultPlanDuration', parseInt(e.target.value) || 0)}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPaymentAmount">Minimum Payment ($)</Label>
                  <Input
                    id="minimumPaymentAmount"
                    type="number"
                    step="0.01"
                    value={settings.paymentPlans.minimumPaymentAmount}
                    onChange={(e) => handleNumberChange('paymentPlans', 'minimumPaymentAmount', parseFloat(e.target.value) || 0)}
                    placeholder="25.00"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Custom Plans</p>
                    <p className="text-sm text-gray-600">Create custom payment plans</p>
                  </div>
                  <Switch 
                    checked={settings.paymentPlans.allowCustomPlans} 
                    onCheckedChange={(checked) => handleToggle('paymentPlans', 'allowCustomPlans', checked)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Assistance */}
        <div className="space-y-4">
          <h4 className="font-medium">Financial Assistance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Financial Assistance</p>
                <p className="text-sm text-gray-600">Offer financial assistance programs</p>
              </div>
              <Switch 
                checked={settings.financialAssistance.enabled} 
                onCheckedChange={(checked) => handleToggle('financialAssistance', 'enabled', checked)}
              />
            </div>

            {settings.financialAssistance.enabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Documentation</p>
                    <p className="text-sm text-gray-600">Require proof of financial need</p>
                  </div>
                  <Switch 
                    checked={settings.financialAssistance.requireDocumentation} 
                    onCheckedChange={(checked) => handleToggle('financialAssistance', 'requireDocumentation', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvalWorkflow">Approval Workflow</Label>
                  <Select value={settings.financialAssistance.approvalWorkflow} onValueChange={(value) => handleSelectChange('financialAssistance', 'approvalWorkflow', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Review</SelectItem>
                      <SelectItem value="automatic">Automatic Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billing Preferences */}
        <div className="space-y-4">
          <h4 className="font-medium">Billing Preferences</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Send Statements</p>
                <p className="text-sm text-gray-600">Automatically send billing statements</p>
              </div>
              <Switch 
                checked={settings.billingPreferences.sendStatements} 
                onCheckedChange={(checked) => handleToggle('billingPreferences', 'sendStatements', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Include Insurance Information</p>
                <p className="text-sm text-gray-600">Show insurance details on statements</p>
              </div>
              <Switch 
                checked={settings.billingPreferences.includeInsuranceInfo} 
                onCheckedChange={(checked) => handleToggle('billingPreferences', 'includeInsuranceInfo', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Include Payment History</p>
                <p className="text-sm text-gray-600">Show payment history on statements</p>
              </div>
              <Switch 
                checked={settings.billingPreferences.includePaymentHistory} 
                onCheckedChange={(checked) => handleToggle('billingPreferences', 'includePaymentHistory', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Online Payments</p>
                <p className="text-sm text-gray-600">Enable online payment processing</p>
              </div>
              <Switch 
                checked={settings.billingPreferences.allowOnlinePayments} 
                onCheckedChange={(checked) => handleToggle('billingPreferences', 'allowOnlinePayments', checked)}
              />
            </div>
          </div>
        </div>

        {/* Collection Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Collection Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Reminders</p>
                <p className="text-sm text-gray-600">Send automatic payment reminders</p>
              </div>
              <Switch 
                checked={settings.collectionSettings.autoReminders} 
                onCheckedChange={(checked) => handleToggle('collectionSettings', 'autoReminders', checked)}
              />
            </div>

            {settings.collectionSettings.autoReminders && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                  <Select value={settings.collectionSettings.reminderFrequency} onValueChange={(value) => handleSelectChange('collectionSettings', 'reminderFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxReminders">Max Reminders</Label>
                  <Input
                    id="maxReminders"
                    type="number"
                    value={settings.collectionSettings.maxReminders}
                    onChange={(e) => handleNumberChange('collectionSettings', 'maxReminders', parseInt(e.target.value) || 0)}
                    placeholder="3"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Escalation Enabled</p>
                <p className="text-sm text-gray-600">Escalate to collections after max reminders</p>
              </div>
              <Switch 
                checked={settings.collectionSettings.escalationEnabled} 
                onCheckedChange={(checked) => handleToggle('collectionSettings', 'escalationEnabled', checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentProcessingSection: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    provider: 'stripe', // 'stripe', 'square', 'paypal'
    acceptedMethods: {
      creditCards: true,
      debitCards: true,
      fsaCards: true,
      hsaCards: true,
      ach: false
    },
    processingFees: {
      creditCardFee: 2.9,
      achFee: 0.8,
      flatFee: 0.30
    },
    securitySettings: {
      pciCompliant: true,
      tokenization: true,
      encryption: true
    },
    integrationSettings: {
      autoProcessPayments: true,
      allowRecurringPayments: true,
      allowPartialPayments: true,
      requireCvv: true
    }
  });

  const handleToggle = (section: string, field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNumberChange = (section: string, field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Processing</span>
        </CardTitle>
        <CardDescription>
          Accept credit, debit, FSA and HSA cards without leaving TherapyNotes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-4">
          <h4 className="font-medium">Payment Provider</h4>
          <div className="space-y-2">
            <Label htmlFor="provider">Select Payment Provider</Label>
            <Select value={settings.provider} onValueChange={(value) => handleSelectChange('provider', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <div className="space-y-4">
          <h4 className="font-medium">Accepted Payment Methods</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Credit Cards</p>
                <p className="text-sm text-gray-600">Visa, MasterCard, American Express, Discover</p>
              </div>
              <Switch 
                checked={settings.acceptedMethods.creditCards} 
                onCheckedChange={(checked) => handleToggle('acceptedMethods', 'creditCards', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Debit Cards</p>
                <p className="text-sm text-gray-600">Bank debit cards</p>
              </div>
              <Switch 
                checked={settings.acceptedMethods.debitCards} 
                onCheckedChange={(checked) => handleToggle('acceptedMethods', 'debitCards', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">FSA Cards</p>
                <p className="text-sm text-gray-600">Flexible Spending Account cards</p>
              </div>
              <Switch 
                checked={settings.acceptedMethods.fsaCards} 
                onCheckedChange={(checked) => handleToggle('acceptedMethods', 'fsaCards', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">HSA Cards</p>
                <p className="text-sm text-gray-600">Health Savings Account cards</p>
              </div>
              <Switch 
                checked={settings.acceptedMethods.hsaCards} 
                onCheckedChange={(checked) => handleToggle('acceptedMethods', 'hsaCards', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">ACH/Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct bank account transfers</p>
              </div>
              <Switch 
                checked={settings.acceptedMethods.ach} 
                onCheckedChange={(checked) => handleToggle('acceptedMethods', 'ach', checked)}
              />
            </div>
          </div>
        </div>

        {/* Processing Fees */}
        <div className="space-y-4">
          <h4 className="font-medium">Processing Fees</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creditCardFee">Credit Card Fee (%)</Label>
              <Input
                id="creditCardFee"
                type="number"
                step="0.01"
                value={settings.processingFees.creditCardFee}
                onChange={(e) => handleNumberChange('processingFees', 'creditCardFee', parseFloat(e.target.value) || 0)}
                placeholder="2.90"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achFee">ACH Fee (%)</Label>
              <Input
                id="achFee"
                type="number"
                step="0.01"
                value={settings.processingFees.achFee}
                onChange={(e) => handleNumberChange('processingFees', 'achFee', parseFloat(e.target.value) || 0)}
                placeholder="0.80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flatFee">Flat Fee ($)</Label>
              <Input
                id="flatFee"
                type="number"
                step="0.01"
                value={settings.processingFees.flatFee}
                onChange={(e) => handleNumberChange('processingFees', 'flatFee', parseFloat(e.target.value) || 0)}
                placeholder="0.30"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Security Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">PCI Compliant</p>
                <p className="text-sm text-gray-600">Payment Card Industry compliance</p>
              </div>
              <Switch 
                checked={settings.securitySettings.pciCompliant} 
                onCheckedChange={(checked) => handleToggle('securitySettings', 'pciCompliant', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tokenization</p>
                <p className="text-sm text-gray-600">Secure token-based payments</p>
              </div>
              <Switch 
                checked={settings.securitySettings.tokenization} 
                onCheckedChange={(checked) => handleToggle('securitySettings', 'tokenization', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">End-to-End Encryption</p>
                <p className="text-sm text-gray-600">Encrypt all payment data</p>
              </div>
              <Switch 
                checked={settings.securitySettings.encryption} 
                onCheckedChange={(checked) => handleToggle('securitySettings', 'encryption', checked)}
              />
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Integration Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Process Payments</p>
                <p className="text-sm text-gray-600">Automatically process payments</p>
              </div>
              <Switch 
                checked={settings.integrationSettings.autoProcessPayments} 
                onCheckedChange={(checked) => handleToggle('integrationSettings', 'autoProcessPayments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Recurring Payments</p>
                <p className="text-sm text-gray-600">Set up recurring payment plans</p>
              </div>
              <Switch 
                checked={settings.integrationSettings.allowRecurringPayments} 
                onCheckedChange={(checked) => handleToggle('integrationSettings', 'allowRecurringPayments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Partial Payments</p>
                <p className="text-sm text-gray-600">Accept partial payment amounts</p>
              </div>
              <Switch 
                checked={settings.integrationSettings.allowPartialPayments} 
                onCheckedChange={(checked) => handleToggle('integrationSettings', 'allowPartialPayments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require CVV</p>
                <p className="text-sm text-gray-600">Require CVV for card transactions</p>
              </div>
              <Switch 
                checked={settings.integrationSettings.requireCvv} 
                onCheckedChange={(checked) => handleToggle('integrationSettings', 'requireCvv', checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BillingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <PracticeBillingSection />
      <PatientBillingSection />
      <PaymentProcessingSection />
    </div>
  );
};

export default BillingTab;
