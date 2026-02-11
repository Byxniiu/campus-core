import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Mail,
  Timer,
  RefreshCw,
  X,
  CheckCircle,
  GraduationCap,
  ChevronLeft,
  Radio,
} from 'lucide-react';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';
  const studentId = location.state?.studentId || null;
  const devOTP = location.state?.devOTP || null;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [remainingTime, setRemainingTime] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Identity not found. Please re-register.');
      navigate('/student-signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setResendEnabled(true);
      return;
    }

    const timer = setTimeout(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingTime]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.resendOTP(email);
      if (response.success) {
        toast.success('Security transmission sequence initiated.');
        setRemainingTime(60);
        setResendEnabled(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        if (response.data?.devOTP) {
          console.log('Development OTP:', response.data.devOTP);
          toast.success(`Dev Seq: ${response.data.devOTP}`, { duration: 5000 });
        }
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      toast.error('Security code incomplete.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP(email, fullOtp);
      if (response.success) {
        toast.success('Identity Verified. Arctic Access Granted.');
        navigate('/student-signin');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.data?.code === 'OTP_EXPIRED') {
        toast.error('Code expired. Request a new sequence.');
        setResendEnabled(true);
      } else {
        toast.error(error.message || 'Verification failure. Retry sequence.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] p-4 md:p-8 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] -z-0"></div>

      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-[40px] overflow-hidden border border-teal-50 relative z-10 px-10 py-16 md:px-20 md:py-20">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-950"></div>

        <header className="mb-12 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
              <GraduationCap size={24} className="text-teal-400" />
            </div>
            <span className="font-outfit text-3xl font-bold tracking-tight text-blue-950">
              Campus <span className="text-teal-500">Core</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/student-signup')}
            className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest hover:text-blue-950 transition-colors flex items-center gap-2 group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />{' '}
            Back
          </button>
        </header>

        <div className="text-center mb-12">
          <h2 className="text-6xl font-outfit font-bold tracking-tight text-blue-950 leading-none mb-6">
            Secure <span className="text-teal-500">Validation</span>
          </h2>
          <div className="flex flex-col items-center gap-3">
            <p className="inline-flex items-center gap-2.5 text-teal-600 bg-teal-50 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-teal-100">
              <Radio size={14} className="animate-pulse" /> Decrypting Communication Hub
            </p>
            <p className="text-blue-950/45 text-sm font-bold mt-4 uppercase tracking-[0.2em] leading-relaxed">
              Target Terminal:{' '}
              <span className="text-blue-950 underline underline-offset-8 decoration-teal-400/50 font-bold ml-1">
                {email}
              </span>
            </p>
          </div>
        </div>

        {devOTP && (
          <div className="mb-10 p-6 bg-blue-50/50 border border-teal-50 rounded-[24px] flex items-center justify-between shadow-inner backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-teal-500" />
              <span className="text-[10px] font-bold text-blue-900/40 uppercase tracking-[0.2em]">
                Security Debug Mode
              </span>
            </div>
            <span className="text-xl font-mono font-bold text-blue-950 tracking-[0.3em]">
              {devOTP}
            </span>
          </div>
        )}

        <div className="space-y-12">
          {studentId && (
            <div className="w-full p-8 bg-blue-50/30 border border-teal-50 rounded-[30px] shadow-inner text-center group transition-all hover:bg-blue-50/50">
              <p className="text-[10px] font-bold text-blue-900/30 uppercase tracking-[0.2em] mb-2">
                Assigned Student Identity
              </p>
              <p className="text-4xl font-outfit font-bold text-blue-950 tracking-tight">
                {studentId}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-16 md:w-16 md:h-20 text-center text-3xl font-outfit font-bold bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all shadow-inner text-blue-950"
              />
            ))}
          </div>

          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-2.5 text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">
              <Timer size={14} className="text-teal-500" />
              <span>
                Sync Expires:{' '}
                <span className="text-blue-950 font-bold ml-1">
                  {remainingTime < 10 ? `0${remainingTime}` : remainingTime}s
                </span>
              </span>
            </div>
            <button
              onClick={handleResendOtp}
              disabled={!resendEnabled || isLoading}
              className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all ${
                resendEnabled && !isLoading
                  ? 'text-teal-600 hover:text-teal-700 cursor-pointer'
                  : 'text-blue-200 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Resend Code
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/student-signup')}
              disabled={isLoading}
              className="flex-1 py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-[0.2em] text-blue-900/40 hover:bg-red-50 hover:text-red-500 transition-all active:scale-[0.98]"
            >
              Abort Verification
            </button>
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.join('').length !== 6}
              className="flex-[2] py-5 bg-blue-950 text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-[24px] shadow-2xl shadow-teal-100/50 hover:bg-teal-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading ? 'Verifying...' : 'Validate identity'}
              <CheckCircle size={18} className="text-teal-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
