import client from './client';

export const userAPI = {
  // Check if current user is still active
  checkActiveStatus: () => client.get('/auth/check-status'),

  // Get current user profile
  getProfile: () => client.get('/auth/me'),

  // Update profile
  updateProfile: (data) => {
    // If data contains a file (avatar), use FormData
    if (data.avatar instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      return client.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return client.put('/auth/profile', data);
  },
};
