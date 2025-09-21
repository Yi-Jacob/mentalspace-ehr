import React, { useState } from 'react';
import { 
  Code, 
  FileText, 
  Network 
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';

interface ServiceCode {
  id: string;
  code: string;
  description: string;
  category: string;
  isActive: boolean;
}

const ServiceCodesSection: React.FC = () => {
  const [serviceCodes, setServiceCodes] = useState<ServiceCode[]>([
    {
      id: '1',
      code: '90834',
      description: 'Individual psychotherapy, 45 minutes',
      category: 'Psychotherapy',
      isActive: true
    },
    {
      id: '2',
      code: '90837',
      description: 'Individual psychotherapy, 60 minutes',
      category: 'Psychotherapy',
      isActive: true
    },
    {
      id: '3',
      code: '90847',
      description: 'Family psychotherapy with patient present',
      category: 'Family Therapy',
      isActive: true
    }
  ]);

  const [newServiceCode, setNewServiceCode] = useState({
    code: '',
    description: '',
    category: '',
    isActive: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddServiceCode = () => {
    if (newServiceCode.code && newServiceCode.description) {
      const serviceCode: ServiceCode = {
        id: Date.now().toString(),
        ...newServiceCode
      };
      setServiceCodes(prev => [...prev, serviceCode]);
      setNewServiceCode({ code: '', description: '', category: '', isActive: true });
      setShowAddForm(false);
    }
  };

  const handleToggleServiceCode = (id: string) => {
    setServiceCodes(prev => 
      prev.map(code => 
        code.id === id ? { ...code, isActive: !code.isActive } : code
      )
    );
  };

  const handleDeleteServiceCode = (id: string) => {
    setServiceCodes(prev => prev.filter(code => code.id !== id));
  };

  const columns: TableColumn<ServiceCode>[] = [
    {
      key: 'code',
      header: 'Code',
      accessor: (code) => (
        <span className="font-mono font-medium">{code.code}</span>
      ),
      sortable: true,
      searchable: true,
    },
    {
      key: 'description',
      header: 'Description',
      accessor: (code) => code.description,
      sortable: true,
      searchable: true,
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (code) => (
        <Badge variant="outline">{code.category}</Badge>
      ),
      sortable: true,
    },
    {
      key: 'isActive',
      header: 'Status',
      accessor: (code) => (
        <Badge className={code.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {code.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5" />
          <span>Service Codes</span>
        </CardTitle>
        <CardDescription>
          Customize the service codes for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Current Service Codes</h4>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add Service Code'}
          </Button>
        </div>

        {showAddForm && (
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h5 className="font-medium">Add New Service Code</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newCode">Service Code</Label>
                <Input
                  id="newCode"
                  value={newServiceCode.code}
                  onChange={(e) => setNewServiceCode(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="90834"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCategory">Category</Label>
                <Input
                  id="newCategory"
                  value={newServiceCode.category}
                  onChange={(e) => setNewServiceCode(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Psychotherapy"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="newDescription">Description</Label>
                <Input
                  id="newDescription"
                  value={newServiceCode.description}
                  onChange={(e) => setNewServiceCode(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Individual psychotherapy, 45 minutes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddServiceCode}>
                Add Service Code
              </Button>
            </div>
          </div>
        )}

        <Table
          data={serviceCodes}
          columns={columns}
          searchable={true}
          pagination={true}
          pageSize={10}
          emptyMessage={
            <div className="text-center py-8">
              <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service codes found</h3>
              <p className="text-gray-600 mb-4">
                Add your first service code to get started.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                Add Service Code
              </Button>
            </div>
          }
          actions={[
            {
              label: 'Toggle Status',
              onClick: (code: ServiceCode) => handleToggleServiceCode(code.id),
              variant: 'ghost',
            },
            {
              label: 'Delete',
              onClick: (code: ServiceCode) => handleDeleteServiceCode(code.id),
              variant: 'ghost',
            },
          ]}
        />

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NoteSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    autoSave: true,
    autoSaveInterval: 30, // seconds
    spellCheck: true,
    customDictionary: '',
    noteTemplates: true,
    requiredFields: {
      chiefComplaint: true,
      historyOfPresentIllness: true,
      mentalStatusExam: true,
      assessment: true,
      plan: true
    },
    noteFormat: 'soap', // 'soap', 'dap', 'custom'
    allowCopyFromPrevious: true,
    requireSupervisorReview: false
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRequiredFieldToggle = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      requiredFields: {
        ...prev.requiredFields,
        [field]: value
      }
    }));
  };

  const handleTextareaChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Note Settings</span>
        </CardTitle>
        <CardDescription>
          Configure note features. Manage your spell check dictionary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-save Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Auto-save Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Auto-save</p>
                <p className="text-sm text-gray-600">Automatically save notes as you type</p>
              </div>
              <Switch 
                checked={settings.autoSave} 
                onCheckedChange={(checked) => handleToggle('autoSave', checked)}
              />
            </div>
            
            {settings.autoSave && (
              <div className="space-y-2">
                <Label htmlFor="autoSaveInterval">Auto-save Interval (seconds)</Label>
                <Select value={settings.autoSaveInterval.toString()} onValueChange={(value) => handleNumberChange('autoSaveInterval', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="120">120</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Spell Check Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Spell Check Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Spell Check</p>
                <p className="text-sm text-gray-600">Check spelling in notes</p>
              </div>
              <Switch 
                checked={settings.spellCheck} 
                onCheckedChange={(checked) => handleToggle('spellCheck', checked)}
              />
            </div>
            
            {settings.spellCheck && (
              <div className="space-y-2">
                <Label htmlFor="customDictionary">Custom Dictionary</Label>
                <Textarea
                  id="customDictionary"
                  value={settings.customDictionary}
                  onChange={(e) => handleTextareaChange('customDictionary', e.target.value)}
                  placeholder="Add custom words, one per line..."
                  rows={4}
                />
                <p className="text-sm text-gray-600">Add words that should be recognized by the spell checker</p>
              </div>
            )}
          </div>
        </div>

        {/* Note Format Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Note Format Settings</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="noteFormat">Default Note Format</Label>
              <Select value={settings.noteFormat} onValueChange={(value) => handleSelectChange('noteFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soap">SOAP (Subjective, Objective, Assessment, Plan)</SelectItem>
                  <SelectItem value="dap">DAP (Data, Assessment, Plan)</SelectItem>
                  <SelectItem value="custom">Custom Format</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Note Templates</p>
                <p className="text-sm text-gray-600">Use pre-defined note templates</p>
              </div>
              <Switch 
                checked={settings.noteTemplates} 
                onCheckedChange={(checked) => handleToggle('noteTemplates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Copy from Previous Notes</p>
                <p className="text-sm text-gray-600">Copy content from previous notes</p>
              </div>
              <Switch 
                checked={settings.allowCopyFromPrevious} 
                onCheckedChange={(checked) => handleToggle('allowCopyFromPrevious', checked)}
              />
            </div>
          </div>
        </div>

        {/* Required Fields */}
        <div className="space-y-4">
          <h4 className="font-medium">Required Fields</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Chief Complaint</span>
              <Switch 
                checked={settings.requiredFields.chiefComplaint} 
                onCheckedChange={(checked) => handleRequiredFieldToggle('chiefComplaint', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>History of Present Illness</span>
              <Switch 
                checked={settings.requiredFields.historyOfPresentIllness} 
                onCheckedChange={(checked) => handleRequiredFieldToggle('historyOfPresentIllness', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Mental Status Exam</span>
              <Switch 
                checked={settings.requiredFields.mentalStatusExam} 
                onCheckedChange={(checked) => handleRequiredFieldToggle('mentalStatusExam', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Assessment</span>
              <Switch 
                checked={settings.requiredFields.assessment} 
                onCheckedChange={(checked) => handleRequiredFieldToggle('assessment', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Plan</span>
              <Switch 
                checked={settings.requiredFields.plan} 
                onCheckedChange={(checked) => handleRequiredFieldToggle('plan', checked)}
              />
            </div>
          </div>
        </div>

        {/* Review Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Review Settings</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require Supervisor Review</p>
              <p className="text-sm text-gray-600">All notes must be reviewed by a supervisor</p>
            </div>
            <Switch 
              checked={settings.requireSupervisorReview} 
              onCheckedChange={(checked) => handleToggle('requireSupervisorReview', checked)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthInformationExchangeSection: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: false,
    registries: [
      {
        id: '1',
        name: 'State HIE Registry',
        url: 'https://state-hie.example.com',
        isActive: false,
        lastSync: null
      },
      {
        id: '2',
        name: 'Regional HIE Network',
        url: 'https://regional-hie.example.com',
        isActive: false,
        lastSync: null
      }
    ]
  });

  const handleToggle = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRegistryToggle = (id: string) => {
    setSettings(prev => ({
      ...prev,
      registries: prev.registries.map(registry => 
        registry.id === id ? { ...registry, isActive: !registry.isActive } : registry
      )
    }));
  };

  const testConnection = (id: string) => {
    // TODO: Implement connection test
    console.log('Testing connection for registry:', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="h-5 w-5" />
          <span>Health Information Exchange</span>
        </CardTitle>
        <CardDescription>
          Practice Administrators can connect to one or more Health Information Exchange (HIE) registries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable HIE Integration</p>
            <p className="text-sm text-gray-600">Connect to Health Information Exchange registries</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <h4 className="font-medium">Available HIE Registries</h4>
            
            <div className="space-y-4">
              {settings.registries.map((registry) => (
                <div key={registry.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{registry.name}</h5>
                      <p className="text-sm text-gray-600">{registry.url}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(registry.id)}
                      >
                        Test Connection
                      </Button>
                      <Switch 
                        checked={registry.isActive} 
                        onCheckedChange={() => handleRegistryToggle(registry.id)}
                      />
                    </div>
                  </div>
                  
                  {registry.isActive && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm text-green-800">
                        ✓ Connected to {registry.name}
                      </p>
                      {registry.lastSync && (
                        <p className="text-xs text-green-600 mt-1">
                          Last sync: {new Date(registry.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h5 className="font-medium text-blue-900 mb-2">HIE Integration Benefits</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Access patient records from other healthcare providers</li>
                <li>• Share clinical information securely</li>
                <li>• Reduce duplicate testing and procedures</li>
                <li>• Improve care coordination</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NotesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <ServiceCodesSection />
      <NoteSettingsSection />
      <HealthInformationExchangeSection />
    </div>
  );
};

export default NotesTab;
