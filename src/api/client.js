import axios from 'axios';

// Create axios instance
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor - attach token
client.interceptors.request.use(
  (config) => {
    // Intelligent Token Selection Logic
    const isAdminRoute = config.url.includes('/admin/');
    const isFacultyPage = window.location.pathname.includes('/faculty');
    const isStaffPage = window.location.pathname.includes('/non-teaching');
    const isStudentPage =
      window.location.pathname.includes('/student-') || window.location.pathname === '/';

    console.log(
      ` API Request: ${config.url} | Context: ${isFacultyPage ? 'Faculty' : isStudentPage ? 'Student' : 'General'}`
    );

    // Intelligent Context-Aware Token Selection
    let token = null;
    let tokenSource = 'none';

    if (isAdminRoute) {
      const adminAuth = localStorage.getItem('admin-auth');
      if (adminAuth) {
        try {
          const parsed = JSON.parse(adminAuth);
          token =
            parsed.state?.token || parsed.token || parsed.state?.accessToken || parsed.accessToken;
          tokenSource = 'admin-auth';
        } catch {
          // Token parsing failed: ignore and continue
        }
      }
    } else if (isFacultyPage) {
      token = localStorage.getItem('faculty_token');
      tokenSource = 'faculty_token';
    } else if (isStaffPage) {
      const staffAuth = localStorage.getItem('auth-storage');
      if (staffAuth) {
        try {
          const parsed = JSON.parse(staffAuth);
          token =
            parsed.state?.token || parsed.token || parsed.state?.accessToken || parsed.accessToken;
          tokenSource = 'staff-auth';
        } catch {
          // Token parsing failed: ignore and continue
        }
      }
    } else {
      // Student / General page
      const studentAuth = localStorage.getItem('student-auth');
      if (studentAuth) {
        try {
          const parsed = JSON.parse(studentAuth);
          token =
            parsed.state?.token || parsed.token || parsed.state?.accessToken || parsed.accessToken;
          tokenSource = 'student-auth';
        } catch {
          // Token parsing failed: ignore and continue
        }
      }
    }

    // fallback - if still no token, try anything that looks like a valid auth record
    if (!token) {
      const keys = ['admin-auth', 'student-auth', 'auth-storage', 'faculty_token'];
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val) {
          if (key === 'faculty_token') {
            token = val;
            tokenSource = 'fallback:faculty';
          } else {
            try {
              const parsed = JSON.parse(val);
              token =
                parsed.state?.token ||
                parsed.token ||
                parsed.state?.accessToken ||
                parsed.accessToken;
              tokenSource = `fallback:${key}`;
            } catch {
              // Token parsing failed: ignore and continue
            }
          }
          if (token) break;
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `[API_SEC] Attaching ${tokenSource} token (${token.substring(0, 10)}...) to ${config.url}`
      );
    } else {
      console.warn(`[API_SEC] No token available for request: ${config.url}`);
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
      localStorage.removeItem('auth-storage'); // legacy fallback
      // Also clear faculty storage if it exists
      localStorage.removeItem('faculty_token');
      localStorage.removeItem('faculty_refresh_token');
      localStorage.removeItem('faculty_user');

      // Store the block message to show on login page
      sessionStorage.setItem('accountBlocked', 'true');
      sessionStorage.setItem(
        'blockMessage',
        'Your account has been blocked by the administrator. Please contact support for assistance.'
      );

      // Redirect logic based on current path or token type
      const isFacultyPath = window.location.pathname.includes('/faculty');
      if (isFacultyPath) {
        window.location.href = '/faculty-login';
      } else {
        window.location.href = '/student-signin';
      }

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
