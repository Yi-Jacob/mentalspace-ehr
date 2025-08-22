export interface Diagnosis {
  id: string;
  code: string;
  description: string;
  category: string;
  isActive: boolean;
}

export const availableDiagnoses: Diagnosis[] = [
  // Mood Disorders
  {
    id: '1',
    code: 'F32.1',
    description: 'Major Depressive Disorder, Moderate',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '2',
    code: 'F32.2',
    description: 'Major Depressive Disorder, Severe',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '3',
    code: 'F31.1',
    description: 'Bipolar I Disorder, Current Episode Manic',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '4',
    code: 'F31.2',
    description: 'Bipolar I Disorder, Current Episode Depressed',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '5',
    code: 'F34.1',
    description: 'Persistent Depressive Disorder (Dysthymia)',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '6',
    code: 'F32.9',
    description: 'Unspecified Depressive Disorder',
    category: 'Mood Disorders',
    isActive: true,
  },

  // Anxiety Disorders
  {
    id: '7',
    code: 'F41.1',
    description: 'Generalized Anxiety Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '8',
    code: 'F40.10',
    description: 'Social Anxiety Disorder (Social Phobia)',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '9',
    code: 'F40.00',
    description: 'Agoraphobia',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '10',
    code: 'F41.0',
    description: 'Panic Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '11',
    code: 'F42.8',
    description: 'Obsessive-Compulsive Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '12',
    code: 'F43.1',
    description: 'Posttraumatic Stress Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },

  // Trauma and Stressor-Related Disorders
  {
    id: '13',
    code: 'F43.2',
    description: 'Adjustment Disorder with Depressed Mood',
    category: 'Trauma and Stressor-Related Disorders',
    isActive: true,
  },
  {
    id: '14',
    code: 'F43.21',
    description: 'Adjustment Disorder with Anxiety',
    category: 'Trauma and Stressor-Related Disorders',
    isActive: true,
  },
  {
    id: '15',
    code: 'F43.22',
    description: 'Adjustment Disorder with Mixed Anxiety and Depressed Mood',
    category: 'Trauma and Stressor-Related Disorders',
    isActive: true,
  },

  // Personality Disorders
  {
    id: '16',
    code: 'F60.3',
    description: 'Emotionally Unstable Personality Disorder (Borderline)',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '17',
    code: 'F60.0',
    description: 'Paranoid Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '18',
    code: 'F60.1',
    description: 'Schizoid Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '19',
    code: 'F60.2',
    description: 'Antisocial Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '20',
    code: 'F60.4',
    description: 'Histrionic Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },

  // Substance Use Disorders
  {
    id: '21',
    code: 'F10.20',
    description: 'Alcohol Use Disorder, Moderate',
    category: 'Substance Use Disorders',
    isActive: true,
  },
  {
    id: '22',
    code: 'F10.21',
    description: 'Alcohol Use Disorder, Severe',
    category: 'Substance Use Disorders',
    isActive: true,
  },
  {
    id: '23',
    code: 'F12.20',
    description: 'Cannabis Use Disorder, Moderate',
    category: 'Substance Use Disorders',
    isActive: true,
  },
  {
    id: '24',
    code: 'F19.20',
    description: 'Other Psychoactive Substance Use Disorder, Moderate',
    category: 'Substance Use Disorders',
    isActive: true,
  },

  // Psychotic Disorders
  {
    id: '25',
    code: 'F20.9',
    description: 'Schizophrenia, Unspecified',
    category: 'Psychotic Disorders',
    isActive: true,
  },
  {
    id: '26',
    code: 'F22',
    description: 'Delusional Disorder',
    category: 'Psychotic Disorders',
    isActive: true,
  },
  {
    id: '27',
    code: 'F23',
    description: 'Brief Psychotic Disorder',
    category: 'Psychotic Disorders',
    isActive: true,
  },

  // Eating Disorders
  {
    id: '28',
    code: 'F50.00',
    description: 'Anorexia Nervosa, Restricting Type',
    category: 'Eating Disorders',
    isActive: true,
  },
  {
    id: '29',
    code: 'F50.01',
    description: 'Anorexia Nervosa, Binge-Eating/Purging Type',
    category: 'Eating Disorders',
    isActive: true,
  },
  {
    id: '30',
    code: 'F50.2',
    description: 'Bulimia Nervosa',
    category: 'Eating Disorders',
    isActive: true,
  },
  {
    id: '31',
    code: 'F50.8',
    description: 'Binge-Eating Disorder',
    category: 'Eating Disorders',
    isActive: true,
  },

  // Neurodevelopmental Disorders
  {
    id: '32',
    code: 'F90.1',
    description: 'Attention-Deficit/Hyperactivity Disorder, Predominantly Inattentive Type',
    category: 'Neurodevelopmental Disorders',
    isActive: true,
  },
  {
    id: '33',
    code: 'F90.2',
    description: 'Attention-Deficit/Hyperactivity Disorder, Combined Type',
    category: 'Neurodevelopmental Disorders',
    isActive: true,
  },
  {
    id: '34',
    code: 'F84.0',
    description: 'Autism Spectrum Disorder',
    category: 'Neurodevelopmental Disorders',
    isActive: true,
  },

  // Sleep-Wake Disorders
  {
    id: '35',
    code: 'F51.01',
    description: 'Insomnia Disorder',
    category: 'Sleep-Wake Disorders',
    isActive: true,
  },
  {
    id: '36',
    code: 'F51.11',
    description: 'Hypersomnolence Disorder',
    category: 'Sleep-Wake Disorders',
    isActive: true,
  },
  {
    id: '37',
    code: 'F51.3',
    description: 'Sleepwalking',
    category: 'Sleep-Wake Disorders',
    isActive: true,
  },

  // Dissociative Disorders
  {
    id: '38',
    code: 'F44.0',
    description: 'Dissociative Amnesia',
    category: 'Dissociative Disorders',
    isActive: true,
  },
  {
    id: '39',
    code: 'F44.1',
    description: 'Dissociative Identity Disorder',
    category: 'Dissociative Disorders',
    isActive: true,
  },
  {
    id: '40',
    code: 'F48.1',
    description: 'Depersonalization/Derealization Disorder',
    category: 'Dissociative Disorders',
    isActive: true,
  },

  // Somatic Symptom Disorders
  {
    id: '41',
    code: 'F45.1',
    description: 'Somatic Symptom Disorder',
    category: 'Somatic Symptom Disorders',
    isActive: true,
  },
  {
    id: '42',
    code: 'F45.21',
    description: 'Illness Anxiety Disorder',
    category: 'Somatic Symptom Disorders',
    isActive: true,
  },
  {
    id: '43',
    code: 'F44.4',
    description: 'Conversion Disorder (Functional Neurological Symptom Disorder)',
    category: 'Somatic Symptom Disorders',
    isActive: true,
  },

  // Other Mental Disorders
  {
    id: '44',
    code: 'F63.1',
    description: 'Pyromania',
    category: 'Other Mental Disorders',
    isActive: true,
  },
  {
    id: '45',
    code: 'F63.2',
    description: 'Kleptomania',
    category: 'Other Mental Disorders',
    isActive: true,
  },
  {
    id: '46',
    code: 'F42.8',
    description: 'Trichotillomania (Hair-Pulling Disorder)',
    category: 'Other Mental Disorders',
    isActive: true,
  },
  {
    id: '47',
    code: 'F42.4',
    description: 'Excoriation (Skin-Picking) Disorder',
    category: 'Other Mental Disorders',
    isActive: true,
  },

  // V Codes (Other Conditions)
  {
    id: '48',
    code: 'Z63.0',
    description: 'Relationship Distress with Spouse or Intimate Partner',
    category: 'V Codes',
    isActive: true,
  },
  {
    id: '49',
    code: 'Z63.4',
    description: 'Uncomplicated Bereavement',
    category: 'V Codes',
    isActive: true,
  },
  {
    id: '50',
    code: 'Z65.0',
    description: 'Conviction in Civil or Criminal Proceedings Without Imprisonment',
    category: 'V Codes',
    isActive: true,
  },
];

export const getDiagnosesByCategory = (category: string): Diagnosis[] => {
  return availableDiagnoses.filter(diagnosis => diagnosis.category === category);
};

export const getDiagnosisById = (id: string): Diagnosis | undefined => {
  return availableDiagnoses.find(diagnosis => diagnosis.id === id);
};

export const getDiagnosisByCode = (code: string): Diagnosis | undefined => {
  return availableDiagnoses.find(diagnosis => diagnosis.code === code);
};

export const getDiagnosisCategories = (): string[] => {
  return [...new Set(availableDiagnoses.map(diagnosis => diagnosis.category))];
};
