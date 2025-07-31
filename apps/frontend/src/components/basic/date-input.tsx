import React, { useState, useEffect } from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Button } from '@/components/basic/button';
import { Calendar } from '@/components/basic/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basic/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

interface DateInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  required = false,
  disabled = false,
  minDate = new Date("1900-01-01"),
  maxDate = new Date(),
  className = ""
}) => {
  // Convert database format (YYYY-MM-DD) to display format (M/D/YYYY) for initial value
  const getDisplayDate = (dbDate: string) => {
    if (!dbDate) return '';
    // Parse the database date as YYYY-MM-DD and create a local date
    const parts = dbDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);
      if (isValid(date)) {
        return format(date, 'M/d/yyyy');
      }
    }
    return '';
  };

  // Convert database format to Date object for calendar
  const getCalendarDate = (dbDate: string) => {
    if (!dbDate) return undefined;
    const parts = dbDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);
      if (isValid(date)) {
        return date;
      }
    }
    return undefined;
  };

  const [dateInputValue, setDateInputValue] = useState(getDisplayDate(value));
  const [showCalendar, setShowCalendar] = useState(false);

  // Update the display value when value changes (e.g., when editing)
  useEffect(() => {
    setDateInputValue(getDisplayDate(value));
  }, [value]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Create database format (YYYY-MM-DD) using local date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onChange(formattedDate);
      // Display in M/D/YYYY format
      setDateInputValue(format(date, 'M/d/yyyy'));
      setShowCalendar(false);
    } else {
      onChange('');
      setDateInputValue('');
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDateInputValue(inputValue);
    
    // Try to parse the date in M/D/Y format
    let parsedDate: Date | null = null;
    
    // Try M/D/YYYY format
    if (inputValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      parsedDate = parse(inputValue, 'M/d/yyyy', new Date());
    }
    // Try M/D/YY format
    else if (inputValue.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
      parsedDate = parse(inputValue, 'M/d/yy', new Date());
    }
    
    if (parsedDate && isValid(parsedDate) && parsedDate <= maxDate && parsedDate >= minDate) {
      // Create database format using local date components
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onChange(formattedDate);
    } else if (inputValue === '') {
      onChange('');
    }
  };

  const dateValue = getCalendarDate(value);

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id}>{label}{required && " *"}</Label>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          value={dateInputValue}
          onChange={handleDateInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="flex-1"
        />
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateChange}
              disabled={(date) => date > maxDate || date < minDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}; 