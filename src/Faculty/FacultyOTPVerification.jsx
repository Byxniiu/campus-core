import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import {
  ShieldAlert,
  Fingerprint,
  Calendar,
  RefreshCw,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

const FacultyOTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { userId, email, employeeId } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      toast.error('Session terminated. Re-authenticate.');
      navigate('/faculty-register');
      return;
    }
  }, [userId, email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast.error('Invalid credential length');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verify({ userId, otp });

      if (response.success) {
        toast.success('Identity verified successfully');
        navigate('/faculty-waiting-approval', {
          state: { email, employeeId },
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      const response = await authAPI.resendOTP({ userId, email });
      if (response.success) {
        toast.success('New sequence transmitted');
        setTimer(60);
        setCanResend(false);
        setOtp('');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Signal failure');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-600/10 rotate-12">
            <Fingerprint size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter mb-2">
            Identity <span className="text-emerald-600">Verification</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Factor Two Authentication Sequence
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600"></div>

          {/* Identity Box */}
          <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center group hover:border-emerald-500/30 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              Allocated Academic Identity
            </p>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-600 tracking-tighter mb-1 uppercase italic">
                {employeeId || 'PENDING...'}
              </span>
              <span className="text-xs font-bold text-slate-500">{email}</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600/80">
              <CheckCircle size={14} />
              <span className="text-[10px] uppercase font-black tracking-widest">
                Register Number Locked
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">
                Input 6-Digit Secondary Key
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 text-center text-4xl font-black text-slate-900 italic tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-200"
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? 'Validating...' : 'Confirm Identity'}
                {!isLoading && <ShieldAlert size={18} />}
              </button>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Calendar size={14} />
                  <span>
                    Expires in: <span className="text-emerald-600">{timer}s</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || isResending}
                  className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    canResend && !isResending
                      ? 'text-emerald-600 hover:text-emerald-500'
                      : 'text-slate-300'
                  }`}
                >
                  <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
                  Resend Sequence
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-slate-500 text-xs leading-relaxed">
            <span className="font-bold text-emerald-600">PROTOCOL:</span> Verification is the first
            step. Administrator approval is required before dashboard access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyOTPVerification;
