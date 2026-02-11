import React, { useState } from 'react';
import {
  MapPin,
  Info,
  Send,
  CheckCircle2,
  ChevronLeft,
  Shield,
  Building,
  Waves,
  Radio,
  Anchor,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyAssistPage = () => {
  // State to hold form data
  const [request, setRequest] = useState({
    assistanceType: '',
    location: '',
    details: '',
    isNewComer: false,
  });

  // State for submission feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const assistanceOptions = [
    'Lost and Found',
    'Campus Navigation',
    'Facility Malfunction',
    'First Aid / Minor Injury',
    'General Inquiry',
  ];

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setRequest((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API submission delay
    setTimeout(() => {
      console.log('Emergency Assist Request Submitted:', request);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] p-6 font-jakarta relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 md:p-20 rounded-[40px] shadow-2xl shadow-teal-100 border border-teal-50 text-center max-w-xl w-full relative z-10"
        >
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-teal-100 shadow-inner group transition-all"
          >
            <CheckCircle2
              size={48}
              className="text-blue-950 group-hover:scale-110 transition-transform"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-outfit font-bold tracking-tight text-blue-950 mb-6 leading-none"
          >
            Request Logged
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-950/60 text-lg leading-relaxed mb-10 font-medium"
          >
            We've alerted the nearest <span className="text-teal-600 font-bold">Support Node</span>.
            A staff member will converge at your coordinates shortly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50/50 p-8 rounded-3xl mb-12 text-left border border-teal-50 flex items-center justify-between shadow-inner"
          >
            <div>
              <p className="text-[10px] font-bold text-blue-900/30 uppercase tracking-[0.2em] mb-2">
                Packet Hash
              </p>
              <p className="font-mono font-bold text-blue-950 tracking-tighter">
                AST-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            <Radio className="text-teal-400 animate-pulse" size={32} />
          </motion.div>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#0d9488' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-blue-950 text-white font-bold rounded-2xl transition shadow-xl shadow-teal-100/50 text-xs uppercase tracking-[0.2em]"
            >
              Return to Node
            </motion.button>
          </Link>
        </motion.div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6 font-jakarta relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[80px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <motion.div whileHover={{ x: -10 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-900/40 hover:text-teal-600 font-bold text-[10px] uppercase tracking-widest mb-8 transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />{' '}
            Back to Dashboard
          </Link>
        </motion.div>

        <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl shadow-teal-100 border border-teal-50 relative overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 left-0 w-full h-2 bg-blue-950 origin-left"
          ></motion.div>

          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="bg-blue-950 p-3 rounded-xl shadow-lg shadow-teal-100">
                <Shield size={20} className="text-teal-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-900/30 uppercase tracking-[0.2em]">
                Global Support Infrastructure
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-outfit font-bold tracking-tight text-blue-950 mb-6 leading-none"
            >
              Emergency <span className="text-teal-500">Assist</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-blue-950/60 text-lg font-medium leading-relaxed"
            >
              Immediate non-academic support. Connection to campus staff for navigation, facility
              issues, and logistics.
            </motion.p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1">
                Assistance Specification
              </label>
              <div className="relative">
                <select
                  id="assistanceType"
                  value={request.assistanceType}
                  onChange={handleChange}
                  required
                  className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 appearance-none cursor-pointer placeholder:text-blue-300"
                >
                  <option value="" disabled>
                    Select a category...
                  </option>
                  {assistanceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-300">
                  <Waves size={18} className="animate-pulse" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
                <MapPin size={14} className="text-teal-500" /> Current Coordinates
              </label>
              <input
                type="text"
                id="location"
                value={request.location}
                onChange={handleChange}
                placeholder="e.g., Block B Core, Library Entrance, Lab 102"
                required
                className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
                <Info size={14} className="text-teal-500" /> Request Details
              </label>
              <textarea
                id="details"
                value={request.details}
                onChange={handleChange}
                rows="3"
                placeholder="Provide brief context... this helps us respond faster."
                className="w-full p-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner resize-none h-32"
              ></textarea>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() =>
                handleChange({
                  target: { id: 'isNewComer', type: 'checkbox', checked: !request.isNewComer },
                })
              }
              className="flex items-center gap-5 p-6 bg-blue-50/30 rounded-3xl border border-teal-50 group cursor-pointer transition-all hover:bg-teal-50/50 shadow-inner"
            >
              <div className="relative flex items-center">
                <input
                  id="isNewComer"
                  type="checkbox"
                  checked={request.isNewComer}
                  onChange={handleChange}
                  className="w-6 h-6 rounded-lg border-teal-100 text-blue-950 focus:ring-teal-500 transition-all cursor-pointer opacity-0 absolute z-10"
                />
                <motion.div
                  animate={{ scale: request.isNewComer ? [1, 1.1, 1] : 1 }}
                  className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${request.isNewComer ? 'bg-blue-950 border-blue-950' : 'bg-white border-teal-100'}`}
                >
                  {request.isNewComer && <CheckCircle2 size={16} className="text-teal-400" />}
                </motion.div>
              </div>
              <label
                htmlFor="isNewComer"
                className="text-sm font-bold text-blue-950/40 cursor-pointer uppercase tracking-tight"
              >
                Flag as Newcomer (Requires Priority Navigation)
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0d9488' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-blue-950 text-white font-bold rounded-3xl shadow-2xl shadow-teal-100/50 transition-all flex justify-center items-center gap-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  ></motion.div>
                ) : (
                  <Anchor size={18} className="text-teal-400" />
                )}
                <span className="uppercase tracking-[0.2em] text-xs font-bold">
                  {isLoading ? 'Initializing Support...' : 'Broadcast to Staff Node'}
                </span>
              </motion.button>
              <p className="text-[10px] text-center text-blue-950/30 font-bold uppercase tracking-[0.3em] mt-10 flex items-center justify-center gap-3">
                <Radio className="w-4 h-4 text-teal-400 animate-pulse" /> Staff Response: 5-8
                Minutes Average
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyAssistPage;
