import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ShieldAlert,
  Navigation,
  X,
  Check,
  Activity,
  ShieldCheck,
  Waves,
  Radio,
  Anchor,
} from 'lucide-react';
import { sosAPI } from '../../api/sos';
import toast from 'react-hot-toast';

const SOSSystem = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSent, setIsSent] = useState(false);

  // Logic for "Hold to Trigger" (3 seconds)
  useEffect(() => {
    let interval;
    if (isHolding && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => prev + 2.5);
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

  const triggerSOS = async () => {
    try {
      await sosAPI.createAlert({
        location: 'Automatic - GPS / Floor Plan', // In a real app, use Geolocation API
        type: 'Emergency',
        message: 'SOS Triggered via Student Mobile App',
      });
      setIsSent(true);
      setIsHolding(false);
      toast.success('Emergency alert broadcasted successfully');
    } catch (error) {
      console.error('SOS Error:', error);
      toast.error('Failed to broadcast SOS. Please try again.');
      setIsHolding(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center p-8 relative overflow-hidden font-jakarta">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05)_0,transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-teal-500 to-blue-900 animate-pulse"></div>

      {/* Decorative Blur */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-400/10 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-md w-full text-center z-10">
        {!isSent ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-center mb-10">
              <div className="bg-white/5 p-8 rounded-[40px] border border-blue-400/20 shadow-2xl shadow-teal-900/20 group transition-all">
                <ShieldAlert
                  size={80}
                  className="text-teal-400 group-hover:scale-110 transition-transform"
                />
              </div>
            </div>

            <div className="space-y-6 mb-16">
              <h1 className="text-7xl font-outfit font-bold tracking-tight text-white leading-none">
                Emergency <span className="text-teal-500">SOS</span>
              </h1>
              <p className="text-blue-100/40 text-lg font-medium px-4 leading-relaxed">
                Initiate immediate campus-wide distress protocol. Your institutional location will
                be broadcasted to all security nodes.
              </p>
            </div>

            <div className="relative flex justify-center items-center mb-20">
              {/* Pulse Rings */}
              {!isHolding && (
                <>
                  <div className="absolute w-56 h-56 bg-teal-400/10 rounded-full animate-ping"></div>
                  <div className="absolute w-72 h-72 bg-blue-400/5 rounded-full animate-ping delay-300"></div>
                </>
              )}

              {/* Main Button */}
              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className={`relative z-10 w-52 h-52 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_80px_rgba(45,212,191,0.2)] active:scale-95 select-none overflow-hidden group border-8 border-white/10 ${
                  isHolding
                    ? 'bg-blue-900 scale-110 border-teal-400/30'
                    : 'bg-blue-950 hover:bg-blue-900'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-teal-400/10 to-transparent"></div>
                <AlertCircle
                  className={`w-16 h-16 text-teal-400 mb-2 transition-transform duration-300 ${isHolding ? 'scale-125 rotate-12' : ''}`}
                />
                <span className="text-white font-bold text-3xl tracking-[0.1em] uppercase">
                  ACTIVATE
                </span>

                {/* Progress Overlay */}
                <div
                  className="absolute bottom-0 left-0 w-full bg-teal-400/20 transition-all duration-100 ease-linear"
                  style={{ height: `${progress}%` }}
                ></div>
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-3xl inline-flex flex-col items-center gap-4 border border-blue-400/10 shadow-inner">
              <div className="flex items-center gap-3">
                <Activity
                  size={16}
                  className={isHolding ? 'text-teal-400 animate-spin' : 'text-blue-200/40'}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/60">
                  {isHolding ? 'Broadcasting Distress Signal...' : 'Institutional Safety Protocol'}
                </span>
              </div>
              <div className="w-full bg-blue-900 h-1.5 rounded-full overflow-hidden border border-blue-800">
                <div
                  className={`h-full transition-all duration-100 ${isHolding ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-teal-400/20'}`}
                  style={{ width: `${isHolding ? progress : 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-3xl p-12 md:p-16 rounded-[40px] border border-blue-400/20 shadow-2xl animate-in zoom-in duration-700 flex flex-col items-center">
            <div className="w-32 h-32 bg-teal-400/10 rounded-[32px] flex items-center justify-center mb-10 border border-teal-400/20 shadow-[0_0_50px_rgba(45,212,191,0.2)]">
              <ShieldCheck className="w-16 h-16 text-teal-400" />
            </div>
            <h1 className="text-6xl font-outfit font-bold tracking-tight text-white mb-6">
              Signal <span className="text-teal-500">Live</span>
            </h1>
            <p className="text-blue-100/40 text-lg mb-12 leading-relaxed font-medium">
              Security forces and response units have been deployed. Maintain your current
              coordinates for node convergence.
            </p>

            <div className="w-full space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-blue-400/10">
                <Radio className="text-teal-400 animate-pulse" size={24} />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-blue-200/40 uppercase tracking-widest">
                    Live Coordinate Sync
                  </p>
                  <p className="text-sm font-bold text-white tracking-tight">
                    Active GPS Uplink Established
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSent(false)}
                className="w-full bg-white text-blue-950 py-6 rounded-3xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-teal-50 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] shadow-2xl shadow-white/5"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" /> Decommission
                Alert
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 text-blue-200/20 text-[10px] font-bold uppercase tracking-[0.3em]">
          <Waves size={14} className="text-teal-500/20" />
          <span>NODE SECURED</span>
          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,1)]"></div>
          <span>V4.2 ARCTIC PROTOCOL</span>
          <Anchor size={14} className="text-teal-500/20" />
        </div>
        <p className="text-blue-100/10 text-[9px] font-bold uppercase tracking-[0.1em]">
          © Institutional Campus Infrastructure
        </p>
      </div>
    </div>
  );
};

export default SOSSystem;
