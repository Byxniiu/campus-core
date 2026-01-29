import React, { useState } from 'react';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // Step 1: Login, Step 2: OTP
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to verify credentials and send email OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Admin Verified. Redirecting to Campus Core...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-slate-800 p-8 text-center">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-black tracking-widest">ADMIN / CAMPUS CORE</h1>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">Secure Access Gateway</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            /* STEP 1: CREDENTIALS */
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Username / Admin ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="admin_core_01"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex justify-center items-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Continue to Verification'}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h3 className="text-slate-800 font-bold">Check your email</h3>
                <p className="text-slate-500 text-xs mt-1">We've sent a 6-digit code to admin@institute.edu</p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-800 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg flex justify-center items-center"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Verify & Enter Core'}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-slate-400 text-xs font-bold hover:text-indigo-600 transition"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-tighter">
            Authorized Personnel Only • IP logged: 192.168.1.104
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;