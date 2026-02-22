import React, { useState, useEffect, useCallback } from 'react';
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
  Loader,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../api/events';
import toast from 'react-hot-toast';

// Helper to render the calendar day
const CalendarDay = ({ day, events = [] }) => {
  const hasEvent = events.length > 0;

  return (
    <div
      className={`group text-center p-3 border border-teal-50/50 cursor-pointer hover:bg-teal-50/50 transition-all relative rounded-2xl h-16 flex flex-col items-center justify-center ${hasEvent ? 'bg-white shadow-lg shadow-teal-500/5 ring-1 ring-teal-100/50' : 'opacity-40'}`}
    >
      <div
        className={`text-sm font-bold ${hasEvent ? 'text-blue-950 group-hover:text-teal-600' : 'text-blue-900/40'}`}
      >
        {day < 10 ? `0${day}` : day}
      </div>
      {hasEvent && (
        <div className="flex gap-0.5 mt-1">
          {events.slice(0, 3).map((e, idx) => (
            <div
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Tooltip on hover if has events */}
      {hasEvent && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-blue-950 text-white p-2 rounded-xl text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
          {events[0].title}
          {events.length > 1 && ` (+${events.length - 1} more)`}
        </div>
      )}
    </div>
  );
};

const EventCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAllEvents({ status: 'published' });
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Sync failed: Could not reach event node');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getEventsForDay = (day) => {
    return events.filter((e) => {
      const eDate = new Date(e.startDate);
      return (
        eDate.getDate() === day &&
        eDate.getMonth() === currentDate.getMonth() &&
        eDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-8 md:p-16 font-jakarta relative overflow-hidden selection:bg-teal-100">
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
                {monthName} <span className="text-teal-500">{year}</span>
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={prevMonth}
                  className="p-3 bg-blue-50/50 rounded-xl text-blue-200 hover:text-blue-950 hover:bg-teal-50 transition-all border border-teal-50 group"
                >
                  <ChevronLeft
                    size={20}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-3 bg-blue-50/50 rounded-xl text-blue-200 hover:text-blue-950 hover:bg-teal-50 transition-all border border-teal-50 group"
                >
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
              {/* Offset for first day of month */}
              {[...Array(firstDayOfMonth(currentDate.getMonth(), year)).keys()].map((i) => (
                <div key={`empty-${i}`} className="p-2 opacity-10">
                  <div className="h-16 rounded-2xl bg-slate-50 border border-dashed border-slate-200"></div>
                </div>
              ))}

              {/* Days in current month */}
              {loading ? (
                <div className="col-span-7 flex justify-center py-20">
                  <Loader className="animate-spin text-teal-400" size={40} />
                </div>
              ) : (
                [...Array(daysInMonth(currentDate.getMonth(), year)).keys()].map((day) => (
                  <CalendarDay
                    key={day}
                    day={day + 1}
                    month={currentDate.getMonth()}
                    year={year}
                    events={getEventsForDay(day + 1)}
                  />
                ))
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-10 pt-10 border-t border-teal-50">
              {[
                { color: 'bg-red-500', label: 'Institutional Event' },
                { color: 'bg-teal-400', label: 'Future Milestone' },
                { color: 'bg-blue-950', label: 'Today' },
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
                <h3 className="text-3xl font-outfit font-bold text-white">
                  Signal <span className="text-teal-400">List</span>
                </h3>
                <Radio size={20} className="text-teal-400 animate-pulse" />
              </div>

              <div className="space-y-6 relative z-10">
                {events.length === 0 && !loading ? (
                  <p className="text-blue-200/40 text-xs font-bold uppercase tracking-widest text-center py-10">
                    No events synchronized
                  </p>
                ) : (
                  events.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className="p-8 rounded-[30px] border border-white/10 bg-white/5 transition-all hover:scale-[1.02] cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                          <Activity size={12} className="text-teal-400" /> {event.category}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-teal-400/60 uppercase">
                          <Clock size={12} />{' '}
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <p className="font-outfit font-bold text-xl text-white group-hover:text-teal-400 transition-colors line-clamp-1">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-blue-200/40">
                        <Calendar size={12} className="text-teal-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={fetchEvents}
                className="mt-12 w-full py-6 bg-teal-400 text-blue-950 font-bold rounded-[24px] hover:bg-white transition shadow-2xl text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 group"
              >
                Refresh Matrix{' '}
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
