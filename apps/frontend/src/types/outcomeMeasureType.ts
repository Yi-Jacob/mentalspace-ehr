export interface OutcomeMeasure {
  id: string;
  title: string;
  description?: string;
  sharable: 'sharable' | 'not_sharable';
  accessLevel: 'admin' | 'clinician' | 'billing';
  content: OutcomeMeasureContent;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OutcomeMeasureContent {
  questions: OutcomeQuestion[];
  scoringCriteria: ScoringCriterion[];
}

export interface OutcomeQuestion {
  id: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'scale';
  options: OutcomeOption[];
  required: boolean;
  // Scale-specific properties
  scaleConfig?: {
    minValue: number;
    maxValue: number;
    step: number;
    minLabel?: string;
    maxLabel?: string;
  };
}

export interface OutcomeOption {
  id: string;
  text: string;
  score: number;
}

export interface ScoringCriterion {
  id: string;
  minScore: number;
  maxScore: number;
  label: string;
  description?: string;
  color?: string;
}

export interface CreateOutcomeMeasureDto {
  title: string;
  description?: string;
  sharable?: 'sharable' | 'not_sharable';
  accessLevel?: 'admin' | 'clinician' | 'billing';
  content: OutcomeMeasureContent;
}

export interface UpdateOutcomeMeasureDto {
  title?: string;
  description?: string;
  sharable?: 'sharable' | 'not_sharable';
  accessLevel?: 'admin' | 'clinician' | 'billing';
  content?: OutcomeMeasureContent;
}

export interface OutcomeMeasureResponse {
  id: string;
  clientFileId: string;
  responses: QuestionResponse[];
  totalScore: number;
  criteria: string;
  createdAt: string;
  updatedAt: string;
  clientFile: {
    id: string;
    outcomeMeasure: {
      id: string;
    };
  };
}

export interface QuestionResponse {
  questionId: string;
  selectedOptions: string[];
  score: number;
}
