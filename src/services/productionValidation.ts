import { ENV_CONFIG } from './environmentConfig';
import { productionLogger } from './productionLogging';

interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'date' | 'uuid';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export class ProductionValidator {
  private static instance: ProductionValidator;
  
  public static getInstance(): ProductionValidator {
    if (!ProductionValidator.instance) {
      ProductionValidator.instance = new ProductionValidator();
    }
    return ProductionValidator.instance;
  }

  // HIPAA-compliant data validation
  validateClientData(data: any): ValidationResult {
    const rules: ValidationRule[] = [
      { field: 'first_name', required: true, type: 'string', minLength: 1, maxLength: 50 },
      { field: 'last_name', required: true, type: 'string', minLength: 1, maxLength: 50 },
      { field: 'email', type: 'email', maxLength: 255 },
      { field: 'date_of_birth', type: 'date' },
      { field: 'phone_number', type: 'phone' },
    ];

    return this.validateData(data, rules, 'client_data');
  }

  // Clinical notes validation
  validateClinicalNote(data: any): ValidationResult {
    const rules: ValidationRule[] = [
      { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 200 },
      { field: 'content', required: true },
      { field: 'client_id', required: true, type: 'uuid' },
      { field: 'note_type', required: true, type: 'string' },
      { field: 'provider_id', required: true, type: 'uuid' }
    ];

    return this.validateData(data, rules, 'clinical_note');
  }

  // Appointment validation
  validateAppointment(data: any): ValidationResult {
    const rules: ValidationRule[] = [
      { field: 'client_id', required: true, type: 'uuid' },
      { field: 'provider_id', required: true, type: 'uuid' },
      { field: 'start_time', required: true, type: 'date' },
      { field: 'end_time', required: true, type: 'date' },
      { field: 'appointment_type', required: true, type: 'string' },
      { 
        field: 'end_time', 
        custom: (data) => {
          const start = new Date(data.start_time);
          const end = new Date(data.end_time);
          return end > start || 'End time must be after start time';
        }
      }
    ];

    return this.validateData(data, rules, 'appointment');
  }

  // User/Staff validation
  validateStaffData(data: any): ValidationResult {
    const rules: ValidationRule[] = [
      { field: 'first_name', required: true, type: 'string', minLength: 1, maxLength: 50 },
      { field: 'last_name', required: true, type: 'string', minLength: 1, maxLength: 50 },
      { field: 'email', required: true, type: 'email', maxLength: 255 },
      { field: 'roles', required: true },
      { field: 'employee_id', type: 'string', maxLength: 50 },
      { field: 'npi_number', type: 'string', pattern: /^\d{10}$/ }
    ];

    return this.validateData(data, rules, 'staff_data');
  }

  // Generic validation engine
  private validateData(data: any, rules: ValidationRule[], context: string): ValidationResult {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    // Log validation attempt
    productionLogger.debug(`Validating ${context}`, { 
      fields: rules.map(r => r.field),
      dataKeys: Object.keys(data || {})
    });

    if (!data || typeof data !== 'object') {
      errors.general = 'Invalid data format';
      return { isValid: false, errors, warnings };
    }

    for (const rule of rules) {
      const value = data[rule.field];
      const fieldError = this.validateField(value, rule);
      
      if (fieldError) {
        errors[rule.field] = fieldError;
      }
    }

    // Additional security checks in production
    if (ENV_CONFIG.app.environment === 'production') {
      this.performSecurityChecks(data, context, warnings);
    }

    const isValid = Object.keys(errors).length === 0;
    
    // Log validation result
    if (!isValid) {
      productionLogger.warn(`Validation failed for ${context}`, { errors, data: this.sanitizeForLogging(data) });
    } else if (Object.keys(warnings).length > 0) {
      productionLogger.info(`Validation passed with warnings for ${context}`, { warnings });
    }

    return { isValid, errors, warnings };
  }

  private validateField(value: any, rule: ValidationRule): string | null {
    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      return `${rule.field} is required`;
    }

    // Skip other checks if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return null;
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(value, rule.type, rule.field);
      if (typeError) return typeError;
    }

    // Length validation
    if (rule.minLength && String(value).length < rule.minLength) {
      return `${rule.field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && String(value).length > rule.maxLength) {
      return `${rule.field} must not exceed ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return `${rule.field} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === 'string') {
        return customResult;
      }
      if (customResult === false) {
        return `${rule.field} validation failed`;
      }
    }

    return null;
  }

  private validateType(value: any, type: string, field: string): string | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return `${field} must be a string`;
        }
        break;
        
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return `${field} must be a valid number`;
        }
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          return `${field} must be a boolean`;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return `${field} must be a valid email address`;
        }
        break;
        
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)\.]+$/;
        if (!phoneRegex.test(String(value))) {
          return `${field} must be a valid phone number`;
        }
        break;
        
      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return `${field} must be a valid date`;
        }
        break;
        
      case 'uuid':
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(value))) {
          return `${field} must be a valid UUID`;
        }
        break;
    }
    
    return null;
  }

  private performSecurityChecks(data: any, context: string, warnings: Record<string, string>) {
    // Check for potential XSS attempts
    const xssPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        for (const pattern of xssPatterns) {
          if (pattern.test(value)) {
            warnings[key] = 'Potentially unsafe content detected';
            productionLogger.warn('Security: Potential XSS attempt detected', {
              field: key,
              context,
              pattern: pattern.toString()
            });
            break;
          }
        }
      }
    }

    // Check for SQL injection patterns
    const sqlPatterns = [/union\s+select/i, /drop\s+table/i, /insert\s+into/i];
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            warnings[key] = 'Potentially unsafe database query detected';
            productionLogger.error('Security: Potential SQL injection attempt', {
              field: key,
              context,
              pattern: pattern.toString()
            });
            break;
          }
        }
      }
    }
  }

  private sanitizeForLogging(data: any): any {
    const sensitiveFields = [
      'password', 'ssn', 'social_security_number', 'credit_card',
      'date_of_birth', 'dob', 'phone_number', 'email'
    ];

    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}

export const productionValidator = ProductionValidator.getInstance();