import React, { useState, useEffect } from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Button } from '@/components/basic/button';
import { Calendar } from '@/components/basic/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basic/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid, differenceInYears } from 'date-fns';

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
  showAge?: boolean;
  showYearDropdown?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = "",
  showAge = false,
  showYearDropdown = false
}) => {
  // Convert database format (YYYY-MM-DD) to display format (M/D/YY) for initial value
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
        return format(date, 'M/d/yy');
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
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Update the display value when value changes (e.g., when editing)
  useEffect(() => {
    setDateInputValue(getDisplayDate(value));
    const calendarDate = getCalendarDate(value);
    if (calendarDate) {
      setCalendarMonth(calendarDate);
      setSelectedYear(calendarDate.getFullYear());
      setSelectedMonth(calendarDate.getMonth() + 1); // Month is 0-indexed
      setSelectedDay(calendarDate.getDate());
    } else {
      setSelectedYear(null);
      setSelectedMonth(null);
      setSelectedDay(null);
    }
  }, [value]);

  // Format date input to MM/DD/YY format
  const formatDateInput = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    if (numbers.length <= 6) return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
    
    // For longer inputs, truncate to 6 digits and format as MM/DD/YY
    const truncated = numbers.slice(0, 6);
    return `${truncated.slice(0, 2)}/${truncated.slice(2, 4)}/${truncated.slice(4)}`;
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Create database format (YYYY-MM-DD) using local date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onChange(formattedDate);
      // Display in M/D/YY format
      setDateInputValue(format(date, 'M/d/yy'));
      setCalendarMonth(date);
      setShowCalendar(false);
    } else {
      onChange('');
      setDateInputValue('');
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Format the input as user types
    const formattedValue = formatDateInput(inputValue);
    setDateInputValue(formattedValue);
    
    // Try to parse the date
    let parsedDate: Date | null = null;
    
    // Try M/D/YYYY format
    if (formattedValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      parsedDate = parse(formattedValue, 'M/d/yyyy', new Date());
    }
    // Try M/D/YY format
    else if (formattedValue.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
      parsedDate = parse(formattedValue, 'M/d/yy', new Date());
    }
    
    if (parsedDate && isValid(parsedDate) && 
        (!maxDate || parsedDate <= maxDate) && 
        (!minDate || parsedDate >= minDate)) {
      // Create database format using local date components
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onChange(formattedDate);
    } else if (formattedValue === '') {
      onChange('');
    }
  };

  const handleYearChange = (year: string) => {
    if (!value) return;
    
    const currentDate = getCalendarDate(value);
    if (currentDate) {
      const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
      if (isValid(newDate)) {
        const formattedDate = `${year}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
        onChange(formattedDate);
        setDateInputValue(format(newDate, 'M/d/yyyy'));
        setCalendarMonth(newDate);
      }
    } else {
      // If no current date, create a new date with the selected year and current month/day
      const today = new Date();
      const newDate = new Date(parseInt(year), today.getMonth(), today.getDate());
      if (isValid(newDate)) {
        setCalendarMonth(newDate);
      }
    }
  };

  const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    const birthDate = getCalendarDate(dob);
    if (!birthDate) return null;
    return differenceInYears(new Date(), birthDate);
  };

  // Helper functions for custom date picker
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  const generateCalendarDays = (year: number, month: number): (number | null)[] => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handleCustomDateChange = (year: number | null, month: number | null, day: number | null) => {
    if (year && month && day) {
      const newDate = new Date(year, month - 1, day); // Month is 0-indexed
      if (isValid(newDate)) {
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(formattedDate);
        setDateInputValue(format(newDate, 'M/d/yy'));
        setCalendarMonth(newDate);
      }
    }
  };

  const dateValue = getCalendarDate(value);
  const age = showAge ? calculateAge(value) : null;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const calendarDays = selectedYear && selectedMonth ? generateCalendarDays(selectedYear, selectedMonth) : [];

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id}>{label}{required && " *"}</Label>
      )}
      <div className="flex gap-2 items-center">
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
            {showYearDropdown ? (
              <div className="p-4 min-w-[320px]">
                <div className="text-sm font-medium mb-3">Select Date</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Year</div>
                    <Select
                      value={selectedYear?.toString() || ''}
                      onValueChange={(value) => {
                        const year = parseInt(value);
                        setSelectedYear(year);
                        handleCustomDateChange(year, selectedMonth, selectedDay);
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Month</div>
                    <Select
                      value={selectedMonth?.toString() || ''}
                      onValueChange={(value) => {
                        const month = parseInt(value);
                        setSelectedMonth(month);
                        // Reset day if it's invalid for the new month
                        const maxDays = getDaysInMonth(selectedYear || new Date().getFullYear(), month);
                        const newDay = selectedDay && selectedDay <= maxDays ? selectedDay : null;
                        setSelectedDay(newDay);
                        handleCustomDateChange(selectedYear, month, newDay);
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month} value={month.toString()}>
                            {format(new Date(2000, month - 1), 'MMM')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {selectedYear && selectedMonth && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Day</div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {/* Day headers */}
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-xs text-gray-500 p-1 font-medium">
                          {day}
                        </div>
                      ))}
                      {/* Calendar days */}
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (day) {
                              setSelectedDay(day);
                              handleCustomDateChange(selectedYear, selectedMonth, day);
                            }
                          }}
                          disabled={!day}
                          className={`
                            h-8 w-8 text-sm rounded-md transition-colors
                            ${!day ? 'invisible' : ''}
                            ${day === selectedDay 
                              ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
                              : 'hover:bg-accent hover:text-accent-foreground'
                            }
                            ${day && day === new Date().getDate() && selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth() + 1
                              ? 'bg-accent text-accent-foreground'
                              : ''
                            }
                          `}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={handleDateChange}
                  defaultMonth={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  disabled={(date) => 
                    (maxDate && date > maxDate) || 
                    (minDate && date < minDate)
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
        {showAge && age !== null && (
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Age: {age}
          </div>
        )}
      </div>
    </div>
  );
}; 