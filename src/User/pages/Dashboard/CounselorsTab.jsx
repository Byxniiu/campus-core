import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  MessageCircle,
  ArrowLeft,
  Radio,
  Waves,
  Anchor,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CounselingForm from '../CounselingForm';
import { counselingAPI } from '../../../api/counseling';
import toast from 'react-hot-toast';

const CounselorsTab = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formCounselor, setFormCounselor] = useState(null);

  React.useEffect(() => {
    fetchCounselors();
  }, []);

  const openForm = (counselor = null) => {
    setFormCounselor(counselor);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormCounselor(null);
  };

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const data = await counselingAPI.getCounselors();
      setCounselors(data.counselors || []);
    } catch (error) {
      console.error('Failed to fetch counselors:', error);
      toast.error('Failed to load counselors');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[48px] border border-teal-50 shadow-2xl shadow-teal-100/30 relative overflow-hidden font-jakarta"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => setSelectedItem(null)}
          className="mb-14 text-blue-950/40 hover:text-teal-600 flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Network
        </motion.button>
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-36 h-36 bg-blue-50/30 rounded-[44px] flex items-center justify-center text-blue-950 border border-teal-50 relative shadow-inner group overflow-hidden"
          >
            {selectedItem.avatar ? (
              <img
                src={`http://localhost:3000${selectedItem.avatar}`}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            ) : (
              <User
                size={72}
                className="text-teal-400 opacity-20 group-hover:opacity-40 transition-opacity"
              />
            )}
            <div className="absolute -bottom-3 -right-3 bg-blue-950 p-3.5 rounded-2xl border-4 border-white shadow-2xl">
              <ShieldCheck size={22} className="text-teal-400" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center md:text-left"
          >
            <h2 className="text-5xl font-outfit font-bold text-blue-950 leading-tight tracking-tight mb-5">
              {selectedItem.firstName} {selectedItem.lastName}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="bg-blue-950 text-teal-400 px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-teal-100/50">
                Licensed Unit
              </span>
              <span className="bg-teal-50 text-teal-600 px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-teal-100">
                {selectedItem.specialization}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950/20 mb-6 flex items-center gap-3">
                <Radio size={14} className="text-teal-500 animate-pulse" /> Specialist Profile
              </h4>
              <p className="text-blue-950/60 text-lg font-medium leading-relaxed border-l-4 border-teal-400 pl-8 italic">
                "{selectedItem.bio}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50/30 rounded-[32px] border border-teal-50/50">
                <p className="text-[9px] font-black text-blue-950/30 uppercase tracking-widest mb-1">
                  Experience
                </p>
                <p className="text-xl font-bold text-blue-950 tracking-tight">
                  {selectedItem.experience || 0} Years
                </p>
              </div>
              <div className="p-6 bg-blue-50/30 rounded-[32px] border border-teal-50/50">
                <p className="text-[9px] font-black text-blue-950/30 uppercase tracking-widest mb-1">
                  Mode
                </p>
                <p className="text-xl font-bold text-blue-950 tracking-tight">
                  {selectedItem.counselingMode || 'Standard'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950/20 mb-2 font-jakarta">
              Operational & Academic Meta
            </h4>

            <div className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-sm space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-teal-500 shadow-sm border border-teal-50">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-blue-950/20 uppercase tracking-widest">
                    Credentials
                  </p>
                  <p className="text-blue-950 font-bold text-base tracking-tight">
                    {selectedItem.qualification || 'Certified Professional'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-teal-400 shadow-sm border border-teal-50">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-blue-950/20 uppercase tracking-widest">
                    Sync Availability
                  </p>
                  <p className="text-blue-950 font-bold text-base tracking-tight">
                    {selectedItem.availability}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400 shadow-sm border border-teal-50">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-blue-950/20 uppercase tracking-widest">
                    Connect Matrix
                  </p>
                  <p className="text-blue-950 font-bold text-sm tracking-tight">
                    {selectedItem.email}
                  </p>
                  {selectedItem.phone && (
                    <p className="text-teal-600 font-bold text-[10px] mt-1 tracking-widest">
                      {selectedItem.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[9px] font-black text-blue-950/20 uppercase tracking-widest">
                  Institutional Capacity
                </p>
                <div className="px-3 py-1 bg-teal-50 rounded-full border border-teal-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">
                    {selectedItem.maxStudentsPerDay || 5} Max Students Per Day
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-950 p-12 md:p-16 rounded-[48px] shadow-[0_20px_50px_rgba(30,58,138,0.3)] flex flex-col lg:flex-row items-center justify-between text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/5 rounded-full blur-[100px] -z-0"></div>
          <div className="relative z-10 max-w-sm mb-12 lg:mb-0 text-center lg:text-left">
            <h4 className="text-4xl font-outfit font-bold mb-4 text-white tracking-tight uppercase">
              Secure <span className="text-teal-400">Uplink</span>
            </h4>
            <p className="text-blue-200/40 font-medium text-base leading-relaxed">
              Encrypted consultation request. Your anonymity is maintained by strict institutional
              protocols.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#1e3a8a' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openForm(selectedItem)}
            className="relative z-10 bg-teal-400 text-blue-950 px-12 py-6 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center gap-5 group"
          >
            <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />{' '}
            Initialize Protocol
          </motion.button>
        </motion.div>
        <div className="absolute -bottom-24 -left-24 opacity-[0.02] pointer-events-none transform -rotate-12">
          <Waves size={500} />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto pb-20 font-jakarta"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-outfit font-black text-blue-950 uppercase tracking-tighter">
              Certified <span className="text-teal-500">Counselors</span>
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Access professional mental health and academic guidance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {counselors.map((c) => (
            <motion.div
              key={c._id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedItem(c)}
              className="group bg-white p-12 rounded-[48px] border border-teal-50 hover:border-teal-300 hover:shadow-2xl hover:shadow-teal-100/30 transition-all duration-700 cursor-pointer text-center md:text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-blue-50/50 group-hover:bg-blue-950 transition-colors"></div>
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-24 h-24 bg-blue-50/50 rounded-[32px] group-hover:bg-blue-950 flex items-center justify-center text-blue-200 group-hover:text-teal-400 transition-all duration-700 shadow-inner overflow-hidden"
                >
                  {c.avatar ? (
                    <img
                      src={`http://localhost:3000${c.avatar}`}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  ) : (
                    <User
                      size={48}
                      className="opacity-40 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-3xl font-outfit font-bold text-blue-950 group-hover:text-teal-600 transition tracking-tight mb-2 uppercase">
                    {c.firstName} {c.lastName}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Radio size={14} className="text-teal-500" />
                    <p className="text-blue-950/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                      {c.specialization}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-blue-950/40 text-sm font-medium line-clamp-2 mb-12 px-2 leading-relaxed">
                "{c.bio}"
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-teal-50 pt-10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,1)]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950/20">
                    Operational
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openForm(c);
                    }}
                    className="bg-blue-950 text-white px-6 py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 flex items-center gap-2 group/btn"
                  >
                    <MessageCircle size={14} className="text-teal-400" />
                    New Request
                  </motion.button>

                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-blue-950 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3"
                  >
                    Profile <ArrowLeft className="rotate-180 text-teal-400" size={16} />
                  </motion.span>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-[0.01] pointer-events-none group-hover:rotate-12 transition-transform">
                <Anchor size={140} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-blue-950/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-4xl relative"
            >
              <CounselingForm
                preSelectedCounselorId={formCounselor?._id}
                initialAvailability={formCounselor?.availability}
                onCancel={closeForm}
                onSuccess={() => {
                  closeForm();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CounselorsTab;
