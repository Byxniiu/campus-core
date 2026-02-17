import React, { useState } from 'react';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CounselorLogin = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authAPI.login(identifier, password);
      if (res.success) {
        // Ensure user is actually a counselor or admin
        if (res.data.user.role !== 'counselor' && res.data.user.role !== 'admin') {
          toast.error('Unauthorized: This portal is for Counseling staff only.');
          return;
        }

        loginStore.login(res.data.user, res.data.accessToken, res.data.refreshToken);
        toast.success(`Welcome Counselor ${res.data.user.firstName}`);
        navigate('/counselor-home');
      }
    } catch (err) {
      toast.error(err?.message || err || 'Access compilation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Aesthetic Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <header className="text-center mb-10">
            <h1 className="text-xs font-black tracking-[0.4em] text-indigo-500 uppercase mb-2">
              Campus Core
            </h1>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
              Counselor Portal
            </h2>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">
                Counselor ID / Email
              </label>
              <input
                type="text"
                required
                placeholder="CC-COUN-001"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">
                Access Protocol (Password)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : null}
              {isLoading ? 'Decrypting Access...' : 'Verify & Enter'}
            </button>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
              Secure Faculty Access Only
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CounselorLogin;
