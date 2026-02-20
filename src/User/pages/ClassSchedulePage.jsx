import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Laptop,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mock schedule removed for being unused after API integration

import { timetableAPI } from '../../api/timetables';
import toast from 'react-hot-toast';

const ClassSchedulePage = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetable, setTimetable] = useState(null);
  const [, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await timetableAPI.getMyTimetable();
        if (res.success) {
          setTimetable(res.data.timetable);
        }
      } catch (error) {
        console.error('Failed to fetch timetable:', error);
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const getScheduleForDay = (dayName) => {
    if (!timetable) return [];
    const dayData = timetable.schedule.find((d) => d.day === dayName);
    return dayData ? dayData.periods : [];
  };

  const scheduleForDay = getScheduleForDay(selectedDay);
  const hasClasses = scheduleForDay.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Helper function to determine card color based on class type
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Lecture':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-950',
          border: 'border-blue-100',
          icon: BookOpen,
        };
      case 'Practical':
        return { bg: 'bg-white', text: 'text-blue-950', border: 'border-teal-100', icon: Laptop };
      case 'Pod':
        return {
          bg: 'bg-teal-50',
          text: 'text-teal-600',
          border: 'border-teal-100',
          icon: GraduationCap,
        };
      default:
        return {
          bg: 'bg-blue-50/50',
          text: 'text-blue-950/40',
          border: 'border-blue-50',
          icon: Calendar,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-8 md:p-16 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[80px] -z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/student-home-page"
            className="inline-flex items-center gap-2 text-blue-950/40 hover:text-blue-950 font-bold text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />{' '}
            Back to Core
          </Link>
        </motion.div>

        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="bg-blue-950 p-2.5 rounded-xl shadow-xl shadow-teal-100/50 border border-blue-900">
              <Calendar size={20} className="text-teal-400" />
            </div>
            <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              Institutional Timeframe
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none mb-6 uppercase"
          >
            Campus <span className="text-teal-500">Timetable</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-950/40 text-lg font-medium max-w-xl leading-relaxed"
          >
            Optimize your learning trajectory with real-time class tracking and session
            synchronization.
          </motion.p>
        </header>

        {/* Day Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-2 rounded-[32px] shadow-2xl shadow-teal-100/30 border border-teal-50 mb-12 flex flex-wrap gap-2"
        >
          {daysOfWeek.map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(day)}
              className={`px-8 py-4 rounded-[24px] font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                selectedDay === day
                  ? 'bg-blue-950 text-white shadow-xl scale-105'
                  : 'text-blue-950/30 hover:text-blue-950 hover:bg-blue-50/50'
              }`}
            >
              {day}
            </motion.button>
          ))}
        </motion.div>

        {/* Schedule Container */}
        <div className="space-y-10">
          <motion.div
            key={selectedDay + 'header'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between px-6"
          >
            <h2 className="text-4xl font-outfit font-bold tracking-tight text-blue-950 uppercase">
              {selectedDay} <span className="text-teal-500">Overview</span>
            </h2>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-white border border-teal-50 px-6 py-3 rounded-full shadow-sm">
              {hasClasses ? `${scheduleForDay.length} Assignments` : 'Free Node'}
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {hasClasses ? (
                scheduleForDay.map((item, index) => {
                  const styles = getTypeStyles(item.type);
                  const Icon = styles.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, borderColor: '#2dd4bf' }}
                      className={`group bg-white p-10 rounded-[40px] border border-teal-50 shadow-2xl shadow-teal-100/30 hover:shadow-teal-100/50 transition-all duration-500 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden`}
                    >
                      <div
                        className={`flex-shrink-0 w-24 h-24 ${styles.bg} rounded-[32px] flex flex-col items-center justify-center border ${styles.border} group-hover:scale-110 transition-transform shadow-inner`}
                      >
                        <Icon className={styles.text} size={28} />
                        <p
                          className={`text-[9px] font-bold uppercase tracking-widest mt-2.5 ${styles.text}`}
                        >
                          {item.type || 'Lecture'}
                        </p>
                      </div>

                      <div className="flex-grow text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                          <Clock size={16} className="text-blue-950/20" />
                          <p className="text-xl font-bold text-blue-950 tracking-tight">
                            {item.startTime} - {item.endTime}
                          </p>
                        </div>
                        <p className="font-outfit text-4xl font-bold text-blue-950 tracking-tight leading-none mb-4 group-hover:text-teal-600 transition-colors uppercase">
                          {item.subject}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                          <span className="text-[10px] font-bold text-blue-950/40 uppercase tracking-[0.2em] bg-blue-50/50 border border-teal-50 px-4 py-2 rounded-xl">
                            {item.code || 'CORE'}
                          </span>
                          {item.facultyName && (
                            <div className="flex items-center gap-2 text-blue-900 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                PROF: {item.facultyName}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-teal-600 bg-teal-50/30 px-4 py-2 rounded-xl border border-teal-50">
                            <MapPin size={14} className="text-teal-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                              Point: {item.room || 'TBA'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#0d9488' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-6 bg-blue-950 text-white rounded-[24px] font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-teal-100/50 group/btn"
                      >
                        Access Module
                      </motion.button>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="p-24 text-center bg-white rounded-[60px] border-2 border-dashed border-teal-100 shadow-inner group"
                >
                  <motion.div
                    whileHover={{ rotate: 12 }}
                    className="bg-blue-50/50 w-28 h-28 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-teal-50 transition-transform shadow-inner"
                  >
                    <Calendar className="text-blue-950/10" size={56} />
                  </motion.div>
                  <h4 className="text-blue-950 font-outfit font-bold text-5xl mb-6 tracking-tight uppercase">
                    Clearnance <span className="text-teal-500">Confirmed</span>
                  </h4>
                  <p className="text-blue-950/30 font-bold uppercase tracking-[0.2em] text-[11px]">
                    No institutional assignments for {selectedDay}.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#0d9488' }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-14 px-12 py-6 bg-blue-950 text-white rounded-[24px] font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-teal-100/50 mx-auto flex items-center gap-3"
                  >
                    Initialize Deep Study
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedulePage;
