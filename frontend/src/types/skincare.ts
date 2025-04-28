export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  isNatural?: boolean;
  isGentle?: boolean;
  price?: number;
  size?: number;
  unit?: string;
  skinType: string[];
  targetConcerns: string[];
  keyIngredients: string[];
  ingredients: string[];
  isDay?: boolean;
  isNight?: boolean;
  feedback: Feedback[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
}

export interface RoutineStep {
  id: number;
  routineId: number;
  productId: number;
  product: Product;
  defaultProductId?: number;
  defaultProduct?: Product;
  order: number;
  time?: string;
  categoryName?: string;
  notes?: string;
  alternatives: StepAlternative[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRoutine {
  id: number;
  userId: number;
  name: string;
  isActive: boolean;
  steps: RoutineStep[];
  createdAt: Date;
  updatedAt: Date;
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

export interface StepAlternative {
  id: number;
  stepId: number;
  productId: number;
  product: Product;
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
  scoreBreakdown?: Record<string, number>;
  userRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  category: Category;
  alternatives: ProductAlternative[];
}

export interface SkinProfile {
  id: number;
  userId: number;
  skinType: string;
  concerns: string[];
  allergies: string[];
  currentRoutine: string;
  lifestyleFactors: {
    hydration: string;
    sleep: string;
    sunExposure: string;
    stress: string;
    diet: string;
    environment: string;
    airConditioning: string;
  };
  recommendations: {
    immediate: string[];
    lifestyle: string[];
    products: {
      category: Category;
      alternatives: {
        id: number;
        name: string;
        brand: string;
        description: string;
        price: number;
        size: number;
        unit: string;
        keyIngredients: string[];
        isNatural: boolean;
        isGentle: boolean;
        score: number;
        scoreBreakdown: Record<string, number>;
        userRating: number;
      }[];
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
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

export interface Routine {
  id: number;
  userId: number;
  name: string;
  isActive: boolean;
  steps: RoutineStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  skinProfile: SkinProfile;
  routines: UserRoutine[];
  createdAt: Date;
  updatedAt: Date;
}