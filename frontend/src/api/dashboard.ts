import { DashboardData } from '../types/dashboard';

const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardData = async (token: string): Promise<DashboardData> => {
  try {
    const url = `${API_URL}/dashboard`;
    console.log('Fetching dashboard data from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Dashboard API error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch dashboard data');
    }

    const { data } = await response.json();
    console.log('Dashboard data received:', data);
    return data;
  } catch (error) {
    console.error('Dashboard API error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch dashboard data');
  }
};