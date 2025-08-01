import { format } from 'date-fns';

export const formatDateOfBirth = (dateOfBirth: string | null): string => {
  if (!dateOfBirth) return '';
  
  // Parse the database date as YYYY-MM-DD and create a local date
  const parts = dateOfBirth.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // months are 0-indexed
    const day = parseInt(parts[2]);
    const date = new Date(year, month, day);
    
    return format(date, 'M/d/yyyy');
  }
  return dateOfBirth;
};

export const formatAge = (dateOfBirth: string | null): string => {
  if (!dateOfBirth) return '';
  
  // Parse the database date as YYYY-MM-DD and create a local date
  const parts = dateOfBirth.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // months are 0-indexed
    const day = parseInt(parts[2]);
    const birthDate = new Date(year, month, day);
    
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return `${age - 1} years`;
    }
    return `${age} years`;
  }
  return '';
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not provided';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null) return 'Not provided';
  return `$${amount}`;
}; 