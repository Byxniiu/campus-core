import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import { GraduationCap, LogIn, Lock, ChevronRight, UserCheck } from 'lucide-react';

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [blockedMessage, setBlockedMessage] = useState(null);

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData.identifier, formData.password);

      if (response.success) {
        toast.success('Access granted. Authenticating...');
        const { accessToken, refreshToken, user } = response.data;

        localStorage.setItem('faculty_token', accessToken);
        localStorage.setItem('faculty_refresh_token', refreshToken);
        localStorage.setItem('faculty_user', JSON.stringify(user));

        navigate('/faculty-dashboard');
      }
    } catch (error) {
      console.error('Faculty login error:', error);

      if (error.pendingApproval) {
        toast.error('Identity pending administrator authorization');
        navigate('/faculty-waiting-approval', {
          state: { email: error.data?.email },
        });
        return;
      }

      toast.error(error.message || 'Authentication refused');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/10 transform rotate-3">
            <GraduationCap size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black tracking-tighter text-blue-900 italic uppercase">
          Faculty <span className="text-teal-600">Portal</span>
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-teal-600 uppercase tracking-widest">
          Academic Personnel Access
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 py-10 px-6 shadow-2xl rounded-[2.5rem] sm:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full -mr-12 -mt-12 transition-transform hover:scale-150 duration-700"></div>

          {blockedMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-xs font-bold uppercase tracking-wider">{blockedMessage}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                Email or Register Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <UserCheck size={18} />
                </div>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  placeholder="EX: 2024FAC001 or name@edu.com"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-blue-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
                Security Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-blue-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[1.25rem] shadow-xl text-sm font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ChevronRight size={18} className="ml-2" />}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black">
                <span className="px-2 bg-white text-slate-400 tracking-widest">New Faculty?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/faculty-register"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 transition-all group"
              >
                Create Account
                <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;
