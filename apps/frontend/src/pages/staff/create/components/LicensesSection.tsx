
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Plus, X, HelpCircle } from 'lucide-react';

interface LicensesSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const LicensesSection: React.FC<LicensesSectionProps> = ({
  formData,
  onInputChange
}) => {
  const [licenses, setLicenses] = React.useState([
    { 
      state: formData.license_state || '', 
      number: formData.license_number || '', 
      taxonomy: '', 
      expiration: formData.license_expiry_date || '' 
    }
  ]);

  const addLicense = () => {
    setLicenses([...licenses, { state: '', number: '', taxonomy: '', expiration: '' }]);
  };

  const removeLicense = (index: number) => {
    if (licenses.length > 1) {
      setLicenses(licenses.filter((_, i) => i !== index));
    }
  };

  const updateLicense = (index: number, field: string, value: string) => {
    const updated = licenses.map((license, i) => 
      i === index ? { ...license, [field]: value } : license
    );
    setLicenses(updated);
    
    // Update form data for the first license
    if (index === 0) {
      if (field === 'state') onInputChange('license_state', value);
      if (field === 'number') onInputChange('license_number', value);
      if (field === 'expiration') onInputChange('license_expiry_date', value);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">Licenses</CardTitle>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addLicense}
            className="flex items-center space-x-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New License</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {licenses.map((license, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
              {/* State / Number */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">State / Number:</Label>
                <div className="flex space-x-2">
                  <Select 
                    value={license.state} 
                    onValueChange={(value) => updateLicense(index, 'state', value)}
                  >
                    <SelectTrigger className="w-16 bg-white border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60">
                      {stateOptions.map((state) => (
                        <SelectItem key={state} value={state} className="hover:bg-blue-50">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={license.number}
                    onChange={(e) => updateLicense(index, 'number', e.target.value)}
                    placeholder="License number"
                    className="flex-1 bg-white border-gray-200 focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Taxonomy */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <span>Taxonomy:</span>
                  <HelpCircle className="h-3 w-3 text-gray-400" />
                </Label>
                <Input
                  value={license.taxonomy}
                  onChange={(e) => updateLicense(index, 'taxonomy', e.target.value)}
                  placeholder="search for code or description"
                  className="bg-white border-gray-200 focus:border-blue-400"
                />
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Expiration:</Label>
                <Input
                  type="date"
                  value={license.expiration}
                  onChange={(e) => updateLicense(index, 'expiration', e.target.value)}
                  className="bg-white border-gray-200 focus:border-blue-400"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end justify-end">
                {licenses.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLicense(index)}
                    className="p-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LicensesSection;
