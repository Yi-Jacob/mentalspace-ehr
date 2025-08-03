
import React from 'react';
import { Button } from '@/components/basic/button';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import CategorySection from '@/components/basic/CategorySection';
import { Plus, X } from 'lucide-react';
import { LICENSE_STATE_OPTIONS } from '@/types/enums/staffEnum';

interface LicensesSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const LicensesSection: React.FC<LicensesSectionProps> = ({
  formData,
  onInputChange
}) => {
  const [licenses, setLicenses] = React.useState([
    {
      state: formData.licenseState || '',
      number: formData.licenseNumber || '',
      taxonomy: '',
      expiration: formData.licenseExpiryDate || ''
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
      if (field === 'state') onInputChange('licenseState', value);
      if (field === 'number') onInputChange('licenseNumber', value);
      if (field === 'expiration') onInputChange('licenseExpiryDate', value);
    }
  };

  return (
    <CategorySection
      title="Licenses"
      headerAction={
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
      }
    >
      <div className="space-y-6">
        {licenses.map((license, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            {/* State / Number */}
            <SelectField
              value={license.state}
              label="State"
              onValueChange={(value) => updateLicense(index, 'state', value)}
              placeholder="--"
              options={LICENSE_STATE_OPTIONS}
              containerClassName="flex-1"
            />
            <InputField
              value={license.number}
              label="Number"
              onChange={(e) => updateLicense(index, 'number', e.target.value)}
              placeholder="License number"
              containerClassName="flex-1"
            />
            <InputField
              label="Taxonomy"
              value={license.taxonomy}
              onChange={(e) => updateLicense(index, 'taxonomy', e.target.value)}
              placeholder="search for code or description"
            />
            <DateInput
              value={license.expiration}
              label="Expiration"
              onChange={(value) => updateLicense(index, 'expiration', value)}
            />
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
        ))}
      </div>
    </CategorySection>
  );
};

export default LicensesSection;
