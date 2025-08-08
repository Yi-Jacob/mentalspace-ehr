
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { sanitizeInput, validateField } from '@/utils/validation';
import { cn } from '@/utils/utils';

interface ValidatedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  validation: z.ZodSchema;
  sanitizer?: (value: string) => string;
  type?: 'text' | 'email' | 'tel' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  value,
  onChange,
  onValidationChange,
  validation,
  sanitizer = sanitizeInput.text,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className,
}) => {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const prevValidationRef = useRef<{ value: string; isValid: boolean; error: string }>({
    value: '',
    isValid: true,
    error: ''
  });
  const onValidationChangeRef = useRef(onValidationChange);

  // Update the ref when onValidationChange changes
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  useEffect(() => {
    if (touched || value) {
      const result = validateField(value, validation);
      const newIsValid = result.isValid;
      const newError = result.error || '';
      
      // Only update state if values have actually changed
      if (
        prevValidationRef.current.value !== value ||
        prevValidationRef.current.isValid !== newIsValid ||
        prevValidationRef.current.error !== newError
      ) {
        setIsValid(newIsValid);
        setError(newError);
        onValidationChangeRef.current?.(newIsValid, newError);
        
        // Update the ref with current values
        prevValidationRef.current = {
          value,
          isValid: newIsValid,
          error: newError
        };
      }
    }
  }, [value, validation, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizer(e.target.value);
    onChange(sanitizedValue);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showError = touched && !isValid && error;
  const showSuccess = touched && isValid && value;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pr-8',
            showError && 'border-red-500 focus:border-red-500',
            showSuccess && 'border-green-500 focus:border-green-500'
          )}
        />
        {showError && (
          <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
        )}
        {showSuccess && (
          <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
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

export default ValidatedInput;
