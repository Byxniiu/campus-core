import client from './client';

export const sosAPI = {
  // Student: Create SOS alert
  createAlert: (data) => client.post('/sos', data),

  // Student: Get my alerts
  getMyAlerts: () => client.get('/sos/my-alerts'),

  // Faculty/Admin: Get all alerts
  getAllAlerts: (params) => client.get('/sos', { params }),

  // Faculty/Admin: Get single alert
  getAlert: (id) => client.get(`/sos/${id}`),

  // Faculty/Admin: Update alert status
  updateStatus: (id, status, notes) => client.put(`/sos/${id}/status`, { status, notes }),

  // Faculty/Admin: Assign alert
  assignAlert: (id) => client.put(`/sos/${id}/assign`),

  // Faculty/Admin: Respond to alert
  respondToAlert: (id, message) => client.post(`/sos/${id}/respond`, { message }),

  // Admin: Get statistics
  getStats: () => client.get('/sos/stats'),
};
