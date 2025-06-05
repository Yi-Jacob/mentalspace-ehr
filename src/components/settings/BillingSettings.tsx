
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, 
  User, 
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    practiceBilling: {
      npiNumber: '',
      taxId: '',
      billingAddress: '',
      contactPerson: '',
      billingEmail: '',
      billingPhone: '',
      defaultPlaceOfService: '11',
      electronicSubmission: true,
      batchClaims: true,
      clearinghouse: 'availity',
    },
    patientBilling: {
      allowOnlinePayments: true,
      automaticStatements: true,
      statementFrequency: 'monthly',
      lateFees: false,
      lateFeeAmount: 0,
      lateFeeAfterDays: 30,
      paymentPlans: true,
      minimumPayment: 25,
      reminderEmails: true,
      reminderFrequency: 'weekly',
    },
    paymentProcessing: {
      enabled: false,
      processor: 'stripe',
      acceptCards: true,
      acceptACH: true,
      acceptFSA: true,
      acceptHSA: true,
      processingFee: 2.9,
      passFeesToPatient: false,
      minimumPayment: 1,
    }
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Billing settings have been updated successfully.',
    });
  };

  const handleSetupPaymentProcessing = () => {
    toast({
      title: 'Payment Processing Setup',
      description: 'Payment processing setup would be implemented here.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Practice Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Practice Billing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="npiNumber">NPI Number</Label>
              <Input
                id="npiNumber"
                value={settings.practiceBilling.npiNumber}
                onChange={(e) => setSettings({
                  ...settings,
                  practiceBilling: {...settings.practiceBilling, npiNumber: e.target.value}
                })}
                placeholder="1234567890"
              />
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID (EIN)</Label>
              <Input
                id="taxId"
                value={settings.practiceBilling.taxId}
                onChange={(e) => setSettings({
                  ...settings,
                  practiceBilling: {...settings.practiceBilling, taxId: e.target.value}
                })}
                placeholder="12-3456789"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Textarea
              id="billingAddress"
              value={settings.practiceBilling.billingAddress}
              onChange={(e) => setSettings({
                ...settings,
                practiceBilling: {...settings.practiceBilling, billingAddress: e.target.value}
              })}
              placeholder="Enter billing address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Billing Contact Person</Label>
              <Input
                id="contactPerson"
                value={settings.practiceBilling.contactPerson}
                onChange={(e) => setSettings({
                  ...settings,
                  practiceBilling: {...settings.practiceBilling, contactPerson: e.target.value}
                })}
                placeholder="Billing Manager Name"
              />
            </div>
            <div>
              <Label htmlFor="billingEmail">Billing Email</Label>
              <Input
                id="billingEmail"
                type="email"
                value={settings.practiceBilling.billingEmail}
                onChange={(e) => setSettings({
                  ...settings,
                  practiceBilling: {...settings.practiceBilling, billingEmail: e.target.value}
                })}
                placeholder="billing@chctherapy.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="defaultPlaceOfService">Default Place of Service</Label>
            <Select value={settings.practiceBilling.defaultPlaceOfService} onValueChange={(value) => setSettings({
              ...settings,
              practiceBilling: {...settings.practiceBilling, defaultPlaceOfService: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11">Office</SelectItem>
                <SelectItem value="02">Telehealth</SelectItem>
                <SelectItem value="12">Home</SelectItem>
                <SelectItem value="22">Outpatient Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="electronicSubmission">Electronic claim submission</Label>
            <Switch
              id="electronicSubmission"
              checked={settings.practiceBilling.electronicSubmission}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                practiceBilling: {...settings.practiceBilling, electronicSubmission: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="clearinghouse">Clearinghouse</Label>
            <Select value={settings.practiceBilling.clearinghouse} onValueChange={(value) => setSettings({
              ...settings,
              practiceBilling: {...settings.practiceBilling, clearinghouse: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="availity">Availity</SelectItem>
                <SelectItem value="change_healthcare">Change Healthcare</SelectItem>
                <SelectItem value="waystar">Waystar</SelectItem>
                <SelectItem value="direct">Direct to Payer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patient Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Patient Billing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="allowOnlinePayments">Allow online payments</Label>
            <Switch
              id="allowOnlinePayments"
              checked={settings.patientBilling.allowOnlinePayments}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, allowOnlinePayments: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="automaticStatements">Automatic statement generation</Label>
            <Switch
              id="automaticStatements"
              checked={settings.patientBilling.automaticStatements}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, automaticStatements: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="statementFrequency">Statement frequency</Label>
            <Select value={settings.patientBilling.statementFrequency} onValueChange={(value) => setSettings({
              ...settings,
              patientBilling: {...settings.patientBilling, statementFrequency: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="lateFees">Enable late fees</Label>
            <Switch
              id="lateFees"
              checked={settings.patientBilling.lateFees}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, lateFees: checked}
              })}
            />
          </div>

          {settings.patientBilling.lateFees && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lateFeeAmount">Late fee amount ($)</Label>
                <Input
                  id="lateFeeAmount"
                  type="number"
                  value={settings.patientBilling.lateFeeAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    patientBilling: {...settings.patientBilling, lateFeeAmount: parseFloat(e.target.value)}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="lateFeeAfterDays">Apply after (days)</Label>
                <Input
                  id="lateFeeAfterDays"
                  type="number"
                  value={settings.patientBilling.lateFeeAfterDays}
                  onChange={(e) => setSettings({
                    ...settings,
                    patientBilling: {...settings.patientBilling, lateFeeAfterDays: parseInt(e.target.value)}
                  })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="paymentPlans">Allow payment plans</Label>
            <Switch
              id="paymentPlans"
              checked={settings.patientBilling.paymentPlans}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, paymentPlans: checked}
              })}
            />
          </div>

          {settings.patientBilling.paymentPlans && (
            <div>
              <Label htmlFor="minimumPayment">Minimum payment amount ($)</Label>
              <Input
                id="minimumPayment"
                type="number"
                value={settings.patientBilling.minimumPayment}
                onChange={(e) => setSettings({
                  ...settings,
                  patientBilling: {...settings.patientBilling, minimumPayment: parseFloat(e.target.value)}
                })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Processing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="paymentProcessingEnabled">Enable payment processing</Label>
            <Switch
              id="paymentProcessingEnabled"
              checked={settings.paymentProcessing.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                paymentProcessing: {...settings.paymentProcessing, enabled: checked}
              })}
            />
          </div>

          {!settings.paymentProcessing.enabled && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Accept credit, debit, FSA and HSA cards without leaving MentalSpace.
              </p>
              <Button onClick={handleSetupPaymentProcessing} variant="outline">
                Setup Payment Processing
              </Button>
            </div>
          )}

          {settings.paymentProcessing.enabled && (
            <>
              <div>
                <Label htmlFor="processor">Payment processor</Label>
                <Select value={settings.paymentProcessing.processor} onValueChange={(value) => setSettings({
                  ...settings,
                  paymentProcessing: {...settings.paymentProcessing, processor: value}
                })}>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="acceptCards">Credit/Debit Cards</Label>
                  <Switch
                    id="acceptCards"
                    checked={settings.paymentProcessing.acceptCards}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      paymentProcessing: {...settings.paymentProcessing, acceptCards: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="acceptACH">ACH/Bank Transfer</Label>
                  <Switch
                    id="acceptACH"
                    checked={settings.paymentProcessing.acceptACH}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      paymentProcessing: {...settings.paymentProcessing, acceptACH: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="acceptFSA">FSA Cards</Label>
                  <Switch
                    id="acceptFSA"
                    checked={settings.paymentProcessing.acceptFSA}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      paymentProcessing: {...settings.paymentProcessing, acceptFSA: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="acceptHSA">HSA Cards</Label>
                  <Switch
                    id="acceptHSA"
                    checked={settings.paymentProcessing.acceptHSA}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      paymentProcessing: {...settings.paymentProcessing, acceptHSA: checked}
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="processingFee">Processing fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={settings.paymentProcessing.processingFee}
                  onChange={(e) => setSettings({
                    ...settings,
                    paymentProcessing: {...settings.paymentProcessing, processingFee: parseFloat(e.target.value)}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="passFeesToPatient">Pass processing fees to patient</Label>
                <Switch
                  id="passFeesToPatient"
                  checked={settings.paymentProcessing.passFeesToPatient}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    paymentProcessing: {...settings.paymentProcessing, passFeesToPatient: checked}
                  })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default BillingSettings;
