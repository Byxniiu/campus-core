import client from './client';

export const userAPI = {
  // Check if current user is still active
  checkActiveStatus: () => client.get('/auth/check-status'),

  // Get current user profile
  getProfile: () => client.get('/auth/me'),
};
