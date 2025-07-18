
import { z } from 'zod';

// Input sanitization utilities
export const sanitizeInput = {
  text: (input: string): string => {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .slice(0, 500); // Limit length
  },
  
  email: (input: string): string => {
    if (!input) return '';
    return input.trim().toLowerCase().slice(0, 254);
  },
  
  phone: (input: string): string => {
    if (!input) return '';
    return input.replace(/[^\d\-\(\)\+\s\.]/g, '').slice(0, 20);
  },
  
  name: (input: string): string => {
    if (!input) return '';
    return input
      .trim()
      .replace(/[^a-zA-Z\s\-\'\.]/g, '') // Only allow letters, spaces, hyphens, apostrophes, periods
      .slice(0, 50);
  },
  
  address: (input: string): string => {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>]/g, '')
      .slice(0, 100);
  }
};

// Validation schemas
export const validationSchemas = {
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
    
  phone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length >= 10 && cleaned.length <= 15;
    }, 'Please enter a valid phone number'),
    
  name: z.string()
    .min(1, 'This field is required')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s\-\'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
    
  date: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, 'Please enter a valid date'),
    
  zipCode: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^\d{5}(-\d{4})?$/.test(val);
    }, 'Please enter a valid ZIP code'),
    
  textArea: z.string()
    .max(2000, 'Text is too long (maximum 2000 characters)')
    .optional(),
    
  requiredText: z.string()
    .min(1, 'This field is required')
    .max(2000, 'Text is too long (maximum 2000 characters)')
};

// Real-time validation helper
export const validateField = (value: string, schema: z.ZodSchema): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid input' };
  }
};

// Form validation helper
export const validateForm = (data: Record<string, any>, schema: z.ZodSchema): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};
