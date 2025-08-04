
import React from 'react';
import { Button } from '@/components/basic/button';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import CategorySection from '@/components/basic/CategorySection';
import { Plus, X } from 'lucide-react';
import { 
  LICENSE_STATE_OPTIONS, 
  LICENSE_TYPE_OPTIONS, 
  LICENSE_STATUS_OPTIONS, 
  ISSUED_BY_OPTIONS 
} from '@/types/enums/staffEnum';

interface LicensesSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onLicensesChange?: (licenses: any[]) => void;
}

const LicensesSection: React.FC<LicensesSectionProps> = ({
  formData,
  onInputChange,
  onLicensesChange
}) => {
  // Initialize licenses from formData or create default structure
  const [licenses, setLicenses] = React.useState(() => {
    if (formData.licenses && formData.licenses.length > 0) {
      return formData.licenses;
    }
    return [{
      licenseType: '',
      licenseNumber: '',
      licenseStatus: 'active',
      licenseState: '',
      licenseExpirationDate: '',
      issuedBy: ''
    }];
  });

  const addLicense = () => {
    setLicenses([...licenses, { 
      licenseType: '', 
      licenseNumber: '', 
      licenseStatus: 'active', 
      licenseState: '', 
      licenseExpirationDate: '', 
      issuedBy: '' 
    }]);
  };

  const removeLicense = (index: number) => {
    if (licenses.length > 1) {
      setLicenses(licenses.filter((_, i) => i !== index));
    }
  };

  // Sync licenses with parent component
  React.useEffect(() => {
    if (onLicensesChange) {
      // Filter out empty licenses (where all fields are empty)
      const validLicenses = licenses.filter(license => 
        license.licenseType || 
        license.licenseNumber || 
        license.licenseState || 
        license.licenseExpirationDate || 
        license.issuedBy
      );
      onLicensesChange(validLicenses);
    }
  }, [licenses, onLicensesChange]);

  const updateLicense = (index: number, field: string, value: string) => {
    const updated = licenses.map((license, i) =>
      i === index ? { ...license, [field]: value } : license
    );
    setLicenses(updated);

    // Update form data for the first license (legacy support)
    if (index === 0) {
      if (field === 'licenseState') onInputChange('licenseState', value);
      if (field === 'licenseNumber') onInputChange('licenseNumber', value);
      if (field === 'licenseExpirationDate') onInputChange('licenseExpiryDate', value);
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
          <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            {/* License Type */}
            <SelectField
              value={license.licenseType}
              label="License Type"
              onValueChange={(value) => updateLicense(index, 'licenseType', value)}
              placeholder="Select type"
              options={LICENSE_TYPE_OPTIONS}
              containerClassName="flex-1"
            />
            {/* License Number */}
            <InputField
              value={license.licenseNumber}
              label="License Number"
              onChange={(e) => updateLicense(index, 'licenseNumber', e.target.value)}
              placeholder="License number"
              containerClassName="flex-1"
            />
            {/* License Status */}
            <SelectField
              value={license.licenseStatus}
              label="Status"
              onValueChange={(value) => updateLicense(index, 'licenseStatus', value)}
              placeholder="Select status"
              options={LICENSE_STATUS_OPTIONS}
              containerClassName="flex-1"
            />
            {/* License State */}
            <SelectField
              value={license.licenseState}
              label="State"
              onValueChange={(value) => updateLicense(index, 'licenseState', value)}
              placeholder="Select state"
              options={LICENSE_STATE_OPTIONS}
              containerClassName="flex-1"
            />
            {/* Issued By */}
            <SelectField
              value={license.issuedBy}
              label="Issued By"
              onValueChange={(value) => updateLicense(index, 'issuedBy', value)}
              placeholder="Select authority"
              options={ISSUED_BY_OPTIONS}
              containerClassName="flex-1"
            />
            {/* Expiration Date */}
            <DateInput
              value={license.licenseExpirationDate}
              label="Expiration"
              onChange={(value) => updateLicense(index, 'licenseExpirationDate', value)}
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
