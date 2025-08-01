export interface UserProfile {
    name: string;
    email: string;
}

export interface SymptomData {
  symptomTitle: string;
  definition: string;
  technicalInfo?: {
    embryonicLayer?: string;
    conflictType?: string;
    diseasePhaseBehavior?: string;
  };
  biologicalMeaning: string;
  conflicts: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export interface Technique {
    id: string;
    name: string;
    category: string;
    description: string;
}

export type Locale = 'es' | 'en' | 'fr' | 'it' | 'zh';
