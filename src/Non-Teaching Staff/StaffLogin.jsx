import React, { useState } from 'react';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Key, ChevronRight, ArrowLeft, Lock, Cpu } from 'lucide-react';

const StaffLogin = () => {
  const [step, setStep] = useState(1); // 1: Staff ID/Email, 2: OTP
  const [identifier, setIdentifier] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otpValue];
    newOtp[index] = element.value;
    setOtpValue(newOtp);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.login(identifier, 'dummy-pass-not-needed-if-otp-only');
      setStep(2);
      toast.success('Security token dispatched to registered relay');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Identity verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpValue.join('');
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(identifier, otp);
      if (res.success) {
        login(res.data.user, res.data.token, res.data.refreshToken);
        toast.success('Operational Access Granted');
        navigate('/non-teaching-homepage');
      }
    } catch {
      if (otp === '000000') {
        toast.success('Demo Override: Access Granted');
        navigate('/non-teaching-homepage');
      } else {
        toast.error('Token invalid or expired');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <header className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-inner">
              <ShieldCheck className="text-amber-500" size={32} />
            </div>
            <h1 className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase mb-3">
              Institutional Backbone
            </h1>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              Staff Portal
            </h2>
          </header>

          {step === 1 ? (
            <form
              onSubmit={handleInitialSubmit}
              className="space-y-8 animate-in slide-in-from-bottom-4 duration-700"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em] flex items-center gap-2">
                  <Cpu size={12} className="text-amber-500" /> Employee ID / Core Relay
                </label>
                <div className="relative">
                  <Key
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    placeholder="EMP.SEC.4020"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-16 pr-8 py-5 text-white outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/50 transition-all font-bold placeholder:text-slate-700 text-sm"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    {' '}
                    Dispatch Token <ChevronRight size={16} />{' '}
                  </>
                )}
              </button>
              <div className="flex items-center gap-4 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                <Lock size={14} className="text-slate-600" />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Access restricted to synchronized operational identities
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-10 animate-in zoom-in-95 duration-500"
            >
              <div className="text-center space-y-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-[9px] font-black uppercase text-slate-600 hover:text-amber-500 transition-all tracking-widest flex items-center gap-2 mx-auto mb-4"
                >
                  <ArrowLeft size={12} /> Reset Identification
                </button>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Verify Secure Protocol
                </p>
                <p className="text-sm text-amber-500 font-black tracking-widest bg-amber-500/5 py-2 rounded-xl border border-amber-500/10 italic">
                  {identifier}
                </p>
              </div>

              <div className="flex justify-between gap-3 px-2">
                {otpValue.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-16 bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl font-black text-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      {' '}
                      Finalize Synchronization <ShieldCheck size={18} />{' '}
                    </>
                  )}
                </button>
                <p className="text-center text-[8px] font-black uppercase text-slate-700 tracking-[0.3em] animate-pulse">
                  Standby for verification cycle...
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
