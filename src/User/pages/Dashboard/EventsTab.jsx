import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Waves,
  Anchor,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const EventsTab = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [registered, setRegistered] = useState(false);

  const events = [
    {
      id: 1,
      name: 'Tech Symposium 2026',
      type: 'Workshop',
      venue: 'Hall A',
      date: 'Feb 15',
      time: '10:00 AM',
      desc: 'A deep dive into the latest in web development and AI within the Arctic Node ecosystem.',
    },
    {
      id: 2,
      name: 'Career Fair',
      type: 'Seminar',
      venue: 'Main Square',
      date: 'Feb 20',
      time: '09:00 AM',
      desc: 'Meet top employers and build your professional network in the global networking stream.',
    },
  ];

  if (selectedItem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-4xl mx-auto bg-white rounded-[48px] p-12 md:p-20 border border-teal-50 shadow-2xl shadow-teal-100/30 relative overflow-hidden font-jakarta"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => setSelectedItem(null)}
          className="mb-14 text-blue-950/40 hover:text-teal-600 flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
        >
          <ArrowRight
            className="rotate-180 group-hover:-translate-x-1 transition-transform"
            size={16}
          />{' '}
          Back to Hub
        </motion.button>
        <div className="flex justify-between items-start mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-blue-50/50 text-blue-950 px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-teal-50 flex items-center gap-2 w-fit">
              <Radio size={14} className="text-teal-500 animate-pulse" /> {selectedItem.type}
            </span>
            <h2 className="text-6xl font-outfit mt-10 font-bold text-blue-950 tracking-tight leading-none uppercase">
              {selectedItem.name}
            </h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-10 bg-blue-50/50 rounded-[36px] flex items-center gap-6 border border-teal-50 shadow-inner"
          >
            <div className="bg-white p-5 rounded-2xl shadow-xl shadow-teal-50 border border-teal-50 text-teal-500">
              <MapPin size={32} />
            </div>
            <div>
              <p className="text-[10px] text-blue-950/20 font-bold uppercase tracking-[0.2em] mb-2">
                Location Venue
              </p>
              <p className="font-bold text-blue-950 text-2xl tracking-tight leading-tight">
                {selectedItem.venue}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-10 bg-blue-50/50 rounded-[36px] flex items-center gap-6 border border-teal-50 shadow-inner"
          >
            <div className="bg-white p-5 rounded-2xl shadow-xl shadow-teal-50 border border-teal-50 text-teal-400">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-[10px] text-blue-950/20 font-bold uppercase tracking-[0.2em] mb-2">
                Sync Time
              </p>
              <p className="font-bold text-blue-950 text-2xl tracking-tight leading-tight">
                {selectedItem.time}
              </p>
            </div>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-blue-950/60 mb-16 text-xl font-medium leading-relaxed border-l-4 border-teal-400 pl-8"
        >
          {selectedItem.desc}
        </motion.p>
        <div className="border-t border-teal-50 pt-16">
          {registered ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-950 text-teal-400 p-12 rounded-[40px] border border-blue-900 text-center font-bold text-xl flex items-center justify-center gap-4 shadow-2xl shadow-teal-100/50 flex-col"
            >
              <ShieldCheck size={56} className="text-teal-400 mb-4" />
              <span className="uppercase tracking-[0.3em] font-outfit text-2xl">
                Registration Synchronized
              </span>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <div className="text-left flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-2xl mt-1 text-teal-500">
                  <Waves size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-outfit text-blue-950 font-bold mb-2 tracking-tight uppercase">
                    Confirm Attendance
                  </h3>
                  <p className="text-blue-950/40 font-medium text-base">
                    Your secure access token will be generated and linked to your student identity
                    profile.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0d9488' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRegistered(true);
                  toast.success('Registration synchronized successfully.');
                }}
                className="w-full bg-blue-950 text-white py-7 rounded-[30px] font-bold text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(30,58,138,0.2)] transition-all flex items-center justify-center gap-5 group"
              >
                Initialize Registration{' '}
                <ArrowRight
                  size={24}
                  className="text-teal-400 group-hover:translate-x-3 transition-transform"
                />
              </motion.button>
            </div>
          )}
        </div>
        <div className="absolute -bottom-12 -right-12 opacity-[0.02] pointer-events-none transform rotate-12">
          <Anchor size={350} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-20 font-jakarta"
    >
      <div className="grid gap-10">
        {events.map((e, idx) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, borderColor: '#2dd4bf' }}
            onClick={() => setSelectedItem(e)}
            className="group bg-white p-12 rounded-[48px] border border-teal-50 hover:shadow-2xl hover:shadow-teal-100/30 transition-all duration-700 cursor-pointer flex justify-between items-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-full bg-blue-50 group-hover:bg-blue-950 transition-colors"></div>
            <div className="flex-1 pl-10">
              <span className="text-blue-950 text-[9px] font-bold uppercase tracking-[0.2em] bg-blue-50/50 px-5 py-2 rounded-full border border-teal-50 flex items-center gap-2 w-fit">
                <Radio size={14} className="text-teal-500 animate-pulse" /> {e.type}
              </span>
              <h3 className="text-5xl font-outfit font-bold mt-10 text-blue-950 group-hover:text-teal-600 transition tracking-tight uppercase">
                {e.name}
              </h3>
              <div className="flex flex-wrap gap-12 mt-10">
                <div className="flex items-center gap-4 text-blue-950/40 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <Calendar
                    size={18}
                    className="text-teal-400 group-hover:rotate-12 transition-transform"
                  />{' '}
                  {e.date}
                </div>
                <div className="flex items-center gap-4 text-blue-950/40 text-[11px] font-bold uppercase tracking-[0.2em]">
                  <MapPin
                    size={18}
                    className="text-teal-400 group-hover:scale-110 transition-transform"
                  />{' '}
                  {e.venue}
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ x: 5, scale: 1.1 }}
              className="bg-blue-50/50 p-10 rounded-full group-hover:bg-blue-950 group-hover:shadow-[0_20px_50px_rgba(30,58,138,0.2)] transition-all duration-700 text-blue-200 group-hover:text-teal-400"
            >
              <ArrowRight size={40} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EventsTab;
