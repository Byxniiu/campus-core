import API from './client';

export const facultyAPI = {
  /**
   * Fetch department chat history.
   * The API client interceptor already returns response.data, so 'res' here
   * is already { success, data: { messages, department } }
   */
  getDeptChatHistory: async (department, before = null) => {
    const params = new URLSearchParams({ department });
    if (before) params.set('before', before);
    return API.get(`/faculty/dept-chat?${params.toString()}`);
  },

  /**
   * Send a message via REST (Socket.IO is primary; this is a fallback).
   */
  sendDeptMessage: async (content, department) => {
    return API.post('/faculty/dept-chat', { content, department });
  },

  /**
   * Get all faculty members in a department.
   */
  getDeptMembers: async (department) => {
    return API.get(`/faculty/dept-members?department=${encodeURIComponent(department)}`);
  },
};
