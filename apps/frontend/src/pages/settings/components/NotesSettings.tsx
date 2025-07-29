
import React from 'react';
import { Button } from '@/components/basic/button';
import { useToast } from '@/hooks/use-toast';
import { usePracticeSettings } from '@/hooks/usePracticeSettings';
import ServiceCptCodesSettings from './notes/ServiceCptCodesSettings';
import NotesDetailsSettings from './notes/NotesSettings';
import HealthInformationExchangeSettings from './notes/HealthInformationExchangeSettings';

const NotesSettings: React.FC = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading, isUpdating } = usePracticeSettings();

  // Safely extract notes settings with proper defaults
  const safeNotesSettings = (() => {
    const docSettings = settings?.documentation_settings;
    if (docSettings && typeof docSettings === 'object' && !Array.isArray(docSettings)) {
      return docSettings as Record<string, any>;
    }
    return {};
  })();

  // Provide comprehensive defaults
  const notesSettings = {
    serviceCptCodes: {
      defaultCodes: ['90834', '90837', '90847', '90853'],
      customCodes: [],
      allowCustomCodes: true,
      ...(safeNotesSettings.serviceCptCodes || {})
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
      ...(safeNotesSettings.notesSettings || {})
    },
    healthInformationExchange: {
      enabled: false,
      registries: [],
      autoQuery: false,
      shareLevel: 'minimal',
      ...(safeNotesSettings.healthInformationExchange || {})
    }
  };

  const handleSave = () => {
    updateSettings({
      documentation_settings: notesSettings
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
      ...notesSettings,
      serviceCptCodes: newSettings
    };
    updateSettings({
      documentation_settings: updatedDocSettings
    });
  };

  const updateNotesSettings = (newSettings: any) => {
    const updatedDocSettings = {
      ...notesSettings,
      notesSettings: newSettings
    };
    updateSettings({
      documentation_settings: updatedDocSettings
    });
  };

  const updateHealthInformationExchangeSettings = (newSettings: any) => {
    const updatedDocSettings = {
      ...notesSettings,
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
        settings={notesSettings.serviceCptCodes}
        onSettingsChange={updateServiceCptCodesSettings}
        onAddCptCode={handleAddCptCode}
      />

      <NotesDetailsSettings
        settings={notesSettings.notesSettings}
        onSettingsChange={updateNotesSettings}
        onManageDictionary={handleManageDictionary}
      />

      <HealthInformationExchangeSettings
        settings={notesSettings.healthInformationExchange}
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

export default NotesSettings;
