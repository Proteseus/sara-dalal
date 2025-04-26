import { ProgressReport, ProgressSummary } from '../types/progress';

const API_URL = import.meta.env.VITE_API_URL;

export const getProgressReport = async (
  token: string,
  startDate: string,
  endDate: string
): Promise<ProgressReport> => {
  try {
    const response = await fetch(
      `${API_URL}/progress/report?startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch progress report');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch progress report');
  }
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