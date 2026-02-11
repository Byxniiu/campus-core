import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight, Radio, Waves, Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SOSTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto font-jakarta"
    >
      <div className="bg-white rounded-[40px] border border-teal-50 flex flex-col items-center justify-center p-12 md:p-24 text-center shadow-2xl shadow-teal-100/30 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl -z-0"></div>

        <header className="mb-14 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-4 bg-blue-50/50 px-8 py-3.5 rounded-full border border-teal-100 mb-12 shadow-inner"
          >
            <Radio size={18} className="text-teal-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              Institutional Safety Grid
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-40 h-40 bg-blue-950 rounded-[48px] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-teal-200 border-8 border-white group transition-transform duration-500"
          >
            <AlertTriangle
              size={80}
              className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
            />
          </motion.div>

          <h1 className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none mb-8">
            Safety <span className="text-teal-500">SOS</span>
          </h1>
          <p className="text-blue-950/60 max-w-lg mx-auto text-lg font-medium leading-relaxed">
            Initialize an immediate distress signal. Your location and identity will be broadcast to
            all active response protocols.
          </p>
        </header>

        <div className="w-full max-w-sm relative z-10 flex flex-col gap-6">
          <Link to="/sos-system" className="w-full">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#0d9488' }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-950 text-white py-6 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-teal-100/50 transition-all flex items-center justify-center gap-4 group"
            >
              Deploy Emergency Signal{' '}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform text-teal-400"
              />
            </motion.button>
          </Link>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Waves size={16} className="text-teal-400" />
            <p className="text-[10px] font-bold text-blue-950/10 uppercase tracking-[0.2em]">
              Average Response: 120 Seconds
            </p>
          </div>
        </div>

        <div className="absolute -bottom-10 opacity-[0.02] pointer-events-none">
          <Anchor size={300} />
        </div>
      </div>
    </motion.div>
  );
};

export default SOSTab;
