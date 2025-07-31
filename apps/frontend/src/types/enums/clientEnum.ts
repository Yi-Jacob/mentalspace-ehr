// Client-related enums and options for SelectField components

// Phone Number Types
export const PHONE_TYPE_OPTIONS = [
  { value: "Mobile", label: "Mobile" },
  { value: "Home", label: "Home" },
  { value: "Work", label: "Work" },
  { value: "Other", label: "Other" }
];

export type PhoneType = typeof PHONE_TYPE_OPTIONS[number]['value'];

// Message Preference Options
export const MESSAGE_PREFERENCE_OPTIONS = [
  { value: "No messages", label: "No messages" },
  { value: "Voice messages OK", label: "Voice messages OK" },
  { value: "Text messages OK", label: "Text messages OK" },
  { value: "Voice/Text messages OK", label: "Voice/Text messages OK" }
];

export type MessagePreference = typeof MESSAGE_PREFERENCE_OPTIONS[number]['value'];

// Insurance Types
export const INSURANCE_TYPE_OPTIONS = [
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" }
];

export type InsuranceType = typeof INSURANCE_TYPE_OPTIONS[number]['value'];

// Subscriber Relationship Options
export const SUBSCRIBER_RELATIONSHIP_OPTIONS = [
  { value: "Self", label: "Self" },
  { value: "Spouse", label: "Spouse" },
  { value: "Child", label: "Child" },
  { value: "Parent", label: "Parent" },
  { value: "Other", label: "Other" }
];

export type SubscriberRelationship = typeof SUBSCRIBER_RELATIONSHIP_OPTIONS[number]['value'];

// Administrative Sex Options
export const ADMINISTRATIVE_SEX_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Unknown", label: "Unknown" }
];

export type AdministrativeSex = typeof ADMINISTRATIVE_SEX_OPTIONS[number]['value'];

// Gender Identity Options
export const GENDER_IDENTITY_OPTIONS = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Trans Woman", label: "Trans Woman" },
  { value: "Trans Man", label: "Trans Man" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Something else", label: "Something else" },
  { value: "Unknown", label: "Unknown" },
  { value: "Choose not to disclose", label: "Choose not to disclose" }
];

export type GenderIdentity = typeof GENDER_IDENTITY_OPTIONS[number]['value'];

// Sexual Orientation Options
export const SEXUAL_ORIENTATION_OPTIONS = [
  { value: "Asexual", label: "Asexual" },
  { value: "Bisexual", label: "Bisexual" },
  { value: "Lesbian or Gay", label: "Lesbian or Gay" },
  { value: "Straight", label: "Straight" },
  { value: "Something else", label: "Something else" },
  { value: "Unknown", label: "Unknown" },
  { value: "Choose not to disclose", label: "Choose not to disclose" }
];

export type SexualOrientation = typeof SEXUAL_ORIENTATION_OPTIONS[number]['value'];

// Race Options (OMB Standards)
export const RACE_OPTIONS = [
  { value: "American Indian or Alaska Native", label: "American Indian or Alaska Native" },
  { value: "Asian", label: "Asian" },
  { value: "Black or African American", label: "Black or African American" },
  { value: "Native Hawaiian or Other Pacific Islander", label: "Native Hawaiian or Other Pacific Islander" },
  { value: "White", label: "White" },
  { value: "Two or More Races", label: "Two or More Races" },
  { value: "Other", label: "Other" },
  { value: "Unknown", label: "Unknown" },
  { value: "Choose not to disclose", label: "Choose not to disclose" }
];

export type Race = typeof RACE_OPTIONS[number]['value'];

// Ethnicity Options
export const ETHNICITY_OPTIONS = [
  { value: "Hispanic or Latino", label: "Hispanic or Latino" },
  { value: "Not Hispanic or Latino", label: "Not Hispanic or Latino" },
  { value: "Unknown", label: "Unknown" },
  { value: "Choose not to disclose", label: "Choose not to disclose" }
];

export type Ethnicity = typeof ETHNICITY_OPTIONS[number]['value'];

// Language Options
export const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Chinese (Mandarin)", label: "Chinese (Mandarin)" },
  { value: "Chinese (Cantonese)", label: "Chinese (Cantonese)" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Arabic", label: "Arabic" },
  { value: "Hindi", label: "Hindi" },
  { value: "Tagalog", label: "Tagalog" },
  { value: "American Sign Language (ASL)", label: "American Sign Language (ASL)" },
  { value: "Other", label: "Other" },
  { value: "Unknown", label: "Unknown" }
];

export type Language = typeof LANGUAGE_OPTIONS[number]['value'];

// Marital Status Options
export const MARITAL_STATUS_OPTIONS = [
  { value: "Unmarried", label: "Unmarried" },
  { value: "Married", label: "Married" },
  { value: "Domestic Partner", label: "Domestic Partner" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
  { value: "Legally Separated", label: "Legally Separated" },
  { value: "Interlocutory Decree", label: "Interlocutory Decree" },
  { value: "Annulled", label: "Annulled" },
  { value: "Something else", label: "Something else" },
  { value: "Choose not to disclose", label: "Choose not to disclose" }
];

export type MaritalStatus = typeof MARITAL_STATUS_OPTIONS[number]['value'];

// Employment Status Options
export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "Full-time employed", label: "Full-time employed" },
  { value: "Part-time employed", label: "Part-time employed" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Contract, per diem", label: "Contract, per diem" },
  { value: "Full-time student", label: "Full-time student" },
  { value: "Part-time student", label: "Part-time student" },
  { value: "On active military duty", label: "On active military duty" },
  { value: "Retired", label: "Retired" },
  { value: "Leave of absence", label: "Leave of absence" },
  { value: "Temporarily unemployed", label: "Temporarily unemployed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Something else", label: "Something else" }
];

