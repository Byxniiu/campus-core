import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api/admin';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';
import FacultyActiveStatusChecker from '../components/FacultyActiveStatusChecker';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserSquare2,
  MessageSquare,
  PlusCircle,
  LogOut,
  MapPin,
  Clock,
  Search,
  ChevronRight,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Filter,
  Heart,
  ShieldCheck,
  Mail,
  Phone,
  Edit,
  Image as ImageIcon,
} from 'lucide-react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    students: [],
    events: [],
    counselors: [],
    staff: [],
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('faculty_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // Proactively fetch latest profile to ensure department etc are up to date
      fetchUserProfile();
    } else {
      navigate('/faculty-login');
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('faculty_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Profile sync error:', error);
    }
  };

  useEffect(() => {
    if (user && user.department) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, eventsRes, counselorsRes, staffRes] = await Promise.all([
        adminAPI.getAllStudents(),
        adminAPI.getAllEvents(),
        adminAPI.getAllCounselors(),
        adminAPI.getAllStaff(),
      ]);

      setData({
        students: studentsRes.data || [],
        events: eventsRes.data || [],
        counselors: counselorsRes.data || [],
        staff: staffRes.data || [],
      });
    } catch (error) {
      console.error('Data fetch error:', error);
      toast.error('Failed to synchronize academic data');
    } finally {
      setLoading(false);
    }
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [regFilterEventId, setRegFilterEventId] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'academic',
    location: '',
    startDate: '',
    endDate: '',
    status: 'published',
    description: '',
    maxParticipants: '',
    image: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /* ---------------- HANDLERS ---------------- */
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(eventForm).forEach((key) => {
        if (key === 'image' && eventForm[key]) {
          formData.append('image', eventForm[key]);
        } else if (eventForm[key] !== null && eventForm[key] !== '') {
          formData.append(key, eventForm[key]);
        }
      });
      formData.append('department', user?.department || 'General');

      let response;
      if (isEditing) {
        response = await adminAPI.updateEvent(editingEventId, formData);
      } else {
        response = await adminAPI.createEvent(formData);
      }

      if (response.success) {
        toast.success(
          isEditing ? 'Event updated successfully!' : 'Event protocol initiated successfully!'
        );
        fetchAllData();
        resetForm();
        setRegFilterEventId('');
      }
    } catch (error) {
      console.error('Event save error:', error);
      toast.error(error.message || 'Failed to save event protocol');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      category: 'academic',
      location: '',
      startDate: '',
      endDate: '',
      status: 'published',
      description: '',
      maxParticipants: '',
      image: null,
    });
    setImagePreview(null);
    setIsEditing(false);
    setEditingEventId(null);
  };

  const handleEditClick = (event) => {
    setEventForm({
      title: event.title || '',
      category: event.category || 'academic',
      location: event.location || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      status: event.status || 'published',
      description: event.description || '',
      maxParticipants: event.maxParticipants || '',
      image: null,
    });
    setEditingEventId(event._id);
    setIsEditing(true);
    setRegFilterEventId('create');
    if (event.image) {
      setImagePreview(`http://localhost:3000${event.image}`);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this event engagement?')) return;
    try {
      await adminAPI.deleteEvent(id);
      toast.success('Event engagement terminated');
      fetchAllData();
    } catch (_) {
      // eslint-disable-line no-unused-vars
      toast.error('Failed to terminate event engagement');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('faculty_token');
      localStorage.removeItem('faculty_user');
      toast.success('Identity disconnected');
      navigate('/faculty-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'events', label: 'Events & News', icon: <Calendar size={20} /> },
    { id: 'attendance', label: 'Student Registry', icon: <Users size={20} /> },
    { id: 'counselors', label: 'Counselors', icon: <Heart size={20} /> },
    { id: 'staff', label: 'Support Staff', icon: <ShieldCheck size={20} /> },
    { id: 'messages', label: 'Academic Chat', icon: <MessageSquare size={20} /> },
  ];

  /* ---------------- COMPONENTS ---------------- */
  const Header = () => (
    <header className="flex items-center justify-between mb-12">
      <div>
        <h2 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-1">
          Authenticated Session
        </h2>
        <h3 className="text-3xl font-black text-blue-900 italic uppercase tracking-tighter">
          Faculty <span className="text-teal-600">Dashboard</span>
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <p className="text-xs font-black text-blue-900 uppercase tracking-tight">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[9px] text-teal-600 font-bold uppercase tracking-widest">
            {user?.department} Department
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 text-xl shadow-lg">
          {user?.firstName?.charAt(0)}
        </div>
      </div>
    </header>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-700 font-sans overflow-hidden">
      <FacultyActiveStatusChecker />

      {/* SIDEBAR */}
      <aside className="w-80 bg-blue-950 flex flex-col shadow-[12px_0_40px_rgba(30,58,138,0.2)] z-20 relative text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div
          className="p-10 border-b border-white/5 flex items-center gap-4 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg group-hover:bg-teal-400/10 transition-colors">
            <LayoutDashboard className="w-6 h-6 text-teal-400" />
          </div>
          <span className="font-outfit text-2xl font-bold tracking-tight text-white uppercase">
            Campus <span className="text-teal-400">Core</span>
          </span>
        </div>

        <nav className="flex-1 p-8 space-y-3 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                activePage === item.id
                  ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-blue-950 shadow-[0_8px_20px_-6px_rgba(45,212,191,0.5)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
              }`}
            >
              <span
                className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${activePage === item.id ? 'text-blue-950' : 'text-teal-400 group-hover:text-teal-300'}`}
              >
                {item.icon}
              </span>
              <span className="font-semibold text-sm tracking-wide relative z-10">
                {item.label}
              </span>
              {activePage === item.id && (
                <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
              )}
            </button>
          ))}

          <div className="pt-8 space-y-2">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] px-4 mb-4">
              Operations
            </p>
            <button
              onClick={() => {
                setActivePage('events');
                setRegFilterEventId('create');
              }}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-teal-500 border border-teal-500/20 hover:bg-teal-500/10 transition-all font-mono"
            >
              <PlusCircle size={20} />
              NEW_PROTOCOL
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <Header />

        {/* --- OVERVIEW --- */}
        {activePage === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Events',
                  val: data.events.length,
                  icon: <Calendar className="text-teal-400" />,
                  color: 'border-teal-500/30',
                },
                {
                  label: 'Dept Students',
                  val: data.students.length,
                  icon: <Users className="text-teal-400" />,
                  color: 'border-teal-500/30',
                },
                {
                  label: 'Counselors',
                  val: data.counselors.length,
                  icon: <Heart className="text-amber-400" />,
                  color: 'border-amber-500/30',
                },
                {
                  label: 'Support Nodes',
                  val: data.staff.length,
                  icon: <ShieldCheck className="text-blue-400" />,
                  color: 'border-blue-500/30',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-8 bg-white border ${stat.color} rounded-[2.5rem] hover:scale-105 transition-all group cursor-default shadow-sm hover:shadow-xl`}
                >
                  <div className="mb-4">{stat.icon}</div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </h4>
                  <p className="text-4xl font-black text-slate-900 mt-1">
                    {stat.val.toString().padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Feed */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Recent Engagements
                  </h3>
                  <button
                    onClick={() => setActivePage('events')}
                    className="text-[10px] font-black text-teal-400 hover:text-teal-300 uppercase tracking-widest"
                  >
                    See All
                  </button>
                </div>
                <div className="space-y-4">
                  {data.events.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className="group flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 hover:border-teal-500/50 rounded-[2rem] transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-slate-700">
                          <span className="text-[10px] font-black text-teal-400 uppercase">
                            EVT
                          </span>
                          <span className="text-xl font-black text-white">#</span>
                        </div>
                        <div>
                          <h4 className="font-black text-white text-lg group-hover:text-teal-400 transition-colors uppercase tracking-tight">
                            {event.title || event.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase italic">
                              <MapPin size={12} /> {event.venue || 'TBD'}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase italic">
                              <Clock size={12} />{' '}
                              {new Date(event.startDate || event.dateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest bg-teal-500/10 text-teal-400`}
                        >
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                  {data.events.length === 0 && (
                    <div className="p-10 text-center border border-dashed border-slate-800 rounded-[2rem]">
                      <p className="text-xs font-black text-slate-600 uppercase italic tracking-widest">
                        No active engagements detected
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                  Academic Protocol
                </h3>
                <div className="p-8 bg-teal-600/5 border border-teal-500/10 rounded-[2.5rem] text-center">
                  <div className="w-16 h-16 bg-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-600/30">
                    <PlusCircle size={32} className="text-white" />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">
                    New Engagement
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                    Schedule a workshop, seminar or competition for students across departments.
                  </p>
                  <button
                    onClick={() => {
                      setActivePage('events');
                      setRegFilterEventId('create');
                    }}
                    className="mt-8 w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-teal-600/20 active:scale-95"
                  >
                    Initialize Protocol
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- EVENTS PAGE --- */}
        {activePage === 'events' && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="flex items-center gap-8 border-b border-slate-800/50 mb-10 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {['List', 'Create', 'Broadcast'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRegFilterEventId(tab === 'List' ? '' : tab.toLowerCase())}
                  className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${(tab === 'List' && regFilterEventId !== 'create' && regFilterEventId !== 'broadcast') || regFilterEventId === tab.toLowerCase() ? 'text-teal-400' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  {tab}
                  {((tab === 'List' &&
                    regFilterEventId !== 'create' &&
                    regFilterEventId !== 'broadcast') ||
                    regFilterEventId === tab.toLowerCase()) && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-teal-500 rounded-t-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></span>
                  )}
                </button>
              ))}
            </div>

            {regFilterEventId === 'create' ? (
              <div className="max-w-4xl mx-auto bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl">
                <header className="mb-10 text-center relative">
                  {isEditing && (
                    <button
                      onClick={resetForm}
                      className="absolute left-0 top-0 p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                    >
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                  )}
                  <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                    Event{' '}
                    <span className="text-teal-600">
                      {isEditing ? 'Re-Configuration' : 'Creation'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-[0.3em]">
                    Institutional Engagement System
                  </p>
                </header>

                <form
                  onSubmit={handleCreateEvent}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Title & Identity
                    </label>
                    <input
                      required
                      placeholder="EX: Advanced Neural Networks Workshop"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-teal-500 text-sm font-bold text-slate-900 transition-all shadow-inner placeholder:text-slate-300"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-teal-500 text-sm font-bold text-slate-400 transition-all cursor-pointer appearance-none shadow-inner"
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        required
                      >
                        <option value="academic">Academic Protocol</option>
                        <option value="cultural">Cultural Engagement</option>
                        <option value="sports">Athletic Segment</option>
                        <option value="workshop">Technical Workshop</option>
                        <option value="seminar">Academic Seminar</option>
                        <option value="other">General Other</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Max Users"
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-teal-500 text-sm font-bold text-slate-900 transition-all shadow-inner placeholder:text-slate-300"
                        value={eventForm.maxParticipants}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, maxParticipants: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Visual Core (Image)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative group">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="event-image-upload"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setEventForm({ ...eventForm, image: file });
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <label
                          htmlFor="event-image-upload"
                          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-teal-500 transition-all cursor-pointer text-slate-400 font-bold text-xs gap-2"
                        >
                          <ImageIcon size={20} className="text-teal-400/50" />
                          {eventForm.image ? (
                            <span className="text-teal-600">{eventForm.image.name}</span>
                          ) : (
                            <span>Select Institutional Visual</span>
                          )}
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      Location & Schedule
                    </label>
                    <input
                      placeholder="EX: Main Auditorium, Block 4"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-teal-500 text-sm font-bold text-slate-900 transition-all shadow-inner placeholder:text-slate-300"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-slate-600 uppercase tracking-widest ml-1">
                          Start Point
                        </label>
                        <input
                          type="datetime-local"
                          className="w-full p-3 rounded-xl bg-slate-800 border-none outline-none focus:ring-2 ring-teal-500 text-[11px] font-bold text-white transition-all shadow-inner"
                          value={eventForm.startDate}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, startDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-slate-600 uppercase tracking-widest ml-1">
                          End Point
                        </label>
                        <input
                          type="datetime-local"
                          className="w-full p-3 rounded-xl bg-slate-800 border-none outline-none focus:ring-2 ring-teal-500 text-[11px] font-bold text-white transition-all shadow-inner"
                          value={eventForm.endDate}
                          onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                      Engagement Brief
                    </label>
                    <textarea
                      placeholder="Outline the core objectives and syllabus for this event..."
                      className="w-full p-6 rounded-3xl bg-slate-800 border-none outline-none focus:ring-2 ring-teal-500 text-xs font-medium text-slate-300 min-h-[160px] resize-none leading-relaxed shadow-inner"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-teal-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading
                        ? 'Processing Engagement...'
                        : isEditing
                          ? 'Update Engagement Sequence'
                          : 'Broadcast Engagement Sequence'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.events.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="group p-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-teal-500 transition-all cursor-pointer relative shadow-sm hover:shadow-xl flex flex-col"
                  >
                    {/* Event Image Header */}
                    <div className="h-44 w-full relative overflow-hidden rounded-[2.2rem]">
                      {event.image ? (
                        <img
                          src={`http://localhost:3000${event.image}`}
                          alt={event.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-50 to-slate-50 flex items-center justify-center">
                          <Calendar size={48} className="text-teal-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black text-teal-600 uppercase tracking-widest shadow-sm">
                          {event.category || 'General'}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 pb-4">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                            <MapPin size={10} />
                            {event.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${event.status === 'published' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}
                          >
                            {event.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(event);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event._id);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-2 group-hover:text-teal-600 transition-colors truncate">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed italic">
                        "{event.description}"
                      </p>
                    </div>
                    <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-slate-50 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {event.registeredParticipants?.length || 0} /{' '}
                          {event.maxParticipants || '∞'}
                        </span>
                      </div>
                      <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {data.events.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">
                      Signal Lost • Zero Engagements Found
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- STUDENT REGISTRY --- */}
        {activePage === 'attendance' && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-xl">
              <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                    Identity <span className="text-teal-600">Terminal</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    Cross-Reference Attendance Matrix •{' '}
                    {user?.department || 'Department Synchronizing...'}
                  </p>
                </div>
                <div className="bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                    Active Dept Nodes: {data.students.length.toString().padStart(2, '0')}
                  </p>
                </div>
              </header>

              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                  </div>
                  <input
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-teal-500 transition-all shadow-inner placeholder:text-slate-300"
                    placeholder="SEARCH IDENTITY BY NAME OR ROLL..."
                  />
                </div>
              </div>

              <div className="rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-teal-600 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="p-6">Identity Node</th>
                      <th className="p-6">Registry Code</th>
                      <th className="p-6">Academic Path</th>
                      <th className="p-6 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.students.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50 transition-all group">
                        <td className="p-6 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-teal-600 group-hover:scale-110 transition-transform shadow-sm">
                            {student.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase group-hover:text-teal-600 transition-colors">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-tighter">
                              {student.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="font-mono text-xs text-slate-600 p-2 bg-slate-50 rounded-lg border border-slate-100 font-bold uppercase tracking-widest italic">
                            {student.studentId || 'N/A'}
                          </span>
                        </td>
                        <td className="p-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase">
                            {student.department}
                          </p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                            Semester {student.semester || 'X'}
                          </p>
                        </td>
                        <td className="p-6 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="bg-teal-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 transition-all shadow-lg active:scale-95 shadow-teal-200"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.students.length === 0 && (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <XCircle size={32} className="text-slate-200" />
                    </div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">
                      Zero Identities Found for {user?.department} Sector
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- COUNSELORS & STAFF --- */}
        {(activePage === 'counselors' || activePage === 'staff') && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <header className="px-2">
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                {activePage === 'counselors' ? 'Mental Health' : 'Support'}{' '}
                <span className="text-teal-600">Personnel</span>
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Verified Institutional Workforce
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activePage === 'counselors' ? data.counselors : data.staff).map((person) => (
                <div
                  key={person._id}
                  onClick={() => setSelectedPersonnel(person)}
                  className="p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-teal-500 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl font-black text-teal-600 italic">
                      {person.firstName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-teal-600 transition-colors">
                        {person.firstName} {person.lastName}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {person.specialization || person.category || person.role || 'Personnel'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Mail size={14} className="text-teal-600" />
                      <span className="text-[10px] font-bold truncate">{person.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Phone size={14} className="text-teal-600" />
                      <span className="text-[10px] font-bold">
                        {person.phone || 'HIDDEN_SIGNAL'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(activePage === 'counselors' ? data.counselors : data.staff).length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">
                    Protocol Silent • No Personnel Detected
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ACADEMIC CHAT --- */}
        {activePage === 'messages' && (
          <div className="flex h-[calc(100vh-250px)] max-w-6xl mx-auto bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl animate-in zoom-in-95 duration-500">
            {/* Chat List */}
            <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  Active Links
                </h3>
                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {[
                  { id: 1, name: 'Research Group A', last: 'Update on syllabus...', time: '2m' },
                  { id: 2, name: 'Admin Office', last: 'Personnel verified.', time: '1h' },
                  { id: 3, name: 'John Doe (TA)', last: 'Drafting new event...', time: '4h' },
                ].map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-all text-left shadow-sm border border-transparent hover:border-slate-100 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                      {chat.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[11px] font-black text-slate-900 uppercase truncate">
                        {chat.name}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">
                        {chat.last}
                      </p>
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase">
                      {chat.time}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Active Conversation */}
            <div className="flex-1 flex flex-col bg-slate-50/30">
              <header className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 text-xl font-black italic shadow-sm">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">
                      Research Forum
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Global Academic Thread • 12 Nodes Active
                    </p>
                  </div>
                </div>
                <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </header>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                <div className="flex justify-center mb-10">
                  <span className="px-4 py-1.5 rounded-full bg-white border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Yesterday, 14:30 PROTOCOL
                  </span>
                </div>

                <div className="flex items-end gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex flex-shrink-0 items-center justify-center text-[10px] font-black text-teal-600 shadow-sm">
                    J
                  </div>
                  <div className="bg-white px-6 py-4 rounded-t-3xl rounded-br-3xl text-xs text-slate-700 font-medium leading-relaxed border border-slate-100 shadow-sm">
                    "Initial draft for the Math Olympiad has been published. Please review the
                    syllabus for the advanced calculus segment."
                  </div>
                </div>

                <div className="flex items-end gap-3 justify-end ml-auto max-w-[80%]">
                  <div className="bg-teal-600 px-6 py-4 rounded-t-3xl rounded-bl-3xl text-xs text-white font-medium leading-relaxed shadow-lg shadow-teal-200">
                    "Acknowledged. Scanning for overlaps with Semester 4 examinations. Will update
                    registry constraints by EOD."
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex flex-shrink-0 items-center justify-center text-[10px] font-black text-white uppercase italic">
                    YOU
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-white">
                <form
                  className="relative flex items-center gap-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="flex-1 relative">
                    <input
                      className="w-full pl-6 pr-12 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 ring-teal-500 text-xs text-slate-900 font-medium shadow-inner placeholder:text-slate-300 italic"
                      placeholder="Input transmission sequence..."
                    />
                    <div className="absolute right-4 inset-y-0 flex items-center text-slate-400 gap-2">
                      <button
                        type="button"
                        className="hover:text-teal-600 transition-colors uppercase font-black text-[9px]"
                      >
                        DOC
                      </button>
                    </div>
                  </div>
                  <button className="w-14 h-14 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-teal-200 active:scale-95">
                    <ChevronRight size={24} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {selectedStudent && (
        <DetailModal
          title={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
          onClose={() => setSelectedStudent(null)}
          badge="Inscribed Identity"
        >
          <div className="space-y-4">
            {[
              { k: 'Identity Code', v: selectedStudent.studentId || 'N/A', mono: true },
              { k: 'Academic Path', v: selectedStudent.department },
              { k: 'Registration Phase', v: `Semester ${selectedStudent.semester || 'X'}` },
              { k: 'Secure Link', v: selectedStudent.email, mono: true },
              { k: 'Contact Pulse', v: selectedStudent.phone || 'UNAVAILABLE' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {item.k}
                </span>
                <span
                  className={`text-xs font-bold text-teal-600 uppercase ${item.mono ? 'font-mono' : ''}`}
                >
                  {item.v}
                </span>
              </div>
            ))}
          </div>
        </DetailModal>
      )}

      {selectedPersonnel && (
        <DetailModal
          title={`${selectedPersonnel.firstName} ${selectedPersonnel.lastName}`}
          onClose={() => setSelectedPersonnel(null)}
          badge="Institutional Node"
        >
          <div className="space-y-4">
            {[
              {
                k: 'Department/Role',
                v:
                  selectedPersonnel.specialization ||
                  selectedPersonnel.category ||
                  selectedPersonnel.role ||
                  'Personnel',
              },
              { k: 'Email Link', v: selectedPersonnel.email, mono: true },
              { k: 'Contact Pulse', v: selectedPersonnel.phone || 'HIDDEN' },
              { k: 'Status', v: 'ACTIVE_GATEWAY' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {item.k}
                </span>
                <span
                  className={`text-xs font-bold text-teal-600 uppercase ${item.mono ? 'font-mono' : ''}`}
                >
                  {item.v}
                </span>
              </div>
            ))}
          </div>
        </DetailModal>
      )}

      {selectedEvent && (
        <DetailModal
          title={selectedEvent.title || selectedEvent.name}
          onClose={() => setSelectedEvent(null)}
          badge="Engagement Protocol"
        >
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3 italic">
                Engagement Brief
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                "{selectedEvent.description || 'No description provided'}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Sector</p>
                <p className="text-xs font-black text-slate-900 uppercase">
                  {selectedEvent.type || 'General'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Location</p>
                <p className="text-xs font-black text-slate-900 uppercase truncate">
                  {selectedEvent.venue || 'Campus'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-teal-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase italic">
                  Schedule Time
                </span>
              </div>
              <span className="text-sm font-black text-slate-900 italic">
                {new Date(selectedEvent.startDate || selectedEvent.dateTime).toLocaleString()}
              </span>
            </div>
          </div>
        </DetailModal>
      )}
    </div>
  );
};

const DetailModal = ({ title, badge, onClose, children }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[100] p-4 animate-in fade-in duration-300"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white border border-slate-200 w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500"
    >
      <div className="p-10 border-b border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-10 right-10 text-slate-400 hover:text-blue-900 transition-all transform hover:rotate-90"
        >
          <XCircle size={28} strokeWidth={1} />
        </button>
        <span className="bg-teal-50 text-teal-600 border border-teal-100 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
          {badge}
        </span>
        <h3 className="text-3xl font-black text-blue-950 italic uppercase tracking-tighter mt-4 leading-none">
          {title}
        </h3>
      </div>
      <div className="p-10">
        {children}
        <button
          onClick={onClose}
          className="mt-10 w-full py-5 bg-gradient-to-r from-blue-900 to-blue-950 hover:from-blue-800 hover:to-blue-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-200"
        >
          Close View
        </button>
      </div>
    </div>
  </div>
);

export default FacultyDashboard;
