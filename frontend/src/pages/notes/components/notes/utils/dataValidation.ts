import { Note } from '@/types/note';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateNote = (note: Partial<Note>): ValidationResult => {
  const errors: string[] = [];

  // Required fields validation
  if (!note.title || note.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!note.clientId) {
    errors.push('Client ID is required');
  }

  if (!note.noteType) {
    errors.push('Note type is required');
  }

  if (!note.content) {
    errors.push('Note content is required');
  }

  // Title length validation
  if (note.title && note.title.length > 255) {
    errors.push('Title must be less than 255 characters');
  }

  // Status validation
  const validStatuses = ['draft', 'signed', 'submitted_for_review', 'locked'];
  if (note.status && !validStatuses.includes(note.status)) {
    errors.push('Invalid status value');
  }

  // Note type validation
  const validNoteTypes = [
    'intake',
    'progress_note',
    'treatment_plan',
    'contact_note',
    'consultation_note',
    'cancellation_note',
    'miscellaneous_note'
  ];
  if (note.noteType && !validNoteTypes.includes(note.noteType)) {
    errors.push('Invalid note type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateNoteContent = (content: any): ValidationResult => {
  const errors: string[] = [];

  if (!content || typeof content !== 'object') {
    errors.push('Content must be an object');
    return { isValid: false, errors };
  }

  // Add specific content validation rules here based on note type
  // For example, check required fields for different note types

  return {
    isValid: errors.length === 0,
    errors
  };
};
