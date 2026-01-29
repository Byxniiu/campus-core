import React, { useState, useEffect } from 'react';

const SOSSystem = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Logic for "Hold to Trigger" (3 seconds)
  useEffect(() => {
    let interval;
    if (isHolding && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => prev + 2);
      }, 30);
    } else if (progress >= 100) {
      triggerSOS();
      clearInterval(interval);
    } else {
      setProgress(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isHolding, progress]);

  const triggerSOS = () => {
    setIsSent(true);
    setIsHolding(false);
    // Simulate notification appearing on other faculty devices
    setTimeout(() => setShowNotification(true), 1000);
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      
      {/* 1. FACULTY PUSH NOTIFICATION SIMULATION */}
      {showNotification && (
        <div className="fixed top-4 right-4 w-80 bg-white/95 backdrop-blur shadow-2xl border-l-4 border-red-600 rounded-lg p-4 z-50 animate-bounce">
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">EMERGENCY ALERT</h4>
              <p className="text-xs text-slate-600 mt-1">
                <strong>Location:</strong> Counseling Block - Room 204
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Immediate assistance required by Faculty/Student.</p>
              <div className="mt-3 flex gap-2">
                <button className="bg-red-600 text-white text-[10px] px-3 py-1.5 rounded font-bold uppercase tracking-wider">I'm Responding</button>
                <button onClick={() => setShowNotification(false)} className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRIGGER INTERFACE */}
      <div className="max-w-md w-full text-center space-y-8">
        {!isSent ? (
          <>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">SOS Trigger</h2>
              <p className="text-slate-500 text-sm px-8">Pressing this button will instantly alert all campus faculty and security with your location.</p>
            </div>

            <div className="relative flex justify-center items-center py-12">
              {/* Outer Pulse Rings */}
              <div className={`absolute w-48 h-48 bg-red-200 rounded-full animate-ping opacity-20 ${isHolding ? 'hidden' : 'block'}`}></div>
              
              {/* Main Button */}
              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 select-none ${
                  isHolding ? 'bg-red-700' : 'bg-red-600'
                }`}
              >
                <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-white font-black text-xl tracking-widest">SOS</span>
                
                {/* Progress Ring Overlay */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="80" cy="80" r="76"
                    stroke="white"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="477"
                    strokeDashoffset={477 - (477 * progress) / 100}
                    className="transition-all duration-100 ease-linear opacity-40"
                    style={{ transform: 'translate(0, 0)' }}
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm font-bold text-red-600 animate-pulse">
              {isHolding ? "HOLDING... KEEP PRESSING" : "HOLD BUTTON FOR 3 SECONDS"}
            </p>
          </>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-green-500 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Alert Dispatched</h2>
            <p className="text-slate-500 mt-2">Faculty members have been notified. Stay where you are; help is on the way.</p>
            <button 
              onClick={() => {setIsSent(false); setShowNotification(false);}}
              className="mt-6 text-indigo-600 font-semibold hover:underline"
            >
              Cancel False Alarm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSSystem;