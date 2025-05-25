
import { FileText, Clock } from 'lucide-react';

export const noteTypes = [
  {
    type: 'intake',
    title: 'Intake Assessment',
    description: 'Comprehensive initial evaluation and assessment',
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    type: 'progress_note',
    title: 'Progress Note',
    description: 'Session documentation in SOAP or DAP format',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    type: 'treatment_plan',
    title: 'Treatment Plan',
    description: 'Goals, objectives, and intervention strategies',
    icon: FileText,
    color: 'bg-purple-500'
  },
  {
    type: 'cancellation_note',
    title: 'Cancellation Note',
    description: 'Missed appointments and cancellation documentation',
    icon: Clock,
    color: 'bg-orange-500'
  },
  {
    type: 'contact_note',
    title: 'Contact Note',
    description: 'Phone calls, emails, and other communications',
    icon: FileText,
    color: 'bg-cyan-500'
  },
  {
    type: 'consultation_note',
    title: 'Consultation Note',
    description: 'Professional consultations and case discussions',
    icon: FileText,
    color: 'bg-indigo-500'
  },
  {
    type: 'miscellaneous_note',
    title: 'Miscellaneous Note',
    description: 'Other clinical documentation needs',
    icon: FileText,
    color: 'bg-gray-500'
  }
];
