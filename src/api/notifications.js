import client from './client';

export const notificationAPI = {
  // Get all notifications
  getNotifications: () => client.get('/notifications'),

  // Get unread count
  getUnreadCount: () => client.get('/notifications/unread-count'),

  // Mark as read
  markAsRead: (id) => client.put(`/notifications/${id}/read`),

  // Mark all as read
  markAllAsRead: () => client.put('/notifications/read-all'),

  // Delete notification
  deleteNotification: (id) => client.delete(`/notifications/${id}`),
};
