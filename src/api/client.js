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
    let authStorage = null;
    let storageType = 'none';

    // Intelligently select the correct auth store based on the endpoint
    const isAdminRoute = config.url.includes('/admin/');

    console.log('🔍 API Request to:', config.url);
    console.log('🎯 Is admin route:', isAdminRoute);

    if (isAdminRoute) {
      // For admin routes, use admin-auth
      authStorage = localStorage.getItem('admin-auth');
      storageType = 'admin';
      console.log('📦 Checking admin-auth:', !!authStorage);
    } else {
      // For non-admin routes, use student-auth
      authStorage = localStorage.getItem('student-auth');
      storageType = 'student';
      console.log('📦 Checking student-auth:', !!authStorage);

      // Fallback to old auth-storage for backward compatibility
      if (!authStorage) {
        authStorage = localStorage.getItem('auth-storage');
        storageType = 'legacy';
        console.log('📦 Fallback to auth-storage:', !!authStorage);
      }
    }

    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
          console.log(`✅ Using ${storageType} token for request`);
          console.log('👤 User role:', state.user?.role);
          console.log('🔑 Token preview:', state.token.substring(0, 20) + '...');
        } else {
          console.log('❌ No token found in', storageType, 'storage');
        }
      } catch (error) {
        console.error('❌ Error parsing auth storage:', error);
      }
    } else {
      console.log('❌ No auth storage found - request will be unauthenticated');
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

    // Handle account deactivation (blocked by admin)
    if (
      error.response?.status === 401 &&
      error.response?.data?.message?.includes('Account is deactivated')
    ) {
      // Only clear student auth (admin might be the one blocking, so preserve their auth)
      localStorage.removeItem('student-auth');
      localStorage.removeItem('auth-storage'); // legacy

      // Store the block message to show on login page
      sessionStorage.setItem('accountBlocked', 'true');
      sessionStorage.setItem(
        'blockMessage',
        'Your account has been blocked by the administrator. Please contact support for assistance.'
      );

      // Redirect to login
      window.location.href = '/student-signin';

      return Promise.reject({
        message: 'Account blocked by administrator',
        status: 401,
        blocked: true,
      });
    }

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
