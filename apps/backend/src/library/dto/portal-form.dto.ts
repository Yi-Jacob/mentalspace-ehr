import { IsString, IsOptional, IsObject, IsArray, IsBoolean, IsEnum } from 'class-validator';

export class CreatePortalFormDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['sharable', 'not_sharable'])
  sharable: 'sharable' | 'not_sharable';

  @IsEnum(['admin', 'clinician', 'billing'])
  accessLevel: 'admin' | 'clinician' | 'billing';

  @IsObject()
  panelContent: any; // Form elements structure
}

export class UpdatePortalFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['sharable', 'not_sharable'])
  sharable?: 'sharable' | 'not_sharable';

  @IsOptional()
  @IsEnum(['admin', 'clinician', 'billing'])
  accessLevel?: 'admin' | 'clinician' | 'billing';

  @IsOptional()
  @IsObject()
  panelContent?: any;
}

export class SubmitPortalFormResponseDto {
  @IsObject()
  content: any; // Form responses

  @IsOptional()
  @IsString()
  signature?: string; // Base64 encoded signature
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
