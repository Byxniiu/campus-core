import client from './client';

export const eventsAPI = {
  // Get all events
  getAllEvents: async (params = {}) => {
    try {
      const response = await client.get('/events', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch events';
    }
  },

  // Get single event
  getEvent: async (id) => {
    try {
      const response = await client.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch event';
    }
  },

  // Register for event
  registerEvent: async (id) => {
    try {
      const response = await client.post(`/events/${id}/register`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to register for event';
    }
  },

  // Unregister from event
  unregisterEvent: async (id) => {
    try {
      const response = await client.delete(`/events/${id}/register`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to unregister from event';
    }
  },
};
