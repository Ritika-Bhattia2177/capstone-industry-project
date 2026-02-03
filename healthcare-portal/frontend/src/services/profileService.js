import { fetchAPI } from './api';

export const fetchProfileData = async (userId = 1) => {
  return fetchAPI('/profile');
};

export const updateProfileInfo = async (userId = 1, data) => {
  return fetchAPI(`/profile`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
