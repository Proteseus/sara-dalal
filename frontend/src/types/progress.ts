export interface QuestionResponse {
    id: string;
    userId: string;
    questionId: string;
    answer: string;
    createdAt: string;
    question: {
      id: string;
      text: string;
      type: string;
      options: string[];
      category: string;
      order: number;
    };
  }
  
  export interface TimelineEntry {
    date: string;
    responses: Array<{
      id: string;
      questionId: string;
      answer: string;
      question: {
        id: string;
        text: string;
        type: string;
        category: string;
      };
    }>;
  }
  
  export interface ProgressReport {
    skinType: {
      previous: string;
      current: string;
      changed: boolean;
    };
    concerns: {
      previous: string[];
      current: string[];
      added: string[];
      removed: string[];
    };
    lifestyleFactors: {
      [key: string]: {
        previous: string;
        current: string;
        improved: boolean | null;
      };
    };
    recommendations: {
      previous: {
        products: string[];
        immediate: string[];
        lifestyle: string[];
      };
      current: {
        products: string[];
        immediate: string[];
        lifestyle: string[];
      };
      new: string[];
    };
  }
  
  export interface MetricData {
    average: number;
    range: {
      min: number;
      max: number;
    };
    consistency: number;
  }
  
  export interface TrendIndicator {
    direction: 'improving' | 'declining';
    stability: 'stable' | 'volatile';
  }
  
  export interface ProgressSummary {
    month: string;
    metrics: {
      [category: string]: {
        [question: string]: MetricData;
      };
    };
    trendIndicators: {
      [category: string]: {
        [question: string]: TrendIndicator;
      };
    };
    responseCount: number;
  }