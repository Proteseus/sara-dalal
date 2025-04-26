import { SkinProfile, Routine, Product, UserResponse } from './skincare';
import { ProgressReport, ProgressSummary } from './progress';

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  skinProfile: SkinProfile;
  createdAt: string;
}

export interface UpcomingStep {
  routineId: string;
  routineName: string;
  id: string;
  order: number;
  time: string;
  notes: string;
  product: Product;
}

export interface DashboardData {
  user: DashboardUser;
  routines: Routine[];
  recentResponses: UserResponse[];
  progress: {
    report: ProgressReport;
    summary: ProgressSummary[];
  };
  upcomingSteps: UpcomingStep[];
  recentRecommendations: Product[];
}