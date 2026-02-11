import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';

export const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const email = location.state?.email || '';
  const devOTP = location.state?.devOTP || null;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otp);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        // Update Zustand store
        login(user, accessToken, refreshToken);

        toast.success('Email verified successfully!');

        // Navigate based on role
        const roleRoutes = {
          student: '/student/dashboard',
          faculty: '/faculty/dashboard',
          staff: '/staff/dashboard',
          counselor: '/counselor/dashboard',
          admin: '/admin/dashboard',
        };

        navigate(roleRoutes[user.role] || '/');
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      if (error.data?.code === 'OTP_EXPIRED') {
        toast.error('OTP has expired. Please request a new one.');
        setCanResend(true);
      } else {
        toast.error(error.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);

    try {
      const response = await authAPI.resendOTP(email);

      if (response.success) {
        toast.success('OTP sent successfully!');
        setCanResend(false);
        setCountdown(60);

        // Show dev OTP if available
        if (response.data?.devOTP) {
          console.log('Development OTP:', response.data.devOTP);
          toast.success(`Dev OTP: ${response.data.devOTP}`, { duration: 5000 });
        }
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to
            <br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Dev OTP Display */}
        {devOTP && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm font-semibold text-yellow-800 mb-1">🔧 Development Mode</p>
            <p className="text-sm text-yellow-700">
              Your OTP: <span className="font-mono font-bold text-lg">{devOTP}</span>
            </p>
            <p className="text-xs text-yellow-600 mt-1">Check your backend console for OTP</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  Resend OTP in <span className="font-semibold">{countdown}s</span>
                </p>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
