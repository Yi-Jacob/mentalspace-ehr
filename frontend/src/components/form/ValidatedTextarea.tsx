
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/shared/ui/textarea';
import { Label } from '@/components/shared/ui/label';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { sanitizeInput, validateField } from '@/utils/validation';
import { cn } from '@/lib/utils';

interface ValidatedTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  validation: z.ZodSchema;
  sanitizer?: (value: string) => string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  onValidationChange,
  validation,
  sanitizer = sanitizeInput.text,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  maxLength = 2000,
  className,
}) => {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (touched || value) {
      const result = validateField(value, validation);
      setIsValid(result.isValid);
      setError(result.error || '');
      onValidationChange?.(result.isValid, result.error);
    }
  }, [value, validation, touched, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizer(e.target.value);
    onChange(sanitizedValue);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showError = touched && !isValid && error;
  const showSuccess = touched && isValid && value;
  const characterCount = value.length;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <span className={cn(
          'text-xs',
          characterCount > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-500'
        )}>
          {characterCount}/{maxLength}
        </span>
      </div>
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            'pr-8',
            showError && 'border-red-500 focus:border-red-500',
            showSuccess && 'border-green-500 focus:border-green-500'
          )}
        />
        {showError && (
          <AlertCircle className="absolute right-2 top-2 h-4 w-4 text-red-500" />
        )}
        {showSuccess && (
          <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-green-500" />
        )}
      </div>
      {showError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ValidatedTextarea;
