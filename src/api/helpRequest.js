import client from './client';

export const helpRequestAPI = {
  // Create help request
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'attachments') {
        data[key].forEach((file) => {
          formData.append('attachments', file);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    return client.post('/help-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get my requests
  getMyRequests: () => client.get('/help-requests/my'),

  // Update status (Staff/Admin)
  updateStatus: (id, status, extraData = {}) =>
    client.patch(`/help-requests/${id}/status`, { status, ...extraData }),
};
