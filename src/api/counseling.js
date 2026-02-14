import client from './client';

export const counselingAPI = {
  // Get active counselors
  getCounselors: async () => {
    try {
      const response = await client.get('/counseling/counselors');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch counselors';
    }
  },

  // Create counseling request
  createRequest: async (data) => {
    try {
      const response = await client.post('/counseling/requests', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create request';
    }
  },
};
