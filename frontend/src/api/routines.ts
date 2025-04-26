import { Routine } from '../types/skincare';

const API_URL = import.meta.env.VITE_API_URL;

export const getUserRoutines = async (token: string): Promise<Routine[]> => {
  try {
    const response = await fetch(`${API_URL}/routines`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch routines');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch routines');
  }
};

export const getRoutineById = async (id: string, token: string): Promise<Routine> => {
  try {
    const response = await fetch(`${API_URL}/routines/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch routine');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch routine');
  }
};

export const createRoutine = async (routineData: Partial<Routine>, token: string): Promise<Routine> => {
  try {
    const response = await fetch(`${API_URL}/routines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(routineData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create routine');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create routine');
  }
};

export const updateRoutine = async (id: string, routineData: Partial<Routine>, token: string): Promise<Routine> => {
  try {
    const response = await fetch(`${API_URL}/routines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(routineData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update routine');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update routine');
  }
};

export const deleteRoutine = async (id: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/routines/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete routine');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete routine');
  }
};

export const toggleRoutineStatus = async (id: string, token: string): Promise<Routine> => {
  try {
    const response = await fetch(`${API_URL}/routines/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to toggle routine status');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to toggle routine status');
  }
};