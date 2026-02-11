import React from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bell,
  Pin,
  MapPin,
  Clock,
  ArrowRight,
  Waves,
  Radio,
  Activity,
  Anchor,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data for Events
const mockEvents = [
  {
    id: 1,
    title: 'BSc CS Project Defense',
    date: '2025-12-18',
    time: '10:00 AM',
    category: 'Academic',
    color: 'blue-900',
  },
  {
    id: 2,
    title: 'Annual Sports Day',
    date: '2025-12-22',
    time: '9:00 AM',
    category: 'General',
    color: 'blue-800',
  },
  {
    id: 3,
    title: 'Holiday Break Starts',
    date: '2025-12-24',
    time: 'All Day',
    category: 'Academic',
    color: 'blue-900',
  },
  {
    id: 4,
    title: 'AI Ethics Guest Lecture',
    date: '2025-12-28',
    time: '2:00 PM',
    category: 'Lecture',
    color: 'teal-500',
  },
  {
    id: 5,
    title: 'Module Submission Deadline',
    date: '2026-01-05',
    time: '11:59 PM',
    category: 'Academic',
    color: 'blue-900',
  },
];

// Helper to render the calendar day
const CalendarDay = ({ day, hasEvent, color }) => {
  const colorClasses = {
    'blue-900': 'bg-blue-950 shadow-teal-100',
    'blue-800': 'bg-blue-800 shadow-teal-50',
    'teal-500': 'bg-teal-500 shadow-teal-200',
    'teal-400': 'bg-teal-400 shadow-teal-100',
  };

  return (
    <div className="group text-center p-4 border border-teal-50/50 cursor-pointer hover:bg-blue-50 transition-all relative rounded-2xl h-16 flex flex-col items-center justify-center">
      <div
        className={`text-sm font-bold ${hasEvent ? 'text-blue-950 group-hover:text-teal-600' : 'text-blue-900/10'}`}
      >
        {day < 10 ? `0${day}` : day}
      </div>
      {hasEvent && (
        <div
          className={`absolute bottom-2 w-1.5 h-1.5 rounded-full shadow-lg ${colorClasses[color] || 'bg-teal-400'}`}
        ></div>
      )}
    </div>
  );
};

const EventCalendarPage = () => {
  // Function to determine if a specific date string has an event
  const getDateColor = (day) => {
    const dateString = `2025-12-${day.toString().padStart(2, '0')}`;
    const event = mockEvents.find((e) => e.date === dateString);
    return event ? { hasEvent: true, color: event.color } : { hasEvent: false, color: '' };
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-8 md:p-16 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <Link
          to="/student-home-page"
          className="inline-flex items-center gap-2 text-blue-950/40 hover:text-blue-950 font-bold text-[11px] uppercase tracking-[0.2em] mb-12 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Student Core
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-950 p-2.5 rounded-xl shadow-xl shadow-teal-100 border border-blue-900">
              <Bell size={20} className="text-teal-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-blue-900/40 uppercase tracking-[0.2em]">
              Institutional Awareness Terminal
            </span>
          </div>
          <h1 className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
            Events & <span className="text-teal-500">Sync</span>
          </h1>
          <div className="flex items-center gap-3 mt-5">
            <Waves size={20} className="text-teal-400" />
            <p className="text-blue-900/40 text-lg font-medium max-w-xl leading-relaxed">
              Synchronize with campus schedules, guest lectures, and critical academic milestones.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- Column 1: Full Calendar View --- */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-2xl shadow-teal-100/30 border border-teal-50 relative overflow-hidden h-fit">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-950"></div>

            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-outfit font-bold text-blue-950">
                December <span className="text-teal-500">2025</span>
              </h3>
              <div className="flex gap-3">
                <button className="p-3 bg-blue-50/50 rounded-xl text-blue-200 hover:text-blue-950 hover:bg-teal-50 transition-all border border-teal-50 group">
                  <ChevronLeft
                    size={20}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                </button>
                <button className="p-3 bg-blue-50/50 rounded-xl text-blue-200 hover:text-blue-950 hover:bg-teal-50 transition-all border border-teal-50 group">
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center font-bold text-[10px] text-blue-900/20 uppercase tracking-[0.2em] mb-8 px-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {/* Example empty cells for start of month */}
              {[...Array(3).keys()].map((i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}

              {/* Days 1 to 31 */}
              {[...Array(31).keys()].map((day) => (
                <CalendarDay key={day} day={day + 1} {...getDateColor(day + 1)} />
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-10 pt-10 border-t border-teal-50">
              {[
                { color: 'bg-blue-950', label: 'Academic' },
                { color: 'bg-blue-800', label: 'General' },
                { color: 'bg-teal-500', label: 'Lecture' },
                { color: 'bg-teal-400', label: 'Milestone' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 ${item.color} rounded-full shadow-lg`}></div>
                  <span className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* --- Column 2: Upcoming Events List --- */}
          <div className="lg:col-span-1 space-y-10">
            <div className="bg-blue-950 p-10 rounded-[40px] shadow-2xl shadow-teal-100 text-white relative overflow-hidden h-fit border border-blue-900">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl -z-0"></div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-3xl font-outfit font-bold">
                  Signal <span className="text-teal-400">List</span>
                </h3>
                <Radio size={20} className="text-teal-400 animate-pulse" />
              </div>

              <div className="space-y-6 relative z-10">
                {mockEvents.slice(0, 3).map((event) => {
                  const colMap = {
                    'blue-900': 'border-blue-900 text-blue-100 bg-white/5',
                    'blue-800': 'border-blue-800 text-blue-200 bg-white/5',
                    'teal-500': 'border-teal-500/20 text-teal-400 bg-white/5',
                    'teal-400': 'border-teal-400/20 text-teal-300 bg-white/5',
                  };

                  return (
                    <div
                      key={event.id}
                      className={`p-8 rounded-[30px] border ${colMap[event.color] || 'border-blue-800'} transition-all hover:scale-[1.02] cursor-pointer group`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                          <Activity size={12} className="text-teal-400" /> {event.category}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-teal-400/60 uppercase">
                          <Clock size={12} /> {event.time}
                        </div>
                      </div>
                      <p className="font-outfit font-bold text-xl text-white group-hover:text-teal-400 transition-colors">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-blue-200/40">
                        <Calendar size={12} className="text-teal-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="mt-12 w-full py-6 bg-teal-400 text-blue-950 font-bold rounded-[24px] hover:bg-white transition shadow-2xl text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 group">
                Initialize Sync{' '}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-teal-50 shadow-2xl shadow-teal-100/30 relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-950 p-2.5 rounded-xl">
                  <MapPin size={18} className="text-teal-400" />
                </div>
                <p className="text-[10px] font-bold text-blue-950 uppercase tracking-[0.2em]">
                  Matrix Navigation
                </p>
              </div>
              <p className="text-blue-900/40 text-sm font-medium leading-relaxed border-l-4 border-teal-400 pl-6">
                Dynamic routes to all campus event locations are now operational within the core
                navigation module.
              </p>
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform">
                <Anchor size={150} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendarPage;
