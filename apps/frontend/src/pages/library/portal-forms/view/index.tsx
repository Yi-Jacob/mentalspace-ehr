import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileEdit } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Checkbox } from '@/components/basic/checkbox';
import { Textarea } from '@/components/basic/textarea';
import { useToast } from '@/hooks/use-toast';
import { portalFormService } from '@/services/portalFormService';
import { PortalForm, AnyFormElement, SubmitPortalFormResponseDto } from '@/types/portalFormType';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import ESignature from '@/components/ESignature';
import { useAuth } from '@/hooks/useAuth';

const PortalFormViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState<PortalForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchForm();
      console.log(user);
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const formData = await portalFormService.getPortalFormById(id!);
      setForm(formData);
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
    const requiredElements = form.panelContent.elements.filter(
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
    const hasSignatureElement = form.panelContent.elements.some(
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
        },
        signature: signature || undefined,
      };
      console.log(submitData);
      await portalFormService.submitPortalFormResponse(id!, submitData);

      toast({
        title: "Success",
        description: "Form submitted successfully",
      });

      navigate('/library');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormElement = (element: AnyFormElement) => {
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
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleResponseChange(element.id, choice.id);
                      } else {
                        handleResponseChange(element.id, null);
                      }
                    }}
                  />
                  <label
                    htmlFor={`${element.id}_${choice.id}`}
                    className="text-sm text-gray-700 cursor-pointer"
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
            <Textarea
              value={responses[element.id] || ''}
              onChange={(e) => handleResponseChange(element.id, e.target.value)}
              placeholder="Enter your response..."
              rows={4}
              required={element.required}
            />
          </div>
        );

      case 'patient_signature':
        return (
          <div className="space-y-2">
            <ESignature
              label={element.label || 'Patient Signature'}
              onSignatureChange={setSignature}
              initialSignature={signature || undefined}
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

  const getAccessLevelBadge = (accessLevel: string) => {
    const variants = {
      admin: 'destructive' as const,
      clinician: 'secondary' as const,
      billing: 'outline' as const,
    };

    return (
      <Badge variant={variants[accessLevel as keyof typeof variants] || 'outline'}>
        {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
      </Badge>
    );
  };

  const getSharableBadge = (sharable: string) => {
    return (
      <Badge variant={sharable === 'sharable' ? 'default' : 'secondary'}>
        {sharable === 'sharable' ? 'Sharable' : 'Not Sharable'}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading portal form..." />;
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

  const isCreator = form.createdBy === user?.id;
  const hasSignatureElement = form.panelContent.elements.some(
    (el: AnyFormElement) => el.type === 'patient_signature'
  );

  return (
    <PageLayout>
      <PageHeader
        title={form.title}
        description={form.description || 'Portal Form'}
        action={
          <div className="flex space-x-2">
            {isCreator && (
              <Button
                variant="outline"
                onClick={() => navigate(`/library/portal-forms/${id}/edit`)}
                className="flex items-center space-x-2"
              >
                <FileEdit className="h-4 w-4" />
                <span>Edit</span>
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
        {!user.roles.includes('Patient') && (
          <Card>
            <CardHeader>
              <CardTitle>Form Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="font-medium">
                    {form.creator.firstName} {form.creator.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-medium">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Access Level</p>
                  {getAccessLevelBadge(form.accessLevel)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sharable</p>
                  {getSharableBadge(form.sharable)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.panelContent.elements.map((element: AnyFormElement, index: number) => (
                <div key={element.id} className="space-y-2">
                  {renderFormElement(element)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          {!isCreator && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Submit Form</span>
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

export default PortalFormViewPage;
