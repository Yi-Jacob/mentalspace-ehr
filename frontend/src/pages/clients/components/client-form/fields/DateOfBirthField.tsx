
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';
import { Button } from '@/components/shared/ui/button';
import { Calendar } from '@/components/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shared/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { ClientFormData } from '@/types/client';

interface DateOfBirthFieldProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const DateOfBirthField: React.FC<DateOfBirthFieldProps> = ({ formData, setFormData }) => {
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

  const [dateInputValue, setDateInputValue] = useState(getDisplayDate(formData.date_of_birth));
  const [showCalendar, setShowCalendar] = useState(false);

  // Update the display value when formData changes (e.g., when editing a client)
  useEffect(() => {
    setDateInputValue(getDisplayDate(formData.date_of_birth));
  }, [formData.date_of_birth]);

  const handleDateOfBirthChange = (date: Date | undefined) => {
    if (date) {
      // Create database format (YYYY-MM-DD) using local date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log('Calendar date selected:', date);
      console.log('Formatted for database:', formattedDate);
      
      setFormData(prev => ({...prev, date_of_birth: formattedDate}));
      // Display in M/D/YYYY format
      setDateInputValue(format(date, 'M/d/yyyy'));
      setShowCalendar(false);
    } else {
      setFormData(prev => ({...prev, date_of_birth: ''}));
      setDateInputValue('');
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    // Try to parse the date in M/D/Y format
    let parsedDate: Date | null = null;
    
    // Try M/D/YYYY format
    if (value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      parsedDate = parse(value, 'M/d/yyyy', new Date());
    }
    // Try M/D/YY format
    else if (value.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
      parsedDate = parse(value, 'M/d/yy', new Date());
    }
    
    if (parsedDate && isValid(parsedDate) && parsedDate <= new Date() && parsedDate >= new Date("1900-01-01")) {
      // Create database format using local date components
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log('Input date parsed:', parsedDate);
      console.log('Formatted for database:', formattedDate);
      
      setFormData(prev => ({...prev, date_of_birth: formattedDate}));
    } else if (value === '') {
      setFormData(prev => ({...prev, date_of_birth: ''}));
    }
  };

  const dateOfBirthValue = getCalendarDate(formData.date_of_birth);

  return (
    <div>
      <Label htmlFor="date_of_birth">Date of Birth</Label>
      <div className="flex gap-2">
        <Input
          id="date_of_birth"
          type="text"
          value={dateInputValue}
          onChange={handleDateInputChange}
          placeholder="M/D/YYYY"
          className="flex-1"
        />
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateOfBirthValue}
              onSelect={handleDateOfBirthChange}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
