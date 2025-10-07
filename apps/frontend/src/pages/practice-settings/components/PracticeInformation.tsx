import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { toast } from 'sonner';
import { PracticeSettingsService, PracticeSettings, UpdatePracticeSettingsRequest } from '@/services/practiceSettingsService';

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
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState<PracticeSettings | null>(null);

  useEffect(() => {
    loadPracticeSettings();
  }, []);

  const loadPracticeSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await PracticeSettingsService.getPracticeSettings();
      setOriginalData(settings);
      
      // Load practice info from the settings object
      const practiceInfo = settings.practiceInfo || {};
      setFormData({
        practiceName: practiceInfo.practiceName || '',
        addressLine1: practiceInfo.address?.street || '',
        addressLine2: practiceInfo.address?.addressLine2 || '',
        city: practiceInfo.address?.city || '',
        state: practiceInfo.address?.state || '',
        zip: practiceInfo.address?.zipCode || '',
        phoneNumber: practiceInfo.contact?.phone || '',
        faxNumber: practiceInfo.contact?.fax || '',
        preferredEmail: practiceInfo.companyEmail || '',
        practiceWebAddress: practiceInfo.contact?.website || '',
        npi: practiceInfo.businessInfo?.npi || '',
        federalTaxId: practiceInfo.businessInfo?.federalTaxId || '',
        placeOfServiceCode: practiceInfo.businessInfo?.placeOfServiceCode || '',
        taxonomyCode: practiceInfo.businessInfo?.taxonomyCode || '',
        timeZone: practiceInfo.timezone || 'America/New_York'
      });
    } catch (error) {
      console.error('Failed to load practice settings:', error);
      toast.error('Failed to load practice settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const practiceInfo = {
        practiceName: formData.practiceName,
        timezone: formData.timeZone,
        companyEmail: formData.preferredEmail,
        address: {
          street: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          country: 'USA'
        },
        contact: {
          phone: formData.phoneNumber,
          fax: formData.faxNumber,
          website: formData.practiceWebAddress
        },
        businessInfo: {
          npi: formData.npi,
          federalTaxId: formData.federalTaxId,
          placeOfServiceCode: formData.placeOfServiceCode,
          taxonomyCode: formData.taxonomyCode
        }
      };

      const updateData: UpdatePracticeSettingsRequest = {
        practiceInfo: practiceInfo,
      };

      const updatedSettings = await PracticeSettingsService.updatePracticeSettings(updateData);
      setOriginalData(updatedSettings);
      toast.success('Practice information updated successfully');
    } catch (error) {
      console.error('Failed to update practice information:', error);
      toast.error('Failed to update practice information');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const originalPracticeInfo = originalData.practiceInfo || {};
    const originalFormData = {
      practiceName: originalPracticeInfo.practiceName || '',
      addressLine1: originalPracticeInfo.address?.street || '',
      addressLine2: originalPracticeInfo.address?.addressLine2 || '',
      city: originalPracticeInfo.address?.city || '',
      state: originalPracticeInfo.address?.state || '',
      zip: originalPracticeInfo.address?.zipCode || '',
      phoneNumber: originalPracticeInfo.contact?.phone || '',
      faxNumber: originalPracticeInfo.contact?.fax || '',
      preferredEmail: originalPracticeInfo.companyEmail || '',
      practiceWebAddress: originalPracticeInfo.contact?.website || '',
      npi: originalPracticeInfo.businessInfo?.npi || '',
      federalTaxId: originalPracticeInfo.businessInfo?.federalTaxId || '',
      placeOfServiceCode: originalPracticeInfo.businessInfo?.placeOfServiceCode || '',
      taxonomyCode: originalPracticeInfo.businessInfo?.taxonomyCode || '',
      timeZone: originalPracticeInfo.timezone || 'America/New_York'
    };
    
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
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
            <Select 
              value={formData.placeOfServiceCode} 
              onValueChange={(value) => handleInputChange('placeOfServiceCode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select place of service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">01 - Pharmacy</SelectItem>
                <SelectItem value="02">02 - Telehealth Provided Other than in Patient's Home</SelectItem>
                <SelectItem value="03">03 - School</SelectItem>
                <SelectItem value="04">04 - Homeless Shelter</SelectItem>
                <SelectItem value="05">05 - Indian Health Service Free-standing Facility</SelectItem>
                <SelectItem value="06">06 - Indian Health Service Provider-based Facility</SelectItem>
                <SelectItem value="07">07 - Tribal 638 Free-standing Facility</SelectItem>
                <SelectItem value="08">08 - Tribal 638 Provider-based Facility</SelectItem>
                <SelectItem value="09">09 - Prison/Correctional Facility</SelectItem>
                <SelectItem value="10">10 - Telehealth Provided in Patient's Home</SelectItem>
                <SelectItem value="11">11 - Office</SelectItem>
                <SelectItem value="12">12 - Home</SelectItem>
                <SelectItem value="13">13 - Assisted Living Facility</SelectItem>
                <SelectItem value="14">14 - Group Home</SelectItem>
                <SelectItem value="15">15 - Mobile Unit</SelectItem>
                <SelectItem value="16">16 - Temporary Lodging</SelectItem>
                <SelectItem value="17">17 - Walk-in Retail Health Clinic</SelectItem>
                <SelectItem value="18">18 - Place of Employment (Worksite)</SelectItem>
                <SelectItem value="19">19 - Off Campus-outpatient Hospital</SelectItem>
                <SelectItem value="20">20 - Urgent Care Facility</SelectItem>
                <SelectItem value="21">21 - Inpatient Hospital</SelectItem>
                <SelectItem value="22">22 - Outpatient Hospital</SelectItem>
                <SelectItem value="23">23 - Hospital Emergency Room</SelectItem>
                <SelectItem value="24">24 - Ambulatory Surgical Center</SelectItem>
                <SelectItem value="25">25 - Birthing Center</SelectItem>
                <SelectItem value="26">26 - Military Treatment Facility</SelectItem>
                <SelectItem value="27">27 - Outreach Site/Street</SelectItem>
                <SelectItem value="31">31 - Skilled Nursing Facility</SelectItem>
                <SelectItem value="32">32 - Nursing Facility</SelectItem>
                <SelectItem value="33">33 - Custodial Care Facility</SelectItem>
                <SelectItem value="34">34 - Hospice</SelectItem>
                <SelectItem value="41">41 - Ambulance (Land)</SelectItem>
                <SelectItem value="42">42 - Ambulance (Air or Water)</SelectItem>
                <SelectItem value="49">49 - Independent Clinic</SelectItem>
                <SelectItem value="50">50 - Federally Qualified Health Center</SelectItem>
                <SelectItem value="51">51 - Inpatient Psychiatric Facility</SelectItem>
                <SelectItem value="52">52 - Psychiatric Facility (Partial Hospitalization)</SelectItem>
                <SelectItem value="53">53 - Community Mental Health Center</SelectItem>
                <SelectItem value="54">54 - Intermediate Care Facility/Individuals with Intellectual Disabilities</SelectItem>
                <SelectItem value="55">55 - Residential Substance Abuse Treatment Facility</SelectItem>
                <SelectItem value="56">56 - Psychiatric Residential Treatment Center</SelectItem>
                <SelectItem value="57">57 - Non-residential Substance Abuse Treatment Facility</SelectItem>
                <SelectItem value="58">58 - Non-residential Opioid Treatment Facility</SelectItem>
                <SelectItem value="59">59 - Telephone only</SelectItem>
                <SelectItem value="60">60 - Mass Immunization Center</SelectItem>
                <SelectItem value="61">61 - Comprehensive Inpatient Rehabilitation Facility</SelectItem>
                <SelectItem value="62">62 - Comprehensive Outpatient Rehabilitation Facility</SelectItem>
                <SelectItem value="65">65 - End-Stage Renal Disease Treatment Facility</SelectItem>
                <SelectItem value="71">71 - Public Health Clinic</SelectItem>
                <SelectItem value="72">72 - Rural Health Clinic</SelectItem>
                <SelectItem value="81">81 - Independent Laboratory</SelectItem>
                <SelectItem value="99">99 - Other Place of Service</SelectItem>
              </SelectContent>
            </Select>
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
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges() || isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeInformationSection;
