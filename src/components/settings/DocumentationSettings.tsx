
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ServiceCptCodesSettings from './documentation/ServiceCptCodesSettings';
import NotesSettings from './documentation/NotesSettings';
import HealthInformationExchangeSettings from './documentation/HealthInformationExchangeSettings';

const DocumentationSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
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
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Documentation settings have been updated successfully.',
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
    setSettings(prev => ({
      ...prev,
      serviceCptCodes: newSettings
    }));
  };

  const updateNotesSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      notesSettings: newSettings
    }));
  };

  const updateHealthInformationExchangeSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      healthInformationExchange: newSettings
    }));
  };

  return (
    <div className="space-y-6">
      <ServiceCptCodesSettings
        settings={settings.serviceCptCodes}
        onSettingsChange={updateServiceCptCodesSettings}
        onAddCptCode={handleAddCptCode}
      />

      <NotesSettings
        settings={settings.notesSettings}
        onSettingsChange={updateNotesSettings}
        onManageDictionary={handleManageDictionary}
      />

      <HealthInformationExchangeSettings
        settings={settings.healthInformationExchange}
        onSettingsChange={updateHealthInformationExchangeSettings}
        onConnectHIE={handleConnectHIE}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default DocumentationSettings;
