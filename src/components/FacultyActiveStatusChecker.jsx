import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAPI } from '../api/user';
import toast from 'react-hot-toast';

/**
 * FacultyActiveStatusChecker - Checks if the logged-in faculty is still active
 * Runs on every route change to detect if admin has blocked the account
 */
const FacultyActiveStatusChecker = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if faculty is logged in
    const facultyToken = localStorage.getItem('faculty_token');

    if (!facultyToken) {
      console.log('👤 No faculty token found - skipping status check');
      return;
    }

    // Don't check on public faculty pages
    const publicRoutes = [
      '/faculty-login',
      '/faculty-register',
      '/faculty-otp-verification',
      '/faculty-waiting-approval',
    ];
    if (publicRoutes.includes(location.pathname)) {
      console.log('📄 Public faculty route - skipping status check');
      return;
    }

    console.log('🔍 FacultyActiveStatusChecker: Route changed to:', location.pathname);
    console.log('👤 Faculty token exists, checking active status...');

    const checkStatus = async () => {
      try {
        console.log('📡 Making API call to /auth/check-status (Faculty)');
        const response = await userAPI.checkActiveStatus();

        console.log('📦 Faculty status check response:', response);

        if (response.success && response.isActive) {
          console.log('✅ Faculty is active - all good!');
        }
      } catch (error) {
        console.error('❌ Faculty active status check failed:', error);

        // Check if account is deactivated
        const isBlocked =
          error.message?.includes('Account is deactivated') ||
          error.message?.includes('deactivated') ||
          error.data?.message?.includes('Account is deactivated') ||
          (error.status === 401 && error.data?.isActive === false);

        if (isBlocked) {
          console.log('🚫 FACULTY ACCOUNT BLOCKED DETECTED!');

          // Clear faculty storage
          localStorage.removeItem('faculty_token');
          localStorage.removeItem('faculty_refresh_token');
          localStorage.removeItem('faculty_user');

          // Store message for login page
          sessionStorage.setItem('accountBlocked', 'true');
          sessionStorage.setItem(
            'blockMessage',
            'Your faculty account has been blocked by the administrator. Please contact the IT department.'
          );

          // Show toast
          toast.error('Your account has been deactivated by the administrator.', {
            duration: 6000,
          });

          // Redirect to faculty login
          navigate('/faculty-login', { replace: true });
        }
      }
    };

    checkStatus();
  }, [location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default FacultyActiveStatusChecker;
