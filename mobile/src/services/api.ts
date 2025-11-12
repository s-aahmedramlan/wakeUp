import { WakeSession } from '../types';

const API_BASE_URL = __DEV__
  ? 'http://localhost:8000' // Local development
  : 'https://api.riserite.app'; // Production

export const logWakeSession = async (session: WakeSession): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/wake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error logging wake session:', error);
    // For MVP, we'll still store locally even if API call fails
    return false;
  }
};

export const getStreak = async (userId: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/streak`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.streak || 0;
  } catch (error) {
    console.error('Error fetching streak:', error);
    return 0;
  }
};


