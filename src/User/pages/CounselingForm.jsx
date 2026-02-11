import React, { useState } from 'react';
import {
  Heart,
  Send,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Clock,
  User,
  Phone,
  Mail,
  Waves,
  Anchor,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CounselingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: 'Individual Counseling',
    urgency: 'Standard',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API submission
    setTimeout(() => {
      console.log('Counseling Request Submitted:', formData);
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Request sent securely through the campus network');
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6 font-jakarta">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-teal-100/40 text-center max-w-xl w-full border border-teal-50 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-teal-100 shadow-inner group transition-all">
            <CheckCircle2
              size={48}
              className="text-blue-950 group-hover:scale-110 transition-transform"
            />
          </div>
          <h2 className="text-4xl font-outfit font-bold text-blue-950 mb-6 tracking-tight">
            Request Received
          </h2>
          <p className="text-blue-950/60 text-lg leading-relaxed mb-12 font-medium">
            Your request has been securely logged. Our professional counselors will review your
            details and reach out within <span className="text-teal-600 font-bold">24 hours</span>.
          </p>
          <div className="bg-blue-50/50 p-8 rounded-3xl mb-12 text-left border border-teal-50 flex items-start gap-4 shadow-inner">
            <ShieldCheck className="text-teal-500 mt-1" size={24} />
            <div>
              <p className="text-[10px] font-bold text-blue-950/40 uppercase tracking-[0.2em] mb-2">
                Privacy Guarantee
              </p>
              <p className="text-sm font-medium text-blue-950/60 leading-relaxed">
                This conversation and your records are end-to-end encrypted and strictly
                confidential within the campus professional matrix.
              </p>
            </div>
          </div>
          <Link to="/">
            <button className="w-full py-5 bg-blue-950 text-white font-bold rounded-2xl hover:bg-teal-600 transition shadow-xl shadow-teal-100/50 active:scale-[0.98] text-xs uppercase tracking-[0.2em]">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-3xl w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-900/40 hover:text-teal-600 font-bold text-[10px] uppercase tracking-widest mb-8 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Dashboard
        </Link>

        <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl shadow-teal-100/40 border border-teal-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-950"></div>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-50 p-2.5 rounded-xl border border-teal-50 shadow-inner">
                <Heart size={20} className="text-teal-500 fill-teal-500/10" />
              </div>
              <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                Professional Care Network
              </span>
            </div>
            <h1 className="text-6xl font-outfit font-bold tracking-tight text-blue-950 mb-6 leading-none">
              Counseling <span className="text-teal-500">Request</span>
            </h1>
            <p className="text-blue-950/60 text-lg font-medium leading-relaxed">
              Take the first step toward wellness. Your mental health is our highest institutional
              priority.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2.5">
                  <User size={14} className="text-teal-500" /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  required
                  placeholder="e.g. John"
                  className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  required
                  placeholder="e.g. Doe"
                  className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2.5">
                  <Mail size={14} className="text-teal-500" /> Institution Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  required
                  placeholder="john@campus.edu"
                  className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2.5">
                  <Phone size={14} className="text-teal-500" /> Verified Contact
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2.5">
                  <ShieldCheck size={14} className="text-teal-500" /> Type of Care
                </label>
                <div className="relative">
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 appearance-none cursor-pointer shadow-inner pr-12"
                    onChange={handleChange}
                  >
                    <option>Individual Counseling</option>
                    <option>Couples Therapy</option>
                    <option>Group Session</option>
                    <option>Peer Support</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-300">
                    <Waves size={18} className="animate-pulse" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2.5">
                  <Clock size={14} className="text-teal-500" /> Incident Priority
                </label>
                <div className="flex gap-4 p-1.5 bg-blue-50/50 border border-teal-50 rounded-2xl h-[62px] shadow-inner">
                  {['Standard', 'Urgent'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, urgency: level }))}
                      className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                        formData.urgency === level
                          ? 'bg-white text-blue-950 shadow-md border border-teal-100'
                          : 'text-blue-300 hover:text-teal-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1">
                Clinical Context (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                rows="4"
                placeholder="Briefly describe what's on your mind... all information provided is strictly confidential."
                className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 resize-none h-40 shadow-inner"
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-blue-950 text-white font-bold rounded-3xl shadow-2xl shadow-teal-100/50 hover:bg-teal-600 transition-all flex justify-center items-center gap-4 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Anchor size={18} className="text-teal-400" />
                )}
                <span className="uppercase tracking-[0.2em] text-xs font-bold">
                  {isLoading ? 'Initializing Protocol...' : 'Finalise Care Request'}
                </span>
              </button>
              <div className="flex flex-col items-center gap-6 mt-12">
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-blue-900/30 uppercase tracking-[0.2em]">
                  <ShieldCheck size={14} className="text-teal-500" /> Secure Campus Transmission
                </div>
                <p className="max-w-xs text-[10px] text-center text-blue-950/30 font-bold uppercase tracking-widest leading-relaxed">
                  By submitting, you agree to our confidential care terms. In case of immediate
                  danger, please use the SOS feature.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselingForm;
