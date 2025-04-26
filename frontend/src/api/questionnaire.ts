import { QuestionnaireQuestion, QuestionnaireResponse, SkinProfile } from '../types/skincare';

const API_URL = import.meta.env.VITE_API_URL;

export const getQuestions = async (): Promise<QuestionnaireQuestion[]> => {
  try {
    const response = await fetch(`${API_URL}/questionnaire/questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch questions');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch questions');
  }
};

export const submitResponses = async (
  responses: QuestionnaireResponse[], 
  token: string
): Promise<{ message: string; count: number; skinProfile: SkinProfile }> => {
  try {
    const response = await fetch(`${API_URL}/questionnaire/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ responses }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit responses');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to submit responses');
  }
};

export const getSkinProfile = async (token: string): Promise<SkinProfile> => {
  try {
    const response = await fetch(`${API_URL}/questionnaire/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch skin profile');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch skin profile');
  }
};