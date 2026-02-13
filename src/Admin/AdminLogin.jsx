import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLoginRequest } from '../api/admin';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });

  const navigate = useNavigate();
  const login = useAdminAuthStore((state) => state.login);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('🔐 Admin login attempt:', credentials.identifier);
      const response = await adminLoginRequest(credentials);
      console.log('📦 Admin login response:', response);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        console.log('👤 Admin user:', user);
        console.log('🔑 Access token exists:', !!accessToken);
        console.log('🔄 Refresh token exists:', !!refreshToken);
        console.log('💾 Calling AdminAuthStore.login()...');

        login(user, accessToken, refreshToken);

        // Verify it was saved
        setTimeout(() => {
          const stored = localStorage.getItem('admin-auth');
          console.log('🗄️ Stored in localStorage (admin-auth):', stored ? 'YES' : 'NO');
          if (stored) {
            const parsed = JSON.parse(stored);
            console.log('📄 Admin storage content:', parsed);
            console.log('✅ Admin role:', parsed.state?.user?.role);
            console.log('✅ Token saved:', !!parsed.state?.token);
          } else {
            console.error('❌ PROBLEM: admin-auth key not found in localStorage!');
          }
        }, 100);

        toast.success('Admin Access Granted!');
        navigate('/admin-core-dashboard');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-white p-8 text-center border-b border-slate-100">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4 text-white shadow-lg shadow-blue-100">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-blue-900 text-2xl font-black tracking-widest uppercase italic">
            PROFESSIONAL <span className="text-teal-600">HUB</span>
          </h1>
          <p className="text-teal-600 text-xs mt-2 uppercase tracking-widest font-bold">
            Authorized Personnel Access Only
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Username / Admin ID
              </label>
              <input
                type="text"
                name="identifier"
                required
                value={credentials.identifier}
                onChange={handleInputChange}
                placeholder="admin@campuscore.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Access Admin Dashboard'
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <p className="text-[10px] text-teal-600 font-bold text-center uppercase tracking-tighter">
            Authorized <span className="text-blue-900">Personnel Only</span> • Secure Campus Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
