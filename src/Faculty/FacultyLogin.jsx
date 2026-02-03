import React, { useState } from 'react';

const FacultyLogin = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email/ID, 2: OTP
  const [facultyId, setFacultyId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Handle OTP input auto-tabbing
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus logic
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (facultyId.length > 2) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    // Demo bypass code: 888888
    if (finalOtp === '888888') {
      onLoginSuccess();
    } else {
      alert("Invalid Code. For demo purposes, use: 888888");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Faculty Brand Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <header className="text-center mb-10">
            <h1 className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase mb-2">Faculty Core</h1>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Academic Login</h2>
          </header>

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-[0.2em]">Faculty ID / Email</label>
                <input 
                  type="text" 
                  required
                  placeholder="FAC-2026-XXXX" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/10 transition-all">
                Request Access Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-1">Verify Faculty Credentials</p>
                <p className="text-[10px] text-emerald-500 font-black tracking-widest uppercase italic">{facultyId}</p>
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
                <button type="submit" className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl text-xs uppercase tracking-[0.3em] hover:bg-slate-200 transition-all">
                  Authorize Session
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-[9px] font-black uppercase text-slate-600 hover:text-emerald-500 transition-all tracking-widest"
                >
                  Return to Identification
                </button>
              </div>
            </form>
          )}

          <footer className="mt-12 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.3em]">Institutional Single Sign-On Enabled</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;