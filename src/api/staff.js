import client from './client';

export const staffAPI = {
  // Get active staff
  getStaff: async () => {
    try {
      const response = await client.get('/staff');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch staff';
    }
  },
};
