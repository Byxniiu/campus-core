import axios from 'axios';

// Create axios instance
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor - attach token
client.interceptors.request.use(
  (config) => {
    // Intelligent Context-Aware Page Detection
    const path = window.location.pathname;
    const isPageAdmin = path.includes('/admin-');
    const isPageCounselor = path.includes('/counselor') || path.includes('/counseling-stats');
    const isPageFaculty = path.includes('/faculty');
    const isPageStaff = path.includes('/non-teaching');

    // API Route Detection
    const isApiAdmin = config.url.includes('/admin/');

    console.log(
      `[API_CONTEXT] Req: ${config.url} | Page: ${path} | Mode: ${isPageAdmin ? 'Admin' : isPageCounselor ? 'Counselor' : isPageFaculty ? 'Faculty' : isPageStaff ? 'Staff' : 'Standard'}`
    );

    // Intelligent Context-Aware Token Selection
    let token = null;
    let tokenSource = 'none';

    // 1. Priority Selection based on Page Context
    if (isPageAdmin || isApiAdmin) {
      const adminAuth = localStorage.getItem('admin-auth');
      if (adminAuth) {
        try {
          const parsed = JSON.parse(adminAuth);
          token =
            parsed.state?.token || parsed.token || parsed.state?.accessToken || parsed.accessToken;
          tokenSource = 'admin-auth';
        } catch {
          // Ignore parse errors
        }
      }
    }

    // 2. Counselor / Staff Priority (Common UI)
    if (!token && (isPageCounselor || isPageStaff)) {
      const staffAuth = localStorage.getItem('auth-storage');
      if (staffAuth) {
        try {
          const parsed = JSON.parse(staffAuth);
          token =
            parsed.state?.token || parsed.token || parsed.state?.accessToken || parsed.accessToken;
          tokenSource = 'staff-auth';
        } catch {
          // Ignore parse errors
        }
      }
    }

    // 3. Faculty Priority
    if (!token && isPageFaculty) {
      token = localStorage.getItem('faculty_token');
      tokenSource = 'faculty_token';
    }

    // 4. Student Fallback (ONLY if not in a privileged page)
    if (
      !token &&
      !isPageAdmin &&
      !isPageCounselor &&
      !isPageStaff &&
      !isPageFaculty &&
      !isApiAdmin
    ) {
      const studentAuth = localStorage.getItem('student-auth');
      if (studentAuth) {
        try {
          const parsed = JSON.parse(studentAuth);
          token =
            parsed.state?.token || parsed.token || parsed.state?.accessToken || parsed.accessToken;
          tokenSource = 'student-auth';
        } catch {
          // Ignore parse errors
        }
      }
    }

    // 5. Strict Fallback - Re-scan all without page restrictions if still nothing
    if (!token) {
      const keys =
        isPageAdmin || isPageCounselor || isPageStaff || isApiAdmin
          ? ['admin-auth', 'auth-storage', 'faculty_token']
          : ['student-auth', 'auth-storage', 'admin-auth'];

      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val) {
          if (key === 'faculty_token') {
            token = val;
            tokenSource = `fallback:${key}`;
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
              // Ignore parse errors
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
        let refreshToken = null;
        let storageKey = null;
        let isZustand = false;

        // Detect which refresh token to use based on path/context
        const path = window.location.pathname;
        if (path.includes('/admin-')) {
          storageKey = 'admin-auth';
          isZustand = true;
        } else if (path.includes('/counselor') || path.includes('/non-teaching')) {
          storageKey = 'auth-storage';
          isZustand = true;
        } else if (path.includes('/faculty')) {
          refreshToken = localStorage.getItem('faculty_refresh_token');
          storageKey = 'faculty_token';
          isZustand = false;
        } else {
          storageKey = 'student-auth';
          isZustand = true;
        }

        if (isZustand) {
          const storage = localStorage.getItem(storageKey);
          if (storage) {
            const parsed = JSON.parse(storage);
            refreshToken = parsed.state?.refreshToken;
          }
        }

        if (refreshToken) {
          // Refresh access token
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken } = response.data.data;

          // Update token in appropriate storage
          if (isZustand) {
            const storage = localStorage.getItem(storageKey);
            const parsed = JSON.parse(storage);
            parsed.state.token = accessToken;
            localStorage.setItem(storageKey, JSON.stringify(parsed));
          } else if (storageKey === 'faculty_token') {
            localStorage.setItem('faculty_token', accessToken);
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        console.error('[API_REFRESH] Refresh failed:', refreshError);
        // Refresh failed - logout user based on context
        const path = window.location.pathname;
        if (path.includes('/admin-')) {
          localStorage.removeItem('admin-auth');
          window.location.href = '/admin-login';
        } else if (path.includes('/counselor')) {
          localStorage.removeItem('auth-storage');
          window.location.href = '/counselor-login';
        } else if (path.includes('/faculty')) {
          localStorage.removeItem('faculty_token');
          localStorage.removeItem('faculty_refresh_token');
          window.location.href = '/faculty-login';
        } else {
          localStorage.removeItem('student-auth');
          localStorage.removeItem('auth-storage');
          window.location.href = '/student-signin';
        }
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
