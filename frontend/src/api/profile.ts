import { User } from '../types/auth';
import { SkinProfile } from '../types/skincare';

export interface UserProfile extends User {
  skinProfile: SkinProfile;
  routines: User['routines'];
}

const API_URL = import.meta.env.VITE_API_URL;

export const getUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch profile');
  }
};