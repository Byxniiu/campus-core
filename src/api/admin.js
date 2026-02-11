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

// Faculty Approval Management
export const getPendingFaculty = () => API.get('/admin/pending-faculty');
export const approveFaculty = (id) => API.post(`/admin/approve-faculty/${id}`);
export const rejectFaculty = (id) => API.post(`/admin/reject-faculty/${id}`);

// Resources
export const getAllSOSAlerts = () => API.get('/admin/sos');
export const getAllEvents = () => API.get('/admin/events');

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
  getAllSOSAlerts,
  getAllEvents,
};

export default adminAPI;
