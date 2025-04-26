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
    responses: QuestionResponse[];
  }
  
  export interface ProgressReport {
    timeline: TimelineEntry[];
  }
  
  export interface ProgressSummary {
    month: string;
    averages: {
      [questionText: string]: number;
    };
  }