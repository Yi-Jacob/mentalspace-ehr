import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { useToast } from '@/hooks/use-toast';
import { portalFormService } from '@/services/portalFormService';
import { AnyFormElement, UpdatePortalFormDto, PortalForm } from '@/types/portalFormType';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const PortalFormEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sharable, setSharable] = useState<'sharable' | 'not_sharable'>('not_sharable');
  const [accessLevel, setAccessLevel] = useState<'admin' | 'clinician' | 'billing'>('admin');
  
  // Form elements
  const [elements, setElements] = useState<AnyFormElement[]>([]);
  const [showElementSelector, setShowElementSelector] = useState(false);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const form = await portalFormService.getPortalFormById(id!);
      
      setTitle(form.title);
      setDescription(form.description || '');
      setSharable(form.sharable);
      setAccessLevel(form.accessLevel);
      setElements(form.panelContent.elements || []);
    } catch (error) {
      console.error('Error fetching portal form:', error);
      toast({
        title: "Error",
        description: "Failed to load portal form",
        variant: "destructive",
      });
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const addElement = (type: AnyFormElement['type']) => {
    const newElement: AnyFormElement = {
      id: `element_${Date.now()}`,
      type,
      order: elements.length,
      ...(type === 'readonly_text' && { text: '' }),
      ...(type === 'choice' && { description: '', choices: [{ id: 'choice_1', text: '' }] }),
      ...(type === 'text_response' && { description: '', required: false }),
      ...(type === 'patient_signature' && { label: 'Patient Signature' }),
    } as AnyFormElement;
    
    setElements([...elements, newElement]);
    setShowElementSelector(false);
  };

  const removeElement = (elementId: string) => {
    setElements(elements.filter(el => el.id !== elementId));
  };

  const updateElement = (elementId: string, updates: Partial<AnyFormElement>) => {
    setElements(elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const addChoice = (elementId: string) => {
    setElements(elements.map(el => {
      if (el.id === elementId && el.type === 'choice') {
        const newChoice = { id: `choice_${Date.now()}`, text: '' };
        return { ...el, choices: [...el.choices, newChoice] };
      }
      return el;
    }));
  };

  const removeChoice = (elementId: string, choiceId: string) => {
    setElements(elements.map(el => {
      if (el.id === elementId && el.type === 'choice') {
        return { ...el, choices: el.choices.filter(c => c.id !== choiceId) };
      }
      return el;
    }));
  };

  const updateChoice = (elementId: string, choiceId: string, text: string) => {
    setElements(elements.map(el => {
      if (el.id === elementId && el.type === 'choice') {
        return {
          ...el,
          choices: el.choices.map(c => c.id === choiceId ? { ...c, text } : c)
        };
      }
      return el;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a form title",
        variant: "destructive",
      });
      return;
    }

    if (elements.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one form element",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const formData: UpdatePortalFormDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        sharable,
        accessLevel,
        panelContent: {
          elements: elements.map((el, index) => ({ ...el, order: index }))
        }
      };

      await portalFormService.updatePortalForm(id!, formData);
      
      toast({
        title: "Success",
        description: "Portal form updated successfully",
      });
      
      navigate('/library');
    } catch (error) {
      console.error('Error updating portal form:', error);
      toast({
        title: "Error",
        description: "Failed to update portal form",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderElement = (element: AnyFormElement) => {
    switch (element.type) {
      case 'readonly_text':
        return (
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea
              value={element.text}
              onChange={(e) => updateElement(element.id, { text: e.target.value })}
              placeholder="Enter text content..."
              rows={3}
            />
          </div>
        );
      
      case 'choice':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question/Description</Label>
              <Textarea
                value={element.description}
                onChange={(e) => updateElement(element.id, { description: e.target.value })}
                placeholder="Enter question or description..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Choices</Label>
              {element.choices.map((choice, index) => (
                <div key={choice.id} className="flex items-center space-x-2">
                  <Input
                    value={choice.text}
                    onChange={(e) => updateChoice(element.id, choice.id, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                    className="flex-1"
                  />
                  {element.choices.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeChoice(element.id, choice.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addChoice(element.id)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Choice
              </Button>
            </div>
          </div>
        );
      
      case 'text_response':
        return (
          <div className="space-y-2">
            <Label>Question/Description</Label>
            <Textarea
              value={element.description}
              onChange={(e) => updateElement(element.id, { description: e.target.value })}
              placeholder="Enter question or description..."
              rows={2}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`required-${element.id}`}
                checked={element.required}
                onChange={(e) => updateElement(element.id, { required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor={`required-${element.id}`}>Required</Label>
            </div>
          </div>
        );
      
      case 'patient_signature':
        return (
          <div className="space-y-2">
            <Label>Signature Label</Label>
            <Input
              value={element.label}
              onChange={(e) => updateElement(element.id, { label: e.target.value })}
              placeholder="Enter signature label..."
            />
          </div>
        );
      
      case 'divider':
        return (
          <div className="text-center text-gray-500 py-4">
            <hr className="border-gray-300" />
            <span className="text-sm">Divider</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getElementTypeLabel = (type: AnyFormElement['type']) => {
    switch (type) {
      case 'readonly_text': return 'Read-only Text';
      case 'choice': return 'Multiple Choice';
      case 'divider': return 'Divider';
      case 'text_response': return 'Text Response';
      case 'patient_signature': return 'Patient Signature';
      default: return type;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading portal form..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Edit Portal Form"
        description="Update the form design and settings"
        action={
          <Button
            variant="outline"
            onClick={() => navigate('/library')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Library</span>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Form Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter form description..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sharable">Sharable</Label>
                <Select value={sharable} onValueChange={(value: 'sharable' | 'not_sharable') => setSharable(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharable">Sharable</SelectItem>
                    <SelectItem value="not_sharable">Not Sharable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select value={accessLevel} onValueChange={(value: 'admin' | 'clinician' | 'billing') => setAccessLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="clinician">Clinician</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Form Elements</CardTitle>
              <div className="relative">
                <Button
                  type="button"
                  onClick={() => setShowElementSelector(!showElementSelector)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Element</span>
                </Button>
                
                {showElementSelector && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {[
                        { type: 'readonly_text', label: 'Read-only Text' },
                        { type: 'choice', label: 'Multiple Choice' },
                        { type: 'text_response', label: 'Text Response' },
                        { type: 'divider', label: 'Divider' },
                        { type: 'patient_signature', label: 'Patient Signature' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => addElement(item.type as AnyFormElement['type'])}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {elements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No form elements added yet.</p>
                <p className="text-sm">Click "Add Element" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {elements.map((element, index) => (
                  <div key={element.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}. {getElementTypeLabel(element.type)}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeElement(element.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {renderElement(element)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/library')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || !title.trim() || elements.length === 0}
            className="flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default PortalFormEditPage;
