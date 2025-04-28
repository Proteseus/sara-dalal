import { ProgressReport, ProgressSummary } from '../types/progress';

const API_URL = import.meta.env.VITE_API_URL;

export const getProgressReport = async (token: string): Promise<ProgressReport> => {
  const response = await fetch(`${API_URL}/progress/report`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch progress report');
  }

  return await response.json();
};

export const getProgressSummary = async (token: string): Promise<ProgressSummary[]> => {
  try {
    const response = await fetch(`${API_URL}/progress/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch progress summary');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch progress summary');
  }
};