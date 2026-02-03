import React, { useState } from 'react';

const StaffLogin = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: Staff ID/Email, 2: OTP
  const [staffId, setStaffId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Handle OTP input navigation
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next box automatically
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (staffId.length > 3) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    // Demo bypass code: 000000
    if (finalOtp === '000000') {
      onLoginSuccess();
    } else {
      alert("Verification failed. For demo purposes, use code: 000000");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Amber Glow Accent for Staff Identity */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <header className="text-center mb-10">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-amber-500">🛠️</span>
            </div>
            <h1 className="text-xs font-black tracking-[0.4em] text-slate-500 uppercase mb-2">Campus Core</h1>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Staff Portal</h2>
          </header>

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Employee ID or Email</label>
                <input 
                  type="text" 
                  required
                  placeholder="EMP-XXXXX" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold placeholder:text-slate-600"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/10 transition-all transform active:scale-95">
                Send OTP
              </button>
              <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">Access restricted to authorized personnel</p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-1">
                <p className="text-sm text-slate-400 font-medium">Verify your identity</p>
                <p className="text-xs text-amber-500 font-black tracking-widest">{staffId}</p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 bg-slate-800 border border-slate-700 rounded-xl text-center text-xl font-black text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button type="submit" className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all shadow-xl">
                  Log In
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-[9px] font-black uppercase text-slate-600 hover:text-amber-500 transition-all tracking-widest text-center"
                >
                  Return to Identification
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;