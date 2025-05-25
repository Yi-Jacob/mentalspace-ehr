
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { ClientFormData } from '@/types/client';

interface DateOfBirthFieldProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const DateOfBirthField: React.FC<DateOfBirthFieldProps> = ({ formData, setFormData }) => {
  // Convert database format (YYYY-MM-DD) to display format (M/D/Y) for initial value
  const getDisplayDate = (dbDate: string) => {
    if (!dbDate) return '';
    const date = new Date(dbDate);
    if (isValid(date)) {
      return format(date, 'M/d/yyyy');
    }
    return '';
  };

  const [dateInputValue, setDateInputValue] = useState(getDisplayDate(formData.date_of_birth));
  const [showCalendar, setShowCalendar] = useState(false);

  // Update the display value when formData changes (e.g., when editing a client)
  useEffect(() => {
    setDateInputValue(getDisplayDate(formData.date_of_birth));
  }, [formData.date_of_birth]);

  const handleDateOfBirthChange = (date: Date | undefined) => {
    if (date) {
      // Use local date formatting to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      setFormData(prev => ({...prev, date_of_birth: formattedDate}));
      // Display in M/D/Y format
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
      // Use the same local date formatting method
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFormData(prev => ({...prev, date_of_birth: formattedDate}));
    } else if (value === '') {
      setFormData(prev => ({...prev, date_of_birth: ''}));
    }
  };

  const dateOfBirthValue = formData.date_of_birth ? new Date(formData.date_of_birth + 'T00:00:00') : undefined;

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
