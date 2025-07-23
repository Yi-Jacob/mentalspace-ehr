
import { FileText, Clipboard, Calendar, Phone, Users, Stethoscope, ClipboardList } from 'lucide-react';

export const noteTypes = [
  {
    type: 'intake',
    title: 'Intake Assessment',
    description: 'Comprehensive initial assessment for new clients',
    icon: ClipboardList,
    color: 'bg-blue-600',
  },
  {
    type: 'progress_note',
    title: 'Progress Note',
    description: 'Document therapy session progress and interventions',
    icon: FileText,
    color: 'bg-green-600',
  },
  {
    type: 'treatment_plan',
    title: 'Treatment Plan',
    description: 'Create and update comprehensive treatment plans',
    icon: Clipboard,
    color: 'bg-purple-600',
  },
  {
    type: 'cancellation_note',
    title: 'Cancellation Note',
    description: 'Document session cancellations and reasons',
    icon: Calendar,
    color: 'bg-orange-600',
  },
  {
    type: 'contact_note',
    title: 'Contact Note',
    description: 'Record brief client contacts and communications',
    icon: Phone,
    color: 'bg-teal-600',
  },
  {
    type: 'consultation_note',
    title: 'Consultation Note',
    description: 'Document consultations with other providers',
    icon: Users,
    color: 'bg-indigo-600',
  },
  {
    type: 'miscellaneous_note',
    title: 'Miscellaneous Note',
    description: 'General notes for other clinical activities',
    icon: Stethoscope,
    color: 'bg-gray-600',
  },
];
