import axios from 'axios';

// Create axios instance
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
client.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
client.interceptors.response.use(
  (response) => {
    return response.data; // Return only data
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          const refreshToken = state?.refreshToken;

          if (refreshToken) {
            // Refresh access token
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh-token`,
              { refreshToken }
            );

            const { accessToken } = response.data.data;

            // Update token in storage
            const parsedStorage = JSON.parse(authStorage);
            parsedStorage.state.token = accessToken;
            localStorage.setItem('auth-storage', JSON.stringify(parsedStorage));

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('auth-storage');
        window.location.href = '/student-signin';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default client;
