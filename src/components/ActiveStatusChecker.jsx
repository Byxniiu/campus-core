import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStudentAuthStore } from '../stores/useStudentAuthStore';
import { userAPI } from '../api/user';
import toast from 'react-hot-toast';

/**
 * ActiveStatusChecker - Checks if the logged-in student is still active
 * Runs on every route change to detect if admin has blocked the account
 */
const ActiveStatusChecker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useStudentAuthStore((state) => state.logout);

  useEffect(() => {
    // Check if student is logged in by checking localStorage directly
    const studentAuth = localStorage.getItem('student-auth');

    if (!studentAuth) {
      console.log('👤 No student auth found - skipping status check');
      return;
    }

    // Don't check on login/signup pages
    const publicRoutes = ['/student-signin', '/student-signup', '/otp-verification', '/'];
    if (publicRoutes.includes(location.pathname)) {
      console.log('📄 Public route - skipping status check');
      return;
    }

    console.log('🔍 ActiveStatusChecker: Route changed to:', location.pathname);
    console.log('👤 Student auth exists, checking active status...');

    const checkStatus = async () => {
      try {
        console.log('📡 Making API call to /auth/check-status');
        const response = await userAPI.checkActiveStatus();

        console.log('📦 Status check response:', response);

        if (response.success && response.isActive) {
          console.log('✅ User is active - all good!');
        }
      } catch (error) {
        console.error('❌ Active status check failed:', error);
        console.log('Error details:', {
          message: error.message,
          status: error.status,
          data: error.data,
        });

        // Check if account is deactivated
        const isBlocked =
          error.message?.includes('Account is deactivated') ||
          error.message?.includes('deactivated') ||
          error.data?.message?.includes('Account is deactivated') ||
          (error.status === 401 && error.data?.isActive === false);

        if (isBlocked) {
          console.log('🚫 ACCOUNT BLOCKED DETECTED!');
          console.log('🔴 Initiating logout and redirect flow...');

          // Logout and clear storage
          try {
            logout();
          } catch {
            // Logout failed or already logged out - safe to ignore
          }

          // Only clear student auth, NOT admin auth
          localStorage.removeItem('student-auth');
          localStorage.removeItem('auth-storage'); // legacy fallback

          console.log('🗑️ Cleared student auth storage (admin auth preserved)');

          // Store message for login page
          sessionStorage.setItem('accountBlocked', 'true');
          sessionStorage.setItem(
            'blockMessage',
            'Your account has been blocked by the administrator. Please contact support for assistance.'
          );

          console.log('💾 Stored block message in sessionStorage');

          // Show toast
          toast.error('Your account has been blocked by the administrator.', {
            duration: 6000,
          });

          console.log('🍞 Displayed toast notification');

          // Redirect to login
          console.log('🔄 Redirecting to /student-signin');
          navigate('/student-signin', { replace: true });
        } else {
          console.log('⚠️ Error but not a block - might be network or other issue');
        }
      }
    };

    checkStatus();
  }, [location.pathname, navigate, logout]);

  return null; // This component doesn't render anything
};

export default ActiveStatusChecker;
