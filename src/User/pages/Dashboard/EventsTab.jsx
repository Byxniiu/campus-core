import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Waves,
  Anchor,
  Radio,
  ShieldCheck,
  Search,
  Filter,
  Loader,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
// API
import { eventsAPI } from '../../../api/events.js';
import { useStudentAuthStore } from '../../../stores/useStudentAuthStore';

const EventsTab = () => {
  const { user } = useStudentAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [filter, setFilter] = useState('all');

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAllEvents({ status: 'published' });
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    if (!user) return;

    // Preventive Frontend Check: Check if event is in the past
    if (new Date() > new Date(event.startDate)) {
      toast.error('Registration Closed: This event has already started or concluded.', {
        style: {
          borderRadius: '16px',
          background: '#fee2e2',
          color: '#991b1b',
          fontWeight: 'bold',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    try {
      setRegistering(true);
      await eventsAPI.registerEvent(event._id);
      toast.success('Successfully registered for the event!');

      // Update local state to reflect registration
      setEvents((prev) =>
        prev.map((e) => {
          if (e._id === event._id) {
            return { ...e, registeredParticipants: [...e.registeredParticipants, user.id] };
          }
          return e;
        })
      );

      // Also update selected item if open
      if (selectedItem && selectedItem._id === event._id) {
        setSelectedItem((prev) => ({
          ...prev,
          registeredParticipants: [...prev.registeredParticipants, user.id],
        }));
      }
    } catch (error) {
      toast.error(error?.message || error?.toString() || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = (event) => {
    // Check if user ID is in registeredParticipants array
    // Backend returns array of IDs strings or objects depending on populate
    // Based on controller, it's likely IDs (strings or ObjectIds)
    if (!event?.registeredParticipants || !user) return false;
    return event.registeredParticipants.some((p) => p === user.id || p._id === user.id);
  };

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.category === filter;
  });

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-teal-500" size={32} />
      </div>
    );
  }

  // DETAILED VIEW
  if (selectedItem) {
    const registered = isRegistered(selectedItem);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-4xl mx-auto bg-white rounded-[48px] p-8 md:p-16 border border-teal-50 shadow-2xl shadow-teal-100/30 relative overflow-hidden font-jakarta"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => setSelectedItem(null)}
          className="mb-10 text-blue-950/40 hover:text-teal-600 flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all group z-10 relative"
        >
          <ArrowRight
            className="rotate-180 group-hover:-translate-x-1 transition-transform"
            size={16}
          />{' '}
          Back to Hub
        </motion.button>

        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="bg-blue-50/50 text-blue-950 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-teal-50 flex items-center gap-2 w-fit mb-4">
              <Radio size={14} className="text-teal-500 animate-pulse" /> {selectedItem.category}
            </span>
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-blue-950 tracking-tight leading-none uppercase">
              {selectedItem.title}
            </h2>
          </motion.div>

          {/* Status Badge */}
          {registered && (
            <div className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-xs font-bold border border-teal-100 flex items-center gap-2 shadow-sm">
              <ShieldCheck size={16} /> Registered
            </div>
          )}
        </div>

        {selectedItem.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-64 md:h-80 rounded-[32px] overflow-hidden mb-10 border border-teal-50 shadow-lg relative z-10"
          >
            <img
              src={`http://localhost:3000${selectedItem.image}`}
              alt={selectedItem.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-blue-50/50 rounded-[32px] flex items-center gap-5 border border-teal-50 shadow-sm"
          >
            <div className="bg-white p-4 rounded-2xl shadow-md text-teal-500 border border-teal-50">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-[9px] text-blue-950/30 font-bold uppercase tracking-[0.2em] mb-1">
                Venue Location
              </p>
              <p className="font-bold text-blue-950 text-lg tracking-tight leading-tight">
                {selectedItem.location || 'TBA'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-blue-50/50 rounded-[32px] flex items-center gap-5 border border-teal-50 shadow-sm overflow-hidden"
          >
            {/* Calendar Leaf Styled Visual */}
            <div className="bg-white rounded-2xl shadow-xl border border-teal-50 overflow-hidden min-w-[80px] flex flex-col items-center">
              <div className="bg-red-500 w-full py-1 text-center">
                <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                  {new Date(selectedItem.startDate).toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </div>
              <div className="p-3 text-center">
                <span className="text-2xl font-outfit font-black text-blue-950 leading-none">
                  {new Date(selectedItem.startDate).getDate()}
                </span>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                  {new Date(selectedItem.startDate).getFullYear()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[9px] text-blue-950/30 font-bold uppercase tracking-[0.2em] mb-1">
                Event Schedule
              </p>
              <p className="font-bold text-blue-950 text-lg tracking-tight leading-tight">
                {formatTime(selectedItem.startDate)}
              </p>
              <p className="text-xs text-blue-950/60 font-semibold tracking-wide mt-0.5">
                Institutional Sync Active
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-blue-950/70 mb-12 text-base md:text-lg font-medium leading-relaxed border-l-4 border-teal-400 pl-6 relative z-10"
        >
          {selectedItem.description}
        </motion.div>

        <div className="border-t border-teal-50 pt-10 relative z-10">
          {registered ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-950 text-teal-400 p-8 rounded-[32px] border border-blue-900 text-center font-bold text-lg flex items-center justify-center gap-4 shadow-xl shadow-teal-900/10 flex-col"
            >
              <ShieldCheck size={48} className="text-teal-400 mb-2" />
              <span className="uppercase tracking-[0.2em] font-outfit text-xl">
                Registration Confirmed
              </span>
              <p className="text-blue-200/50 text-xs font-medium max-w-md">
                You are officially on the list for this event. Please arrive at the venue on time.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-6 bg-teal-50/30 rounded-3xl border border-teal-50">
                <div className="bg-white p-3 rounded-xl text-teal-500 shadow-sm">
                  <Waves size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-outfit text-blue-950 font-bold mb-1 tracking-tight uppercase">
                    Confirm Participation
                  </h3>
                  <p className="text-blue-950/50 text-sm font-medium">
                    By registering, you acknowledge that your student profile will be linked to this
                    event.
                    {selectedItem.maxParticipants && (
                      <span className="block mt-1 text-teal-600 font-bold">
                        {selectedItem.maxParticipants -
                          (selectedItem.registeredParticipants?.length || 0)}{' '}
                        spots remaining
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRegister(selectedItem)}
                disabled={registering}
                className="w-full bg-blue-950 hover:bg-teal-600 text-white py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(30,58,138,0.15)] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    Initialize Registration{' '}
                    <ArrowRight
                      size={20}
                      className="text-teal-400 group-hover:text-white group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Background Decorations */}
        <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none rotate-12 z-0">
          <Anchor size={400} />
        </div>
      </motion.div>
    );
  }

  // LIST VIEW
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-20 font-jakarta"
    >
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-outfit font-black text-blue-950 uppercase tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-blue-950/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
            Discover workshops, seminars, and campus activities
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-teal-50 shadow-sm">
          <Filter size={16} className="text-slate-400 ml-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-xs font-bold uppercase tracking-wider text-blue-950 outline-none cursor-pointer pr-4"
          >
            <option value="all">All Events</option>
            <option value="workshop">Workshops</option>
            <option value="seminar">Seminars</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-blue-50/50">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-300 mb-4">
              <Calendar size={32} />
            </div>
            <p className="text-blue-950 font-bold text-lg">No events found</p>
            <p className="text-blue-950/40 text-sm">Check back later for new updates.</p>
          </div>
        ) : (
          filteredEvents.map((e, idx) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, borderColor: '#2dd4bf' }}
              onClick={() => setSelectedItem(e)}
              className="group bg-white p-8 rounded-[40px] border border-teal-50 hover:shadow-xl hover:shadow-teal-100/20 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-50 group-hover:bg-teal-400 transition-colors duration-500"></div>

              {e.image ? (
                <div className="h-48 rounded-[24px] overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-blue-950/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={`http://localhost:3000${e.image}`}
                    alt={e.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-950 z-20 shadow-lg">
                    {e.category}
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex justify-between items-start pl-6">
                  <span className="text-blue-950 text-[9px] font-bold uppercase tracking-[0.2em] bg-blue-50/50 px-4 py-1.5 rounded-full border border-teal-50 flex items-center gap-2 w-fit">
                    <Radio size={12} className="text-teal-500 animate-pulse" /> {e.category}
                  </span>
                </div>
              )}

              <div className="flex-1 pl-6">
                <h3 className="text-2xl font-outfit font-bold text-blue-950 group-hover:text-teal-600 transition-colors tracking-tight uppercase leading-none mb-4">
                  {e.title}
                </h3>
                <p className="text-blue-950/60 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                  {e.description}
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
                    <Calendar size={14} className="text-teal-400" /> {formatDate(e.startDate)}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
                    <MapPin size={14} className="text-teal-400" /> {e.location}
                  </div>
                </div>
              </div>

              <div className="pl-6 pt-8 mt-4 border-t border-slate-50 flex justify-between items-center group-hover:border-teal-50 transition-colors">
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                  {isRegistered(e) ? 'Registered' : 'View Details'}
                </span>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-teal-400 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default EventsTab;
