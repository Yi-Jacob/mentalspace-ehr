import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileEdit, Eye } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Checkbox } from '@/components/basic/checkbox';
import { Textarea } from '@/components/basic/textarea';
import { useToast } from '@/hooks/use-toast';
import { portalFormService } from '@/services/portalFormService';
import { PortalFormResponse, AnyFormElement, SubmitPortalFormResponseDto } from '@/types/portalFormType';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import ESignature from '@/components/ESignature';
import { useAuth } from '@/hooks/useAuth';

const PortalFormResponsePage: React.FC = () => {
  const { portalFormResponseId } = useParams<{ portalFormResponseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState<PortalFormResponse | null>(null);
  const [response, setResponse] = useState<PortalFormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [signature, setSignature] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (portalFormResponseId) {
      fetchData();
    }
  }, [portalFormResponseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const responseData = await portalFormService.getPortalFormResponseById(portalFormResponseId!);
      
      setResponse(responseData);
      setResponses(responseData.content.responses || {});
      setSignature(responseData.signature || null);
      
      // Get the portal form information from the client file
      if (responseData.clientFile?.portalForm) {
        setForm(responseData);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load portal form response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (elementId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate required fields
    const requiredElements = form.clientFile.portalForm.panelContent.elements.filter(
      (el: AnyFormElement) => el.type === 'text_response' && el.required
    );
    
    for (const element of requiredElements) {
      if (!responses[element.id] || responses[element.id].trim() === '') {
        toast({
          title: "Error",
          description: `Please fill in the required field: ${element.description}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Check if signature is required and provided
    const hasSignatureElement = form.clientFile.portalForm.panelContent.elements.some(
      (el: AnyFormElement) => el.type === 'patient_signature'
    );
    
    if (hasSignatureElement && !signature) {
      toast({
        title: "Error",
        description: "Please provide your signature",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData: SubmitPortalFormResponseDto = {
        content: {
          responses,
          submittedAt: new Date().toISOString(),
          formVersion: form.updatedAt,
          isUpdate: true,
          originalResponseId: response?.id,
        },
        signature: signature || undefined,
      };

      await portalFormService.submitPortalFormResponse(portalFormResponseId, submitData);
      
      toast({
        title: "Success",
        description: hasResponse ? "Form response updated successfully" : "Form submitted successfully",
      });
      
      setIsEditing(false);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating form response:', error);
      toast({
        title: "Error",
        description: "Failed to update form response",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormElement = (element: AnyFormElement, isReadOnly: boolean = false) => {
    switch (element.type) {
      case 'readonly_text':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">{element.text}</p>
          </div>
        );
      
      case 'choice':
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">{element.description}</p>
            <div className="space-y-2">
              {element.choices.map((choice) => (
                <div key={choice.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${element.id}_${choice.id}`}
                    checked={responses[element.id] === choice.id}
                    onCheckedChange={isReadOnly ? undefined : (checked) => {
                      if (checked) {
                        handleResponseChange(element.id, choice.id);
                      } else {
                        handleResponseChange(element.id, null);
                      }
                    }}
                    disabled={isReadOnly}
                  />
                  <label
                    htmlFor={`${element.id}_${choice.id}`}
                    className={`text-sm cursor-pointer ${isReadOnly ? 'text-gray-500' : 'text-gray-700'}`}
                  >
                    {choice.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'text_response':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.description}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isReadOnly ? (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {responses[element.id] || 'No response provided'}
                </p>
              </div>
            ) : (
              <Textarea
                value={responses[element.id] || ''}
                onChange={(e) => handleResponseChange(element.id, e.target.value)}
                placeholder="Enter your response..."
                rows={4}
                required={element.required}
              />
            )}
          </div>
        );
      
      case 'patient_signature':
        return (
          <div className="space-y-2">
            <ESignature
              label={element.label || 'Patient Signature'}
              onSignatureChange={setSignature}
              initialSignature={signature || undefined}
              disabled={isReadOnly}
            />
          </div>
        );
      
      case 'divider':
        return (
          <div className="py-4">
            <hr className="border-gray-300" />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading portal form response..." />;
  }

  if (!form) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Portal form not found</p>
        </div>
      </PageLayout>
    );
  }

  const isPatient = user?.roles?.includes('Patient');
  const hasResponse = !!response;
  const canEdit = isPatient && hasResponse && !isEditing;
  const canSubmit = false; // Since we're viewing an existing response, we can't submit a new one

  return (
    <PageLayout>
      <PageHeader
        title={`${form.clientFile.portalForm.title} - Response`}
        description={form.clientFile.portalForm.description || 'Portal Form Response'}
        action={
          <div className="flex space-x-2">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <FileEdit className="h-4 w-4" />
                <span>Edit Response</span>
              </Button>
            )}
            {canSubmit && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <FileEdit className="h-4 w-4" />
                <span>Fill Form</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Response Information */}
        {hasResponse && (
          <Card>
            <CardHeader>
              <CardTitle>Response Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Submitted By</p>
                  <p className="font-medium">
                    {response?.clientFile?.client?.firstName} {response?.clientFile?.client?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted Date</p>
                  <p className="font-medium">
                    {new Date(response.createdAt).toLocaleString()}
                  </p>
                </div>
                {response.updatedAt !== response.createdAt && (
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">
                      {new Date(response.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Form Response</span>
                {isEditing && (
                  <Badge variant="outline" className="ml-2">
                    Editing
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.clientFile.portalForm.panelContent.elements.map((element: AnyFormElement, index: number) => (
                <div key={element.id} className="space-y-2">
                  {renderFormElement(element, !isEditing)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset to original values
                  if (response) {
                    setResponses(response.content.responses || {});
                    setSignature(response.signature || null);
                  } else {
                    // Reset to empty for new forms
                    setResponses({});
                    setSignature(null);
                  }
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{hasResponse ? 'Updating...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{hasResponse ? 'Update Response' : 'Submit Form'}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </PageLayout>
  );
};

export default PortalFormResponsePage;