export type EmploymentStatus = typeof EMPLOYMENT_STATUS_OPTIONS[number]['value'];

// Religious Affiliation Options
export const RELIGIOUS_AFFILIATION_OPTIONS = [
  { value: "None", label: "None" },
  { value: "Agnostic", label: "Agnostic" },
  { value: "Atheist", label: "Atheist" },
  { value: "Buddhist", label: "Buddhist" },
  { value: "Catholic", label: "Catholic" },
  { value: "Christian (Protestant)", label: "Christian (Protestant)" },
  { value: "Eastern Orthodox", label: "Eastern Orthodox" },
  { value: "Hindu", label: "Hindu" },
  { value: "Jewish", label: "Jewish" },
  { value: "Muslim", label: "Muslim" },
  { value: "Mormon", label: "Mormon" },
  { value: "Jehovah's Witness", label: "Jehovah's Witness" },
  { value: "Sikh", label: "Sikh" },
  { value: "Spiritual but not religious", label: "Spiritual but not religious" },
  { value: "Other", label: "Other" },
  { value: "Unknown", label: "Unknown" },
  { value: "Choose not to disclose", label: "Choose not to disclose" }
];

export type ReligiousAffiliation = typeof RELIGIOUS_AFFILIATION_OPTIONS[number]['value'];

// Smoking Status Options
export const SMOKING_STATUS_OPTIONS = [
  { value: "Current smoker: Every day", label: "Current smoker: Every day" },
  { value: "Current smoker: Some days", label: "Current smoker: Some days" },
  { value: "Former smoker", label: "Former smoker" },
  { value: "Never smoker", label: "Never smoker" },
  { value: "Chose not to disclose", label: "Chose not to disclose" }
];

export type SmokingStatus = typeof SMOKING_STATUS_OPTIONS[number]['value'];

// Appointment Reminders Options
export const APPOINTMENT_REMINDERS_OPTIONS = [
  { value: "Default Practice Setting", label: "Default Practice Setting" },
  { value: "No reminders", label: "No reminders" },
  { value: "Email only", label: "Email only" },
  { value: "Text (SMS) only", label: "Text (SMS) only" },
  { value: "Text (SMS) and Email", label: "Text (SMS) and Email" },
  { value: "Text or Call, and Email", label: "Text or Call, and Email" }
];

export type AppointmentReminders = typeof APPOINTMENT_REMINDERS_OPTIONS[number]['value'];

// PCP Release Options
export const PCP_RELEASE_OPTIONS = [
  { value: "Not set", label: "Not set" },
  { value: "Patient consented to release information", label: "Patient consented to release information" },
  { value: "Patient declined to release information", label: "Patient declined to release information" },
  { value: "Not applicable", label: "Not applicable" }
];

export type PcpRelease = typeof PCP_RELEASE_OPTIONS[number]['value'];

// US States Options
export const US_STATES_OPTIONS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
  'WV', 'WI', 'WY'
].map(state => ({ value: state, label: state }));

export type UsState = typeof US_STATES_OPTIONS[number]['value'];

// Timezone Options
export const TIMEZONE_OPTIONS = [
  { value: 'Not Set', label: 'Not Set (Use practice time zone)' },
  { value: 'HAST', label: 'HAST - Hawaii Aleutian Time, UTC-10 with DST' },
  { value: 'HAT', label: 'HAT - Hawaii Time, UTC-10 no DST' },
  { value: 'MART', label: 'MART - Marquesas Islands, UTC-9:30 no DST' },
  { value: 'AKT', label: 'AKT - Alaska Time, UTC-9 with DST' },
  { value: 'GAMT', label: 'GAMT - Gambier Islands Time, UTC-9 no DST' },
  { value: 'PT', label: 'PT - Pacific Time, UTC-8 with DST' },
  { value: 'PST', label: 'PST - Pacific Standard Time, UTC-8 no DST' },
  { value: 'MT', label: 'MT - Mountain Time, UTC-7 with DST' },
  { value: 'ART', label: 'ART - Arizona Mountain Time, UTC-7 no DST' },
  { value: 'CT', label: 'CT - Central Time, UTC-6 with DST' },
  { value: 'CST', label: 'CST - Cape Verde Time 1, UTC-6 no DST' },
  { value: 'ET', label: 'ET - Eastern Time, UTC-5 with DST' },
  { value: 'EST', label: 'EST - Quintana, Roo, Jamaica, Panama, UTC-5 no DST' },
  { value: 'AT', label: 'AT - Atlantic Time, UTC-4 with DST' },
  { value: 'AST', label: 'AST - Atlantic Standard Time, UTC-4 no DST' },
  { value: 'NT', label: 'NT - Newfoundland Time, UTC-3:30 no DST' },
  { value: 'EGT/EGST', label: 'EGT/EGST - East Greenland Time, UTC-1 with DST' },
  { value: 'CVT', label: 'CVT - Cape Verde Time 2, UTC-1 no DST' },
];

export type Timezone = typeof TIMEZONE_OPTIONS[number]['value']; 