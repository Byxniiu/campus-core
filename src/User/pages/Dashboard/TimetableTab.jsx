import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, BookOpen, GraduationCap, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { timetableAPI } from '../../../api/timetables';
import toast from 'react-hot-toast';

const TimetableTab = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const res = await timetableAPI.getMyTimetable();
        if (res.success) {
          setTimetable(res.data.timetable);
        }
      } catch (error) {
        console.error('Failed to fetch timetable:', error);
        toast.error('Failed to load timetable');
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

  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'lecture':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-950',
          border: 'border-blue-100',
          icon: BookOpen,
        };
      case 'lab':
      case 'practical':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-950',
          border: 'border-emerald-100',
          icon: Laptop,
        };
      case 'seminar':
      case 'tutorial':
        return {
          bg: 'bg-teal-50',
          text: 'text-teal-600',
          border: 'border-teal-100',
          icon: GraduationCap,
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-400',
          border: 'border-slate-100',
          icon: Clock,
        };
    }
  };

  if (loading && !timetable) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Synchronizing Academic Timeframe...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Day Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-1 overflow-x-auto scrollbar-hide">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex-1 whitespace-nowrap ${
              selectedDay === day
                ? 'bg-blue-950 text-white shadow-lg'
                : 'text-slate-400 hover:text-blue-950 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Container */}
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight italic">
              {selectedDay} <span className="text-teal-500">Overview</span>
            </h2>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm">
            {hasClasses ? `${scheduleForDay.length} Assignments` : 'No institutional pulse'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {hasClasses ? (
              scheduleForDay.map((item, index) => {
                const styles = getTypeStyles(item.type);
                const Icon = styles.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-teal-100/20 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
                  >
                    <div
                      className={`flex-shrink-0 w-16 h-16 ${styles.bg} rounded-2xl flex flex-col items-center justify-center border ${styles.border} group-hover:scale-110 transition-transform shadow-inner`}
                    >
                      <Icon className={styles.text} size={20} />
                      <p
                        className={`text-[7px] font-black uppercase tracking-widest mt-1.5 ${styles.text}`}
                      >
                        {item.type || 'LECTURE'}
                      </p>
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5 text-slate-400">
                        <Clock size={12} className="opacity-50" />
                        <p className="text-[11px] font-black uppercase tracking-widest">
                          {item.startTime} - {item.endTime}
                        </p>
                      </div>
                      <h4 className="text-xl font-black text-blue-950 uppercase tracking-tighter leading-none mb-2 group-hover:text-teal-600 transition-colors">
                        {item.subject}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        {item.facultyName && (
                          <span className="text-[8px] font-black text-blue-900/60 uppercase tracking-wide bg-blue-50/50 border border-blue-100/50 px-2 py-1 rounded-md">
                            PROF: {item.facultyName}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-teal-600 bg-teal-50/30 px-2 py-1 rounded-md border border-teal-50">
                          <MapPin size={10} className="text-teal-500" />
                          <span className="text-[13px] font-black uppercase tracking-wide">
                            Room: {item.room || 'TBA'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={itemVariants}
                className="py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-teal-100 shadow-inner flex flex-col items-center"
              >
                <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-50">
                  <Calendar className="text-slate-200" size={32} />
                </div>
                <h4 className="text-blue-950 font-black text-2xl mb-2 tracking-tighter uppercase italic">
                  Station <span className="text-teal-500">Idle</span>
                </h4>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                  No Institutional Assignments for {selectedDay}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimetableTab;
