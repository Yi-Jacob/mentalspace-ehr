
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Input sanitization service
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  }

  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    });
  }

  static sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Server-side validation schemas
export const ClientValidationSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  date_of_birth: z.string().optional(),
  phone_numbers: z.array(z.object({
    type: z.enum(['Mobile', 'Home', 'Work', 'Other']),
    number: z.string().regex(/^\+?[\d\s\-\(\)\.]+$/),
    message_preference: z.enum(['No messages', 'Voice messages OK', 'Text messages OK', 'Voice/Text messages OK'])
  })).optional()
});

export const ClinicalNoteValidationSchema = z.object({
  title: z.string().min(1).max(200),
  note_type: z.enum(['intake', 'progress_note', 'treatment_plan', 'cancellation_note', 'contact_note', 'consultation_note', 'miscellaneous_note']),
  content: z.object({}).passthrough(), // Allow any structure for content
  client_id: z.string().uuid(),
  status: z.enum(['draft', 'signed', 'submitted_for_review', 'approved', 'rejected', 'locked']).optional()
});

// Data transformation layer
export class DataTransformer {
  static transformClientData(rawData: any) {
    const sanitized = InputSanitizer.sanitizeObject(rawData);
    const validated = ClientValidationSchema.parse(sanitized);
    
    return {
      ...validated,
      email: validated.email || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  static transformNoteData(rawData: any) {
    const sanitized = InputSanitizer.sanitizeObject(rawData);
    const validated = ClinicalNoteValidationSchema.parse(sanitized);
    
    return {
      ...validated,
      updated_at: new Date().toISOString(),
      version: 1
    };
  }
}
