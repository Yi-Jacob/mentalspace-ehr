
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePracticeSettings } from '@/hooks/usePracticeSettings';
import ServiceCptCodesSettings from './documentation/ServiceCptCodesSettings';
import NotesSettings from './documentation/NotesSettings';
import HealthInformationExchangeSettings from './documentation/HealthInformationExchangeSettings';

const DocumentationSettings: React.FC = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading, isUpdating } = usePracticeSettings();

  const documentationSettings = settings?.documentation_settings || {
    serviceCptCodes: {
      defaultCodes: ['90834', '90837', '90847', '90853'],
      customCodes: [],
      allowCustomCodes: true,
    },
    notesSettings: {
      autoSave: true,
      autoSaveInterval: 5,
      spellCheck: true,
      wordWrap: true,
      showWordCount: true,
      defaultTemplate: 'progress_note',
      requiredFields: ['presenting_problem', 'mental_status', 'plan'],
      signatureRequired: true,
      cosignatureRequired: false,
    },
    healthInformationExchange: {
      enabled: false,
      registries: [],
      autoQuery: false,
      shareLevel: 'minimal',
    }
  };

  const handleSave = () => {
    updateSettings({
      documentation_settings: documentationSettings
    });
  };

  const handleAddCptCode = () => {
    toast({
      title: 'Add CPT Code',
      description: 'CPT code management functionality would be implemented here.',
    });
  };

  const handleManageDictionary = () => {
    toast({
      title: 'Manage Dictionary',
      description: 'Spell check dictionary management would be implemented here.',
    });
  };

  const handleConnectHIE = () => {
    toast({
      title: 'Connect HIE',
      description: 'Health Information Exchange connection would be implemented here.',
    });
  };

  const updateServiceCptCodesSettings = (newSettings: any) => {
    const updatedDocSettings = {
      ...documentationSettings,
      serviceCptCodes: newSettings
    };
    updateSettings({
      documentation_settings: updatedDocSettings
    });
  };

  const updateNotesSettings = (newSettings: any) => {
    const updatedDocSettings = {
      ...documentationSettings,
      notesSettings: newSettings
    };
    updateSettings({
      documentation_settings: updatedDocSettings
    });
  };

  const updateHealthInformationExchangeSettings = (newSettings: any) => {
    const updatedDocSettings = {
      ...documentationSettings,
      healthInformationExchange: newSettings
    };
    updateSettings({
      documentation_settings: updatedDocSettings
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
      <ServiceCptCodesSettings
        settings={documentationSettings.serviceCptCodes}
        onSettingsChange={updateServiceCptCodesSettings}
        onAddCptCode={handleAddCptCode}
      />

      <NotesSettings
        settings={documentationSettings.notesSettings}
        onSettingsChange={updateNotesSettings}
        onManageDictionary={handleManageDictionary}
      />

      <HealthInformationExchangeSettings
        settings={documentationSettings.healthInformationExchange}
        onSettingsChange={updateHealthInformationExchangeSettings}
        onConnectHIE={handleConnectHIE}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="px-8"
          disabled={isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentationSettings;
