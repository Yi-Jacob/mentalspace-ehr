
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  FileText, 
  Settings as SettingsIcon,
  Building,
  Receipt,
  Calculator
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    practiceBilling: {
      npi: '',
      taxId: '',
      billingAddress: '',
      billingPhone: '',
      billingEmail: '',
      defaultPlaceOfService: '11',
      autoSubmitClaims: true,
      electronicRemittance: true,
      paperStatements: false,
      statementFrequency: 'monthly',
    },
    patientBilling: {
      collectCopaysUpfront: true,
      allowPartialPayments: true,
      lateFeeAmount: 25,
      lateFeeAfterDays: 30,
      paymentPlans: true,
      autoChargeCards: false,
      sendReminders: true,
      reminderFrequency: 'weekly',
    },
    paymentProcessing: {
      enabled: true,
      acceptCreditCards: true,
      acceptDebitCards: true,
      acceptFSAHSA: true,
      processingFeePercent: 2.9,
      processingFeeFlat: 0.30,
      merchantId: '',
      terminalId: '',
    }
  });

  const handleSave = () => {
    toast({
      title: 'Billing Settings Saved',
      description: 'Your billing configuration has been updated successfully.',
    });
  };

  const handleTestPayment = () => {
    toast({
      title: 'Payment Test',
      description: 'Payment processing test initiated. Check your merchant dashboard.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Practice Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Practice Billing Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="npi">National Provider Identifier (NPI)</Label>
              <Input
                id="npi"
                value={settings.practiceBilling.npi}
                onChange={(e) => setSettings({
                  ...settings,
                  practiceBilling: {...settings.practiceBilling, npi: e.target.value}
                })}
                placeholder="1234567890"
              />
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID / EIN</Label>
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
              placeholder="123 Main St, Suite 100, City, State 12345"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingPhone">Billing Phone</Label>
              <Input
                id="billingPhone"
                value={settings.practiceBilling.billingPhone}
                onChange={(e) => setSettings({
                  ...settings,
                  practiceBilling: {...settings.practiceBilling, billingPhone: e.target.value}
                })}
                placeholder="(555) 123-4567"
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
                placeholder="billing@practice.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="placeOfService">Default Place of Service</Label>
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
            <Label htmlFor="autoSubmit">Auto-submit claims electronically</Label>
            <Switch
              id="autoSubmit"
              checked={settings.practiceBilling.autoSubmitClaims}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                practiceBilling: {...settings.practiceBilling, autoSubmitClaims: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="electronicRemittance">Enable electronic remittance</Label>
            <Switch
              id="electronicRemittance"
              checked={settings.practiceBilling.electronicRemittance}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                practiceBilling: {...settings.practiceBilling, electronicRemittance: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Patient Billing Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="collectCopays">Collect copays upfront</Label>
            <Switch
              id="collectCopays"
              checked={settings.patientBilling.collectCopaysUpfront}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, collectCopaysUpfront: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="partialPayments">Allow partial payments</Label>
            <Switch
              id="partialPayments"
              checked={settings.patientBilling.allowPartialPayments}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, allowPartialPayments: checked}
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lateFee">Late fee amount ($)</Label>
              <Input
                id="lateFee"
                type="number"
                value={settings.patientBilling.lateFeeAmount}
                onChange={(e) => setSettings({
                  ...settings,
                  patientBilling: {...settings.patientBilling, lateFeeAmount: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="lateFeeDays">Apply late fee after (days)</Label>
              <Input
                id="lateFeeDays"
                type="number"
                value={settings.patientBilling.lateFeeAfterDays}
                onChange={(e) => setSettings({
                  ...settings,
                  patientBilling: {...settings.patientBilling, lateFeeAfterDays: parseInt(e.target.value)}
                })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="paymentPlans">Enable payment plans</Label>
            <Switch
              id="paymentPlans"
              checked={settings.patientBilling.paymentPlans}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, paymentPlans: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoCharge">Auto-charge saved cards</Label>
            <Switch
              id="autoCharge"
              checked={settings.patientBilling.autoChargeCards}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientBilling: {...settings.patientBilling, autoChargeCards: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="reminderFreq">Payment reminder frequency</Label>
            <Select value={settings.patientBilling.reminderFrequency} onValueChange={(value) => setSettings({
              ...settings,
              patientBilling: {...settings.patientBilling, reminderFrequency: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Label htmlFor="paymentEnabled">Enable payment processing</Label>
            <Switch
              id="paymentEnabled"
              checked={settings.paymentProcessing.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                paymentProcessing: {...settings.paymentProcessing, enabled: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="creditCards">Accept credit cards</Label>
            <Switch
              id="creditCards"
              checked={settings.paymentProcessing.acceptCreditCards}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                paymentProcessing: {...settings.paymentProcessing, acceptCreditCards: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="debitCards">Accept debit cards</Label>
            <Switch
              id="debitCards"
              checked={settings.paymentProcessing.acceptDebitCards}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                paymentProcessing: {...settings.paymentProcessing, acceptDebitCards: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="fsaHsa">Accept FSA/HSA cards</Label>
            <Switch
              id="fsaHsa"
              checked={settings.paymentProcessing.acceptFSAHSA}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                paymentProcessing: {...settings.paymentProcessing, acceptFSAHSA: checked}
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="feePercent">Processing fee (%)</Label>
              <Input
                id="feePercent"
                type="number"
                step="0.1"
                value={settings.paymentProcessing.processingFeePercent}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentProcessing: {...settings.paymentProcessing, processingFeePercent: parseFloat(e.target.value)}
                })}
              />
            </div>
            <div>
              <Label htmlFor="feeFlat">Flat fee ($)</Label>
              <Input
                id="feeFlat"
                type="number"
                step="0.01"
                value={settings.paymentProcessing.processingFeeFlat}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentProcessing: {...settings.paymentProcessing, processingFeeFlat: parseFloat(e.target.value)}
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                value={settings.paymentProcessing.merchantId}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentProcessing: {...settings.paymentProcessing, merchantId: e.target.value}
                })}
                placeholder="Enter merchant ID"
              />
            </div>
            <div>
              <Label htmlFor="terminalId">Terminal ID</Label>
              <Input
                id="terminalId"
                value={settings.paymentProcessing.terminalId}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentProcessing: {...settings.paymentProcessing, terminalId: e.target.value}
                })}
                placeholder="Enter terminal ID"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleTestPayment} variant="outline">
              Test Payment Processing
            </Button>
            <Button variant="outline">
              View Transaction History
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Billing Settings
        </Button>
      </div>
    </div>
  );
};

export default BillingSettings;
