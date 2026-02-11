import React from 'react';
import { Plus, Users, MessageSquare, Waves, Anchor, Radio, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const GroupsTab = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto pb-20 relative overflow-hidden font-jakarta"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16 relative z-10">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-950 p-2.5 rounded-xl border border-blue-900 shadow-xl shadow-teal-100/50">
              <Globe size={18} className="text-teal-400" />
            </div>
            <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              Network Discovery
            </span>
          </div>
          <h2 className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
            Global <span className="text-teal-500">Network</span>
          </h2>
          <p className="text-blue-950/40 font-medium text-lg mt-5 flex items-center gap-3">
            <Waves size={16} className="text-teal-400" /> Connect and collaborate across the
            academic matrix.
          </p>
        </motion.div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, backgroundColor: '#0d9488' }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 bg-blue-950 text-white px-10 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] transition shadow-2xl shadow-teal-100/50 group"
        >
          <Plus size={20} className="text-teal-400 group-hover:rotate-90 transition-transform" />{' '}
          Initialize Group
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {['Quantum Computing', 'Digital Art Block', 'Alumni Connect', 'Residents Node'].map(
          (g, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-white p-10 rounded-[40px] border border-teal-50 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-teal-100/30 hover:border-teal-300 cursor-pointer transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-50/50 group-hover:bg-blue-950 transition-colors"></div>

              <motion.div
                whileHover={{ rotate: 6 }}
                className="w-24 h-24 bg-blue-50/50 rounded-[32px] group-hover:bg-blue-950 flex items-center justify-center font-bold text-3xl text-blue-200 group-hover:text-teal-400 border border-teal-50 group-hover:border-blue-950 transition-all duration-500 mb-10 shadow-inner"
              >
                {g[0]}
              </motion.div>

              <div className="space-y-4">
                <h3 className="font-outfit font-bold text-2xl text-blue-950 group-hover:text-teal-600 transition-colors tracking-tight mb-3 px-4 uppercase">
                  {g}
                </h3>
                <div className="flex items-center justify-center gap-4 bg-blue-50/50 px-6 py-2.5 rounded-full border border-teal-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-950/40 uppercase tracking-[0.1em]">
                    <Users size={12} className="text-teal-400" /> {12 + idx * 5}
                  </div>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-[0.1em]">
                    <Radio size={12} className="animate-pulse" /> Live Now
                  </div>
                </div>
              </div>

              <div className="w-full mt-10 pt-10 border-t border-teal-50 flex justify-center">
                <motion.button
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 text-blue-950 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-teal-600 transition-colors group/btn"
                >
                  <MessageSquare
                    size={18}
                    className="text-teal-400 group-hover:scale-110 transition-transform"
                  />{' '}
                  Enter Channel
                </motion.button>
              </div>
            </motion.div>
          )
        )}

        {/* Create Placeholder */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="group border-2 border-dashed border-teal-100 rounded-[40px] flex flex-col items-center justify-center p-12 hover:border-teal-400 hover:bg-white hover:shadow-2xl hover:shadow-teal-100/30 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-50 border border-teal-50 text-blue-200 group-hover:bg-blue-950 group-hover:text-teal-400 group-hover:scale-110 transition-all">
            <Plus size={32} />
          </div>
          <p className="mt-8 font-bold text-[10px] text-blue-950/20 uppercase tracking-[0.2em] group-hover:text-blue-950 transition-colors">
            Request Expansion
          </p>
          <div className="absolute -bottom-4 right-0 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform">
            <Anchor size={100} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GroupsTab;
