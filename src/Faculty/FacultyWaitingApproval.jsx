import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import { Clock, CheckCircle2, Mail, Phone, ChevronLeft, ShieldCheck } from 'lucide-react';

const FacultyWaitingApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const { email, employeeId } = location.state || {};

  const handleCheckStatus = async () => {
    if (!email) {
      toast.error('Identity record not found');
      return;
    }

    setIsChecking(true);
    const loadingToast = toast.loading('Querying authorization status...');

    try {
      const response = await authAPI.checkApprovalStatus(email);

      if (response.success) {
        if (response.isApproved) {
          toast.success('Authorization Granted. Welcome!', { id: loadingToast });
          setTimeout(() => {
            navigate('/faculty-login');
          }, 2000);
        } else {
          toast.error('Identity still pending authorization', { id: loadingToast });
        }
      }
    } catch (error) {
      console.error('Status query error:', error);
      toast.error(error.message || 'Transmission failure', { id: loadingToast });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600/20 rounded-[2rem] mb-6 shadow-2xl relative">
            <Clock size={48} className="text-indigo-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
              <ShieldCheck size={12} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-2">
            Pending <span className="text-indigo-400">Authorization</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Registration Sequence Complete
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 px-4 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1 bg-slate-800 -z-10"></div>
            <StepIcon active done label="Register" />
            <StepIcon active done label="Verify" />
            <StepIcon active label="Approve" pulse />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Identity Info */}
            <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                Credited Identity
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black">Register Number</p>
                  <p className="text-xl font-black text-indigo-400 italic font-mono">
                    {employeeId || '2024FAC-TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black">Email Link</p>
                  <p className="text-sm font-bold text-white break-all">
                    {email || 'auth@univeristy.edu'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/20">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                Current Protocol
              </p>
              <div className="space-y-3">
                <StatusItem text="Credential validation" done />
                <StatusItem text="Background clearance" done />
                <StatusItem text="Admin authorization" active />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isChecking ? 'Checking Infrastructure...' : 'Refresh Authorization Status'}
            </button>
            <button
              onClick={() => navigate('/faculty-login')}
              className="w-full py-5 bg-slate-800 text-slate-300 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 transition-all"
            >
              Return to Terminal
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ContactCard
            icon={<Mail size={18} />}
            label="Inquiries"
            val="admin@campuscore.edu"
            href="mailto:admin@campuscore.edu"
          />
          <ContactCard icon={<Phone size={18} />} label="Direct Line" val="+91 98765 43210" />
        </div>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors tracking-widest"
          >
            <ChevronLeft size={14} />
            Back to Network Entry
          </Link>
        </div>
      </div>
    </div>
  );
};

const StepIcon = ({ label, active, done, pulse }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${
        done
          ? 'bg-emerald-500 border-emerald-500/20 text-white'
          : active
            ? 'bg-indigo-600 border-indigo-600/20 text-white'
            : 'bg-slate-800 border-slate-950 text-slate-600'
      } ${pulse ? 'animate-pulse' : ''}`}
    >
      {done ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
    </div>
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-600'}`}
    >
      {label}
    </span>
  </div>
);

const StatusItem = ({ text, done, active }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-emerald-500' : active ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`}
    ></div>
    <span
      className={`text-[10px] font-bold uppercase tracking-widest ${done ? 'text-slate-400 line-through' : active ? 'text-white' : 'text-slate-600'}`}
    >
      {text}
    </span>
  </div>
);

const ContactCard = ({ icon, label, val, href }) => (
  <div className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-2xl flex items-center gap-4">
    <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
      {href ? (
        <a
          href={href}
          className="text-xs font-bold text-white hover:text-indigo-400 transition-colors uppercase"
        >
          {val}
        </a>
      ) : (
        <p className="text-xs font-bold text-white uppercase">{val}</p>
      )}
    </div>
  </div>
);

export default FacultyWaitingApproval;
