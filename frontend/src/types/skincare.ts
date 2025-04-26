export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  size: number;
  unit: string;
  keyIngredients: string[];
  isNatural: boolean;
  isGentle: boolean;
  score?: number;
  scoreBreakdown?: {
    skinTypeMatch: number;
    concernMatch: number;
    lifestyleCompatibility: number;
    environmentalAdaptation: number;
    userPreferences: number;
    routineCompatibility: number;
    priceMatch: number;
  };
}

export interface RoutineStep {
  id: string;
  order: number;
  time: string;
  notes: string;
  product: Product;
}

export interface Routine {
  id: string;
  name: string;
  isActive: boolean;
  steps: RoutineStep[];
}

export interface LifestyleFactors {
  hydration: string;
  sleep: string;
  sunExposure: string;
  stress: string;
  diet: string;
  environment: string;
  airConditioning: string;
}

export interface SkinProfile {
  skinType: string;
  concerns: string[];
  allergies: string[];
  currentRoutine: string;
  lifestyleFactors: LifestyleFactors;
  recommendations: {
    immediate: string[];
    lifestyle: string[];
    products: Product[];
  };
}

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'YES_NO' | 'NUMERICAL' | 'RATING';
  options: string[];
  category: 'SKIN_TYPE' | 'CONCERNS' | 'LIFESTYLE' | 'PREFERENCES';
  order: number;
}

export interface QuestionnaireResponse {
  questionId: string;
  answer: string;
}

export interface UserResponse {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  question: QuestionnaireQuestion;
}

export interface ProductFeedback {
  id: number;
  userId: number;
  productId: number;
  usage: 'As recommended' | 'Less often than recommended' | 'I stopped using it';
  discomfort: boolean;
  discomfortImproving?: boolean;
  positiveChanges?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineFeedback {
  id: number;
  userId: number;
  routineId: number;
  satisfaction: 'Very satisfied' | 'Satisfied' | 'Neutral' | 'Unsatisfied' | 'Very unsatisfied';
  skinChanges: boolean;
  easeOfUse: 'Yes' | 'Somewhat' | 'No';
  unnecessaryProductId?: number;
  unnecessaryProduct?: Product;
  primaryConcern: string;
  routinePreference: 'Keep the same routine' | 'Make small adjustments' | 'Start a new routine';
  createdAt: string;
  updatedAt: string;
}