import { fetchAPI } from './api';
import { getLocalProfile, saveLocalProfile } from './localStorageService';

export const fetchProfileData = async (userId = 1) => {
  try {
    // Try to fetch from API
    const profile = await fetchAPI('/profile');
    
    // Save to localStorage for offline access
    saveLocalProfile(profile);
    
    return profile;
  } catch (error) {
    console.error('API error, loading from localStorage:', error);
    // If API fails, return from localStorage
    const localProfile = getLocalProfile();
    if (localProfile) {
      return localProfile;
    }
    throw error;
  }
};

export const updateProfileInfo = async (userId = 1, data) => {
  try {
    // Try to update via API
    const result = await fetchAPI(`/profile`, {
      method: 'PATCH',
      body: JSON.stringify({ personalInfo: data }),
    });
    
    // Save to localStorage
    saveLocalProfile(result);
    
    return result;
  } catch (error) {
    console.error('API error, saving to localStorage only:', error);
    // If API fails, update localStorage
    const currentProfile = getLocalProfile();
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        personalInfo: {
          ...currentProfile.personalInfo,
          ...data
        }
      };
      saveLocalProfile(updatedProfile);
      return updatedProfile;
    }
    throw error;
  }
};
