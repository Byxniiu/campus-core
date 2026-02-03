import React, { useState } from 'react';

const CounselorLogin = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Handle OTP input jumping
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    if (finalOtp === '123456') { // Demo Bypass Code
      onLoginSuccess();
    } else {
      alert("Invalid OTP. For demo use: 123456");
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
            <h1 className="text-xs font-black tracking-[0.4em] text-indigo-500 uppercase mb-2">Campus Core</h1>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Counselor Portal</h2>
          </header>

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Identify Yourself</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@campuscore.edu" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all">
                Generate OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2 font-medium">Verification code sent to:</p>
                <p className="text-xs text-indigo-400 font-bold">{email}</p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 bg-slate-800 border border-slate-700 rounded-xl text-center text-xl font-black text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all">
                  Verify & Enter
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-[10px] font-black uppercase text-slate-600 hover:text-slate-400 transition-all tracking-widest"
                >
                  Change Email Address
                </button>
              </div>
            </form>
          )}

          <footer className="mt-12 text-center">
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Secure Faculty Access Only</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CounselorLogin;