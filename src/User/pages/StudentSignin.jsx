import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { useStudentAuthStore } from '../../stores/useStudentAuthStore';
import toast from 'react-hot-toast';
import {
  Key,
  Mail,
  Fingerprint,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  LayoutDashboard,
  Anchor,
} from 'lucide-react';

const SignInPage = () => {
  const navigate = useNavigate();
  const login = useStudentAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');

  // Check for blocked account notification
  useEffect(() => {
    const isBlocked = sessionStorage.getItem('accountBlocked');
    const message = sessionStorage.getItem('blockMessage');

    if (isBlocked === 'true' && message) {
      setBlockedMessage(message);
      toast.error(message, { duration: 6000 });

      // Clear the session storage
      sessionStorage.removeItem('accountBlocked');
      sessionStorage.removeItem('blockMessage');
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(' Attempting login with:', formData.identifier);
      const response = await authAPI.login(formData.identifier, formData.password);

      console.log(' Login response:', response);
      console.log(' Response success:', response.success);
      console.log(' Response data:', response.data);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        console.log(' User data:', user);
        console.log(' Access token exists:', !!accessToken);
        console.log(' Refresh token exists:', !!refreshToken);

        console.log(' Calling login() to save to store...');
        login(user, accessToken, refreshToken);

        // Verify it was saved
        setTimeout(() => {
          const stored = localStorage.getItem('student-auth');
          console.log(' Stored in localStorage (student-auth):', stored ? 'YES' : 'NO');
          if (stored) {
            console.log(' Storage content:', JSON.parse(stored));
          }
        }, 100);

        toast.success(`Access Authorized. Welcome, ${user.firstName}.`);

        if (user.role === 'student') {
          navigate('/student-home-page');
        } else {
          navigate('/');
        }
      } else {
        console.error(' Response success was false');
      }
    } catch (error) {
      console.error(' Login error:', error);
      toast.error(error.message || 'Invalid credentials or login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] p-4 md:p-8 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] -z-0"></div>

      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-[40px] overflow-hidden min-h-[650px] border border-teal-50 relative z-10">
        {/* Left Side: Form Container */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-between">
          <header className="mb-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
                <GraduationCap size={24} className="text-teal-400" />
              </div>
              <span className="font-outfit text-3xl font-bold tracking-tight text-blue-950">
                Campus <span className="text-teal-500">Core</span>
              </span>
            </div>
            <Link
              to="/"
              className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest hover:text-teal-600 transition-colors flex items-center gap-2 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />{' '}
              Back to Home
            </Link>
          </header>

          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-6xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Identity <span className="text-teal-500">Verification</span>
            </h2>
            <p className="text-blue-950/40 text-[11px] font-bold mt-5 uppercase tracking-[0.2em] ml-1">
              Secure access terminal // Student Core
            </p>

            {/* Blocked Account Warning */}
            {blockedMessage && (
              <div className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-800 mb-1">Account Blocked</h3>
                    <p className="text-xs text-red-700 leading-relaxed">{blockedMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="identifier"
                  className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1"
                >
                  Admission Number / Email
                </label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-teal-600 transition-colors">
                    <Fingerprint size={20} />
                  </div>
                  <input
                    type="text"
                    id="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter credentials"
                    required
                    className="w-full pl-16 pr-8 py-5 bg-blue-50/50 border border-teal-50 rounded-[28px] focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1"
                >
                  Secure Passkey
                </label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-teal-600 transition-colors">
                    <Key size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-16 pr-8 py-5 bg-blue-50/50 border border-teal-50 rounded-[28px] focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-blue-950 text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-[24px] shadow-2xl shadow-teal-100/50 hover:bg-teal-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {isLoading ? 'Verifying Credentials...' : 'Authorize Access Node'}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform text-teal-400"
                />
              </button>
            </form>
          </div>

          <div className="border-t border-teal-50 pt-10 flex justify-between items-center text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">
            <p>New to the network?</p>
            <Link
              to="/student-signup"
              className="text-blue-950 hover:text-teal-600 transition-colors bg-teal-50 px-5 py-2.5 rounded-full"
            >
              Register Account
            </Link>
          </div>
        </div>

        {/* Right Side: Visual Container */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-950 items-center justify-center p-20 relative overflow-hidden">
          {/* Deep Sea decor */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-0"></div>

          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-blue-900/40 rounded-[32px] border border-teal-400/20 flex items-center justify-center mx-auto mb-10 shadow-2xl backdrop-blur-sm">
              <ShieldCheck size={48} className="text-teal-400" />
            </div>
            <h3 className="text-5xl font-outfit font-bold tracking-tight text-white leading-tight mb-6">
              Central <span className="text-teal-500">Gateway</span>
            </h3>
            <p className="text-blue-200/50 text-lg font-medium mb-12 max-w-sm mx-auto">
              Access the core academic infrastructure. Securely manage your student identity and
              resources.
            </p>

            <div className="bg-white/5 p-8 rounded-[32px] border border-teal-400/10 flex items-center gap-6 text-left shadow-inner backdrop-blur-md">
              <div className="bg-blue-900 p-3 rounded-xl border border-teal-400/20 shadow-lg">
                <Anchor size={24} className="text-teal-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1.5">
                  Session Target
                </p>
                <p className="text-base font-bold text-white uppercase tracking-widest">
                  Student Terminal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
