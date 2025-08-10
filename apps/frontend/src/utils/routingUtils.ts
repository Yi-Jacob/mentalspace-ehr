import { Note } from '@/types/noteType';

/**
 * Helper function to get the correct route based on note type
 * @param note - The note object containing id and noteType
 * @param isEdit - Whether this is for editing (adds /edit to the route)
 * @returns The correct route string for the note
 */
export const getNoteRoute = (note: Note, isEdit: boolean = false): string => {
  const separator = isEdit ? '/edit' : '';
  
  switch (note.noteType) {
    case 'progress_note':
      return `/notes/progress-note/${note.id}${separator}`;
    case 'intake':
      return `/notes/intake/${note.id}${separator}`;
    case 'treatment_plan':
      return `/notes/treatment-plan/${note.id}${separator}`;
    case 'cancellation_note':
      return `/notes/cancellation-note/${note.id}${separator}`;
    case 'contact_note':
      return `/notes/contact-note/${note.id}${separator}`;
    case 'consultation_note':
      return `/notes/consultation-note/${note.id}${separator}`;
    case 'miscellaneous_note':
      return `/notes/miscellaneous-note/${note.id}${separator}`;
    default:
      // Fallback to generic route
      return `/notes/note/${note.id}${separator}`;
  }
};
