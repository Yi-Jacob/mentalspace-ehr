export interface PortalForm {
  id: string;
  title: string;
  description?: string;
  sharable: 'sharable' | 'not_sharable';
  accessLevel: 'admin' | 'clinician' | 'billing';
  panelContent: any; // Form elements structure
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface PortalFormResponse {
  id: string;
  clientFileId: string;
  content: any; // Form responses
  signature?: string; // Base64 encoded signature
  createdAt: string;
  updatedAt: string;
  clientFile: {
    id: string;
    clientId: string;
    portalFormId: string;
    portalForm: {
      id: string;
      title: string;
      description?: string;
      sharable: 'sharable' | 'not_sharable';
      accessLevel: 'admin' | 'clinician' | 'billing';
      panelContent: any;
      createdAt: string;
      updatedAt: string;
      creator: {
        id: string;
        firstName: string;
        lastName: string;
      };
    };
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

// Form element types
export interface FormElement {
  id: string;
  type: 'readonly_text' | 'choice' | 'divider' | 'text_response' | 'patient_signature';
  order: number;
}

export interface ReadonlyTextElement extends FormElement {
  type: 'readonly_text';
  text: string;
}

export interface ChoiceElement extends FormElement {
  type: 'choice';
  description: string;
  choices: Array<{
    id: string;
    text: string;
  }>;
}

export interface DividerElement extends FormElement {
  type: 'divider';
}

export interface TextResponseElement extends FormElement {
  type: 'text_response';
  description: string;
  required?: boolean;
}

export interface PatientSignatureElement extends FormElement {
  type: 'patient_signature';
  label?: string;
}

export type AnyFormElement = 
  | ReadonlyTextElement 
  | ChoiceElement 
  | DividerElement 
  | TextResponseElement 
  | PatientSignatureElement;

export interface CreatePortalFormDto {
  title: string;
  description?: string;
  sharable: 'sharable' | 'not_sharable';
  accessLevel: 'admin' | 'clinician' | 'billing';
  panelContent: any;
}

export interface UpdatePortalFormDto {
  title?: string;
  description?: string;
  sharable?: 'sharable' | 'not_sharable';
  accessLevel?: 'admin' | 'clinician' | 'billing';
  panelContent?: any;
}

export interface SubmitPortalFormResponseDto {
  content: any;
  signature?: string;
}
