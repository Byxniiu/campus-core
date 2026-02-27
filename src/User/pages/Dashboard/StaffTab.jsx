import React, { useState, useEffect, useCallback } from 'react';
import { UserCircle, Send, ArrowLeft, Headphones, Waves, Anchor, Radio } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { staffAPI } from '../../../api/staff.js';
import { helpRequestAPI } from '../../../api/helpRequest.js';

const StaffTab = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const data = await staffAPI.getStaff();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    preferredDate: '',
    consent: false,
    attachments: [],
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setRequestData({ ...requestData, attachments: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestData.consent) {
      toast.error('Please confirm that the information is correct.');
      return;
    }

    setIsSubmitting(true);
    try {
      await helpRequestAPI.create({
        staffId: selectedItem._id,
        category: 'Student Support',
        ...requestData,
      });
      toast.success('Institutional Support Request initialized successfully.');
      setSelectedItem(null);
      setRequestData({
        title: '',
        description: '',
        priority: 'Medium',
        preferredDate: '',
        consent: false,
        attachments: [],
      });
    } catch (error) {
      console.error('Request error:', error);
      toast.error(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[48px] border border-teal-50 shadow-2xl shadow-teal-100/30 relative overflow-hidden font-jakarta"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => setSelectedItem(null)}
          className="mb-14 text-blue-950/40 hover:text-teal-600 flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Staff Hub
        </motion.button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
          <div className="flex gap-10 items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 bg-blue-50/50 text-blue-950 rounded-[36px] flex items-center justify-center border border-teal-50 shadow-inner group transition-all duration-500 overflow-hidden"
            >
              {selectedItem.avatar ? (
                <img
                  src={`http://localhost:3000${selectedItem.avatar}`}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                <UserCircle
                  size={64}
                  className="text-teal-400 opacity-30 group-hover:opacity-60 transition-opacity"
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-tight uppercase">
                {selectedItem.firstName} {selectedItem.lastName}
              </h2>
              <p className="text-blue-950/30 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 mt-5">
                <Headphones size={16} className="text-teal-500 animate-pulse" />{' '}
                {selectedItem.category}
              </p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-950 px-12 py-8 rounded-[36px] text-white shadow-2xl shadow-teal-100/30 border border-blue-900"
          >
            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-[0.3em] mb-3">
              Availability
            </p>
            <p className="text-2xl font-bold tracking-tight font-outfit uppercase">
              {selectedItem.availability || 'General Hours'}
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.3em] ml-2">
                Request Priority
              </label>
              <div className="flex gap-3">
                {['Low', 'Medium', 'High'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRequestData({ ...requestData, priority: p })}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      requestData.priority === p
                        ? 'bg-blue-950 text-teal-400 shadow-lg'
                        : 'bg-white border border-teal-50 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.3em] ml-2">
                Preferred Resolution Date
              </label>
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input && input.showPicker) input.showPicker();
                }}
              >
                <input
                  type="date"
                  value={requestData.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setRequestData({ ...requestData, preferredDate: e.target.value })
                  }
                  className="w-full bg-blue-50/30 border border-teal-100 rounded-2xl px-6 py-3.5 text-blue-950 font-bold outline-none focus:border-teal-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.3em] ml-2">
                  Supporting Documents (Optional)
                </label>
                <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                  Admission Confirmation Letter (PDF)
                </span>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full bg-blue-50/30 border border-teal-100 rounded-2xl px-6 py-3.5 text-[10px] font-bold text-blue-950 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-blue-950 file:text-teal-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.3em] ml-2">
              Subject / Title
            </label>
            <input
              required
              type="text"
              value={requestData.title}
              onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
              className="w-full px-8 py-5 bg-blue-50/30 border border-teal-100 rounded-[28px] focus:ring-8 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-base"
              placeholder="Enter the primary objective of this request..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.3em] ml-2">
              Detailed Specification
            </label>
            <textarea
              required
              value={requestData.description}
              onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
              className="w-full p-10 bg-blue-50/30 border border-teal-100 rounded-[36px] h-56 focus:ring-8 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all placeholder:text-blue-950/20 font-bold text-blue-950 text-base"
              placeholder="Describe the institutional assistance required..."
            ></textarea>
          </div>

          <div className="flex items-center gap-4 bg-teal-50/50 p-6 rounded-[24px] border border-teal-100">
            <input
              type="checkbox"
              id="consent"
              checked={requestData.consent}
              onChange={(e) => setRequestData({ ...requestData, consent: e.target.checked })}
              className="w-5 h-5 rounded-md border-teal-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <label
              htmlFor="consent"
              className="text-[11px] font-bold text-blue-950/60 uppercase tracking-widest cursor-pointer"
            >
              I confirm that the above information is correct and legitimate.
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#0d9488' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-950 text-white w-full py-7 rounded-[30px] font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 transition-all shadow-[0_20px_50px_rgba(30,58,138,0.2)] disabled:opacity-50 group mt-4"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full"
              ></motion.div>
            ) : (
              <>
                Initialize Request Node{' '}
                <Send
                  size={20}
                  className="text-teal-400 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"
                />
              </>
            )}
          </motion.button>
        </form>
        <div className="absolute -bottom-16 right-0 opacity-[0.02] pointer-events-none transform rotate-12">
          <Waves size={400} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto pb-20 font-jakarta"
    >
      <div className="grid gap-10">
        {staff.map((s) => (
          <motion.div
            key={s._id}
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: '#2dd4bf' }}
            onClick={() => setSelectedItem(s)}
            className="group bg-white p-12 rounded-[48px] border border-teal-50 hover:shadow-2xl hover:shadow-teal-100/30 transition-all duration-700 cursor-pointer flex justify-between items-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-full bg-blue-50 group-hover:bg-blue-950 transition-colors"></div>
            <div className="flex items-center gap-10 pl-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-20 h-20 bg-blue-50/50 rounded-[28px] flex items-center justify-center text-blue-200 group-hover:bg-blue-950 group-hover:text-teal-400 transition-all duration-700 shadow-inner overflow-hidden"
              >
                {s.avatar ? (
                  <img
                    src={`http://localhost:3000${s.avatar}`}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  <UserCircle
                    size={44}
                    className="opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </motion.div>
              <div>
                <h3 className="font-outfit font-bold text-4xl text-blue-950 group-hover:text-teal-600 transition tracking-tight mb-3 uppercase">
                  {s.firstName} {s.lastName}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-blue-950/30 font-bold uppercase tracking-[0.2em]">
                  <span className="text-[10px] flex items-center gap-2">
                    <Headphones size={14} className="text-teal-500" /> {s.category}
                  </span>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                  <span className="text-[10px] flex items-center gap-2">
                    <Radio size={14} className="text-teal-500" /> {s.availability || 'Available'}
                  </span>
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="w-16 h-16 rounded-[24px] flex items-center justify-center text-blue-950/20 transition-all opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 bg-blue-50/50 border border-teal-50 group-hover:bg-blue-950 group-hover:text-teal-400 group-hover:shadow-[0_20px_40px_rgba(30,58,138,0.2)]"
            >
              <Send size={28} className="-rotate-45" />
            </motion.div>
            <div className="absolute -bottom-6 right-12 opacity-[0.01] pointer-events-none group-hover:-rotate-12 transition-transform">
              <Anchor size={100} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StaffTab;
