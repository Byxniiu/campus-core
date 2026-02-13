import API from './client';

// Admin Auth
export const adminLoginRequest = (credentials) => API.post('/admin/login-request', credentials);
export const verifyAdminOTP = (data) => API.post('/admin/verify-otp', data);

// User Management
export const getAllStudents = () => API.get('/admin/students');
export const getAllTeachers = () => API.get('/admin/teachers');
export const getAllCounselors = () => API.get('/admin/counselors');
export const getAllStaff = () => API.get('/admin/staff');
export const toggleUserStatus = (id) => API.patch(`/admin/users/${id}/toggle-status`);
export const createCounselor = (data) => API.post('/admin/create-counselor', data);
export const createStaff = (data) => API.post('/admin/create-staff', data);

// Faculty Approval Management
export const getPendingFaculty = () => API.get('/admin/pending-faculty');
export const approveFaculty = (id) => API.post(`/admin/approve-faculty/${id}`);
export const rejectFaculty = (id) => API.post(`/admin/reject-faculty/${id}`);

// Resources
export const getAllSOSAlerts = () => API.get('/admin/sos');
export const getAllEvents = () => API.get('/admin/events');
export const getSystemStats = () => API.get('/admin/stats');

// Event Management
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Counseling & Help Requests
export const getCounselingRequests = () => API.get('/counseling/requests');
export const acceptCounselingRequest = (id) => API.patch(`/counseling/requests/${id}/accept`);
export const rejectCounselingRequest = (id) => API.patch(`/counseling/requests/${id}/reject`);

export const getHelpRequests = () => API.get('/emergency-assist');
export const acceptHelpRequest = (id) => API.put(`/emergency-assist/${id}/assign`);
export const rejectHelpRequest = (id) => API.put(`/emergency-assist/${id}/reject`);

// Export as default object for convenience
export const adminAPI = {
  adminLoginRequest,
  verifyAdminOTP,
  getAllStudents,
  getAllTeachers,
  getAllCounselors,
  getAllStaff,
  toggleUserStatus,
  getPendingFaculty,
  approveFaculty,
  rejectFaculty,
  createCounselor,
  createStaff,
  getAllSOSAlerts,
  getAllEvents,
  getSystemStats,
  getCounselingRequests,
  acceptCounselingRequest,
  rejectCounselingRequest,
  getHelpRequests,
  acceptHelpRequest,
  rejectHelpRequest,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default adminAPI;
