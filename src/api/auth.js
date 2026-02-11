import client from './client';

export const authAPI = {
  // Register new user
  register: (data) => client.post('/auth/register', data),

  // Verify OTP
  verifyOTP: (data, otp) => {
    const payload = typeof data === 'string' ? { email: data, otp } : data;
    return client.post('/auth/verify-otp', payload);
  },
  verify: (data, otp) => {
    const payload = typeof data === 'string' ? { email: data, otp } : data;
    return client.post('/auth/verify-otp', payload);
  },

  // Resend OTP
  resendOTP: (data) => {
    const payload = typeof data === 'string' ? { email: data } : data;
    return client.post('/auth/resend-otp', payload);
  },

  // Login
  login: (identifier, password) => client.post('/auth/login', { identifier, password }),

  // Logout
  logout: (refreshToken) => client.post('/auth/logout', { refreshToken }),

  // Get current user
  getMe: () => client.get('/auth/me'),

  // Refresh token
  refreshToken: (refreshToken) => client.post('/auth/refresh-token', { refreshToken }),

  // Check approval status
  checkApprovalStatus: (email) => client.get(`/auth/check-approval?email=${email}`),
};
