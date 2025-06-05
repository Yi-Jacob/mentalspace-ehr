
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign, FileText, Settings } from 'lucide-react';
import { usePracticeSettings } from '@/hooks/usePracticeSettings';

const BillingSettings: React.FC = () => {
  const { settings, updateSettings, isLoading, isUpdating } = usePracticeSettings();

  const billingSettings = settings?.billing_settings || {};

  const updateBillingSetting = (field: string, value: any) => {
    updateSettings({
      billing_settings: {
        ...billingSettings,
        [field]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <Label htmlFor="creditCards">Accept credit cards</Label>
            <Switch
              id="creditCards"
              checked={billingSettings.accept_credit_cards || false}
              onCheckedChange={(checked) => updateBillingSetting('accept_credit_cards', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ach">Accept ACH/Bank transfers</Label>
            <Switch
              id="ach"
              checked={billingSettings.accept_ach || false}
              onCheckedChange={(checked) => updateBillingSetting('accept_ach', checked)}
            />
          </div>

          <div>
            <Label htmlFor="processor">Payment processor</Label>
            <Select 
              value={billingSettings.payment_processor || 'stripe'}
              onValueChange={(value) => updateBillingSetting('payment_processor', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="authorize_net">Authorize.Net</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Billing Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="defaultRate">Default hourly rate</Label>
              <Input
                id="defaultRate"
                type="number"
                value={billingSettings.default_hourly_rate || ''}
                onChange={(e) => updateBillingSetting('default_hourly_rate', Number(e.target.value))}
                placeholder="150"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={billingSettings.currency || 'USD'}
                onValueChange={(value) => updateBillingSetting('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoInvoice">Auto-generate invoices</Label>
            <Switch
              id="autoInvoice"
              checked={billingSettings.auto_generate_invoices || false}
              onCheckedChange={(checked) => updateBillingSetting('auto_generate_invoices', checked)}
            />
          </div>

          <div>
            <Label htmlFor="invoiceFrequency">Invoice frequency</Label>
            <Select 
              value={billingSettings.invoice_frequency || 'monthly'}
              onValueChange={(value) => updateBillingSetting('invoice_frequency', value)}
            >
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
        </CardContent>
      </Card>

      {/* Insurance & Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Insurance & Claims</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="insuranceBilling">Enable insurance billing</Label>
            <Switch
              id="insuranceBilling"
              checked={billingSettings.insurance_billing_enabled || false}
              onCheckedChange={(checked) => updateBillingSetting('insurance_billing_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="electronicClaims">Submit electronic claims</Label>
            <Switch
              id="electronicClaims"
              checked={billingSettings.electronic_claims || false}
              onCheckedChange={(checked) => updateBillingSetting('electronic_claims', checked)}
            />
          </div>

          <div>
            <Label htmlFor="clearinghouse">Clearinghouse</Label>
            <Select 
              value={billingSettings.clearinghouse || 'change_healthcare'}
              onValueChange={(value) => updateBillingSetting('clearinghouse', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="change_healthcare">Change Healthcare</SelectItem>
                <SelectItem value="availity">Availity</SelectItem>
                <SelectItem value="trizetto">Trizetto</SelectItem>
                <SelectItem value="relay_health">Relay Health</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Settings Auto-Saved'}
        </Button>
      </div>
    </div>
  );
};

export default BillingSettings;
