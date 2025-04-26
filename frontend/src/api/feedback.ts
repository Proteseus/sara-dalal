import { ProductFeedback, RoutineFeedback } from '../types/skincare';

const API_URL = import.meta.env.VITE_API_URL;

export const submitProductFeedback = async (
  feedback: Omit<ProductFeedback, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<ProductFeedback> => {
  try {
    const response = await fetch(`${API_URL}/feedback/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit product feedback');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to submit product feedback');
  }
};

export const submitRoutineFeedback = async (
  feedback: Omit<RoutineFeedback, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<RoutineFeedback> => {
  try {
    const response = await fetch(`${API_URL}/feedback/routine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit routine feedback');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to submit routine feedback');
  }
};

export const getProductFeedback = async (
  productId: number,
  token: string
): Promise<ProductFeedback> => {
  try {
    const response = await fetch(`${API_URL}/feedback/product/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch product feedback');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch product feedback');
  }
};

export const getRoutineFeedback = async (
  routineId: number,
  token: string
): Promise<RoutineFeedback> => {
  try {
    const response = await fetch(`${API_URL}/feedback/routine/${routineId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch routine feedback');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch routine feedback');
  }
}; 