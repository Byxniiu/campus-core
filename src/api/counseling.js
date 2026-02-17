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

  // Get specific counselor availability
  getCounselorAvailability: async (id) => {
    try {
      const response = await client.get(`/counseling/counselors/${id}/availability`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch availability';
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

  // Get counseling requests
  getRequests: async (params) => {
    try {
      const response = await client.get('/counseling/requests', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch requests';
    }
  },

  // Manage counseling request
  manageRequest: async (id, data) => {
    try {
      const response = await client.patch(`/counseling/requests/${id}/manage`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update request';
    }
  },

  // Get current student's requests
  getMyRequests: async () => {
    try {
      console.log('[API] Calling /counseling/my-requests...');
      const response = await client.get('/counseling/my-requests');
      console.log('[API] Response from client:', response);
      // Client interceptor already unwrapped response.data
      // So response is already { success: true, data: { requests: [...] } }
      return response;
    } catch (error) {
      console.error('[API] Error fetching my requests:', error);
      console.error('[API] Error response:', error.response);
      throw error.response?.data?.message || error.message || 'Failed to fetch your requests';
    }
  },
};
