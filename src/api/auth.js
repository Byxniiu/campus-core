import client from './client';

export const authAPI = {
  // Register new user
  register: (data) => client.post('/auth/register', data),

  // Verify OTP
  verifyOTP: (email, otp) => client.post('/auth/verify-otp', { email, otp }),

  // Resend OTP
  resendOTP: (email) => client.post('/auth/resend-otp', { email }),

  // Login
  login: (identifier, password) => client.post('/auth/login', { identifier, password }),

  // Logout
  logout: (refreshToken) => client.post('/auth/logout', { refreshToken }),

  // Get current user
  getMe: () => client.get('/auth/me'),

  // Refresh token
  refreshToken: (refreshToken) => client.post('/auth/refresh-token', { refreshToken }),
};
