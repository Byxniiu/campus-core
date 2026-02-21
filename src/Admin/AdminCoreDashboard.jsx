import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllStudents,
  getAllTeachers,
  getAllCounselors,
  getAllStaff,
  getAllEvents,
  toggleUserStatus,
  getAllSOSAlerts,
  getCounselingRequests,
  rejectCounselingRequest,
  getHelpRequests,
  acceptHelpRequest,
  rejectHelpRequest,
  getSystemStats,
} from '../api/admin';
import { timetableAPI } from '../api/timetables';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import toast from 'react-hot-toast';
import PendingFacultyApprovals from './PendingFacultyApprovals';
import AddCounselorModal from './AddCounselorModal';
import AddStaffModal from './AddStaffModal';
import AcceptanceModal from '../Counselors/AcceptanceModal';
import { counselingAPI } from '../api/counseling';
import { sosAPI } from '../api/sos';
import {
  Calendar,
  Clock,
  Plus,
  User as UserIcon,
  MapPin,
  Bell,
  Radio,
  X,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useSocketStore } from '../stores/useSocketStore';
import ProfileManager from '../components/profile/ProfileManager';

const AdminCoreDashboard = () => {
  const navigate = useNavigate();
  const logout = useAdminAuthStore((state) => state.logout);
  const user = useAdminAuthStore((state) => state.user);
  const token = useAdminAuthStore((state) => state.token);
  const { socket, connect } = useSocketStore();

  // Ref-based Audio to ensure it survives re-renders and is accessible in callbacks
  const sirenRef = useRef(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (sirenRef.current) {
        sirenRef.current.pause();
        sirenRef.current = null;
      }
    };
  }, []);
  const testSiren = () => {
    // List of potential siren URLs (Prioritize local file for zero-failure reliability)
    const soundUrls = [
      '/preview.mp3', // Actual file in public folder
      '/siren.mp3', // Alternative local name
      'https://upload.wikimedia.org/wikipedia/commons/b/b3/Emergency_Siren.mp3',
      'https://www.soundjay.com/misc/sounds/ambulance-siren-01.mp3',
    ];

    let currentUrlIndex = 0;

    const attemptPlay = (url) => {
      console.log(`[Audio] Syncing node with signal: ${url}`);
      const newSiren = new Audio(url);
      newSiren.crossOrigin = 'anonymous'; // Bypass potential CORS filtering
      newSiren.loop = true;
      newSiren.volume = 0.5;

      // Force load to verify connectivity
      newSiren.load();

      newSiren
        .play()
        .then(() => {
          console.log('[Audio] Safety protocol established successfully');
          if (sirenRef.current) sirenRef.current.pause();
          sirenRef.current = newSiren;

          toast.success('Emergency audio system synchronized');
          setIsSoundEnabled(true);
          setIsSirenPlaying(true);

          // Execute 3-second diagnostic blast
          setTimeout(() => {
            const hasPending = data.sos.some(
              (s) => s.status === 'pending' || s.status === 'acknowledged'
            );
            if (!hasPending && sirenRef.current === newSiren) {
              newSiren.pause();
              setIsSirenPlaying(false);
            }
          }, 3000);
        })
        .catch((e) => {
          console.warn(`[Audio] URL failed: ${url}`, e);
          currentUrlIndex++;
          if (currentUrlIndex < soundUrls.length) {
            attemptPlay(soundUrls[currentUrlIndex]);
          } else {
            console.error('[Audio] All siren URLs failed to initialize', e);
            if (e.name === 'NotAllowedError') {
              toast.error(
                'Browser blocked audio. Please click anywhere on the dashboard first, then try again.'
              );
            } else {
              toast.error('Sound system timeout. Please check your internet or try again.');
            }
          }
        });
    };

    attemptPlay(soundUrls[0]);
  };

  const silenceAlarm = () => {
    if (sirenRef.current) {
      sirenRef.current.pause();
      sirenRef.current.currentTime = 0;
    }
    setIsSirenPlaying(false);
    toast.success('Alarm silenced');
  };

  const [activePage, setActivePage] = useState(() => {
    if (user?.role === 'counselor') return 'counseling_requests';
    if (user?.role === 'staff') return 'help_requests';
    return 'dashboard';
  });
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddCounselorModal, setShowAddCounselorModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [adminContact, setAdminContact] = useState('');
  const [selectedCounselingRequest, setSelectedCounselingRequest] = useState(null);
  const [acceptanceForm, setAcceptanceForm] = useState({
    assignedSlot: '',
    location: '',
    meetingLink: '',
    counselorResponse: '',
  });

  // --- CENTRAL STATE ---
  const [data, setData] = useState({
    students: [],
    teachers: [],
    counselors: [],
    staff: [],
    events: [],
    sos: [],
    counseling_requests: [],
    help_requests: [],
    timetables: [],
    stats: null,
  });

  // Auto-manage siren based on alert presence
  useEffect(() => {
    const hasPendingSOS = data.sos.some(
      (s) => s.status === 'pending' || s.status === 'acknowledged'
    );
    if (isSoundEnabled && hasPendingSOS && !isSirenPlaying && sirenRef.current) {
      sirenRef.current.play().catch((e) => console.warn('Siren auto-start failed:', e));
      setIsSirenPlaying(true);
    } else if (!hasPendingSOS && isSirenPlaying) {
      silenceAlarm();
    }
  }, [data.sos, isSoundEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- UI Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  // --- FETCH DATA ---
  const fetchData = async (page) => {
    setLoading(true);
    try {
      let response;
      switch (page) {
        case 'dashboard':
          response = await getSystemStats();
          break;
        case 'students':
          response = await getAllStudents();
          break;
        case 'teachers':
          response = await getAllTeachers();
          break;
        case 'counselors':
          response = await getAllCounselors();
          break;
        case 'staff':
          response = await getAllStaff();
          break;
        case 'events':
          response = await getAllEvents();
          break;
        case 'sos':
          response = await getAllSOSAlerts();
          break;
        case 'counseling_requests':
          response = await getCounselingRequests();
          break;
        case 'help_requests':
          response = await getHelpRequests();
          break;
        case 'timetables':
          response = await timetableAPI.getAllTimetables();
          break;
        case 'profile': {
          const { userAPI } = await import('../api/user');
          response = await userAPI.getProfile();
          break;
        }
        default:
          return;
      }

      console.log(`Fetched ${page}:`, response); // Debug log

      if (response.success) {
        let fetchedData = response.data;
        // Handle cases where data is wrapped in an object like { requests: [...] }
        if (
          !Array.isArray(fetchedData) &&
          fetchedData !== null &&
          typeof fetchedData === 'object'
        ) {
          const keys = Object.keys(fetchedData);
          if (keys.length === 1 && Array.isArray(fetchedData[keys[0]])) {
            fetchedData = fetchedData[keys[0]];
          }
        }
        if (page === 'dashboard') {
          setData((prev) => ({ ...prev, stats: fetchedData }));
        } else if (page === 'profile') {
          useAdminAuthStore.getState().setUser(fetchedData.user || fetchedData);
        } else {
          setData((prev) => ({ ...prev, [page]: fetchedData }));
        }
      }
    } catch (error) {
      console.error(`[CRITICAL] Error fetching ${page}:`, error);
      const detail = error.data?.message || error.message || 'Unknown Error';
      console.error(`[DETAIL] ${detail}`);
      toast.error(`Failed to fetch ${page}: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) connect(token);
  }, [token, connect]);

  // SOS Real-time Listener
  useEffect(() => {
    if (!socket) return;

    const handleNewSOS = (payload) => {
      const alert = payload.alert || payload;
      toast.error(`🆘 EMERGENCY: ${alert.student?.firstName} needs assistance!`, {
        duration: 10000,
        position: 'top-right',
        icon: '🆘',
      });

      // Play siren if enabled and active in background
      if (isSoundEnabled && sirenRef.current) {
        sirenRef.current.play().catch((e) => {
          console.warn('SOS auto-audio failed:', e);
          if (e.name === 'NotAllowedError') {
            toast.error(
              'Browser blocked emergency audio. Please click anywhere to resume safety monitoring.'
            );
          }
        });
        setIsSirenPlaying(true);
      } else if (!isSoundEnabled) {
        // Remind admin that sound is off during an actual emergency
        toast('Emergency Audio is DISABLED. Enable siren in the SOS tab for auditory alerts.', {
          icon: '🔇',
          duration: 6000,
        });
      }

      // Update state if unique
      setData((prev) => {
        if (prev.sos.some((s) => s._id === alert._id)) return prev;

        return {
          ...prev,
          sos: [alert, ...prev.sos],
          stats: prev.stats
            ? {
                ...prev.stats,
                requests: {
                  ...prev.stats.requests,
                  sos: (prev.stats.requests.sos || 0) + 1,
                },
              }
            : prev.stats,
        };
      });
    };

    socket.on('sos:new-alert', handleNewSOS);
    return () => socket.off('sos:new-alert', handleNewSOS);
  }, [socket, isSoundEnabled]);

  useEffect(() => {
    if (
      [
        'students',
        'teachers',
        'counselors',
        'staff',
        'events',
        'sos',
        'pending_approvals',
        'counseling_requests',
        'help_requests',
        'dashboard',
        'timetables',
        'profile',
      ].includes(activePage)
    ) {
      fetchData(activePage);
    }
  }, [activePage]);

  // Verify admin access on mount
  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role:', user?.role);

    if (!user) {
      toast.error('Please login first');
      navigate('/admin-login');
      return;
    }

    const allowedRoles = ['admin', 'counselor', 'staff'];
    if (!allowedRoles.includes(user.role)) {
      toast.error('Access denied');
      logout();
      navigate('/admin-login');
    }
  }, [user, navigate, logout]);

  const toggleBlock = async (id, listKey) => {
    try {
      const response = await toggleUserStatus(id);
      console.log('Toggle status response:', response); // Debug log

      if (response.success) {
        setData((prev) => ({
          ...prev,
          [listKey]: prev[listKey].map((item) =>
            item._id === id ? { ...item, isActive: !item.isActive } : item
          ),
        }));
        toast.success(response.message);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error(error.message || 'Failed to change user status');
    }
  };

  const handleCounselingAction = async (id, action) => {
    if (action === 'accept') {
      // Open the acceptance modal instead of directly accepting
      const request = data.counseling_requests.find((r) => r._id === id);
      setSelectedCounselingRequest(request);
      setShowAcceptanceModal(true);
    } else {
      // Reject directly
      try {
        const response = await rejectCounselingRequest(id);
        if (response.success) {
          toast.success('Request rejected');
          fetchData('counseling_requests');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to reject request');
      }
    }
  };

  const handleSubmitAcceptance = async (e) => {
    e.preventDefault();

    if (!acceptanceForm.assignedSlot) {
      toast.error('Please select an appointment date and time');
      return;
    }

    setLoading(true);
    try {
      const res = await counselingAPI.manageRequest(selectedCounselingRequest._id, {
        status: 'accepted',
        assignedSlot: acceptanceForm.assignedSlot,
        location: acceptanceForm.location,
        meetingLink: acceptanceForm.meetingLink,
        counselorResponse: acceptanceForm.counselorResponse,
      });

      if (res.success) {
        toast.success('✅ Request accepted! Student has been notified with appointment details.');
        setSelectedCounselingRequest(null);
        setShowAcceptanceModal(false);
        setAcceptanceForm({
          assignedSlot: '',
          location: '',
          meetingLink: '',
          counselorResponse: '',
        });
        fetchData('counseling_requests');
      }
    } catch (err) {
      toast.error(err?.message || err || 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGenerateMessage = () => {
    const appointmentDate = acceptanceForm.assignedSlot
      ? new Date(acceptanceForm.assignedSlot).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '[Date to be confirmed]';
    const appointmentTime = acceptanceForm.assignedSlot
      ? new Date(acceptanceForm.assignedSlot).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '[Time to be confirmed]';
    const appointmentLocation = acceptanceForm.location || 'Counseling Room – Block B, Room 203';

    setAcceptanceForm({
      ...acceptanceForm,
      counselorResponse: `Your request has been accepted. I understand that seeking help is not always easy, and I appreciate your initiative.

📅 Date: ${appointmentDate}
🕒 Time: ${appointmentTime}
📍 Location: ${appointmentLocation}

Please bring your student ID. All discussions will remain strictly confidential. Looking forward to meeting you.`,
    });
  };

  const handleHelpAction = async (id, action) => {
    try {
      let response;
      const extraData = {
        staffMessage: adminMessage,
        staffContact: adminContact,
      };

      if (action === 'accept') {
        response = await acceptHelpRequest(id, extraData);
      } else {
        response = await rejectHelpRequest(id, extraData);
      }

      if (response.success) {
        toast.success(`Help request ${action === 'accept' ? 'accepted' : 'rejected'}`);
        setAdminMessage('');
        setAdminContact('');
        fetchData('help_requests');
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${action} help request`);
    }
  };

  const handleResolveSOS = async (id) => {
    try {
      const response = await sosAPI.updateStatus(id, 'resolved', 'Resolved via Admin Dashboard');
      if (response.success) {
        toast.success('SOS alert resolved');

        // Update local state
        setData((prev) => {
          const updatedSOS = prev.sos.map((alert) =>
            alert._id === id ? { ...alert, status: 'resolved' } : alert
          );

          // Check if any pending alerts remain
          const hasPending = updatedSOS.some((s) => s.status === 'pending');
          if (!hasPending && isSirenPlaying) {
            silenceAlarm();
          }

          return { ...prev, sos: updatedSOS };
        });

        // Update stats
        fetchData('dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resolve alert');
    }
  };

  const formatSidebarLabel = (key) => {
    const labels = {
      dashboard: 'DASHBOARD',
      students: 'STUDENTS',
      teachers: 'TEACHERS',
      counselors: 'COUNSELORS',
      staff: 'NON-TEACHING STAFF',
      events: 'EVENTS',
      sos: 'EMERGENCY SOS',
      pending_approvals: 'PENDING APPROVALS',
      counseling_requests: 'COUNSELING REQUESTS',
      help_requests: 'HELP REQUESTS',
      profile: 'IDENTITY PROFILE',
    };
    return labels[key] || key.replace('_', ' ').toUpperCase();
  };

  const getFilteredData = () => {
    let list = data[activePage] || [];
    if (!Array.isArray(list)) return [];

    return list.filter((item) => {
      const name = (
        item.firstName ? `${item.firstName} ${item.lastName}` : item.name || ''
      ).toLowerCase();
      const id = (item.studentId || item.employeeId || item._id || '').toLowerCase();
      const dept = (item.department || item.specialization || item.category || 'All').toLowerCase();

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === 'All' || dept === filterDept.toLowerCase();

      return matchesSearch && matchesDept;
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-blue-950 flex flex-col shadow-[12px_0_40px_rgba(30,58,138,0.2)] z-20 relative text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="p-10 border-b border-white/5 text-center relative z-10">
          <h1 className="text-xl font-black tracking-widest text-white italic">
            CAMPUS <span className="text-teal-400">CORE</span>
          </h1>
          <p className="text-[10px] text-teal-400 uppercase mt-1 tracking-widest font-bold">
            Administrative HUB
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
          {[
            {
              category: 'CORE',
              items: ['dashboard', 'students', 'teachers', 'counselors', 'staff'],
            },
            {
              category: 'MANAGEMENT',
              items: ['events', 'timetables', 'pending_approvals'],
            },
            {
              category: 'SUPPORT',
              items: ['sos', 'counseling_requests', 'help_requests'],
            },
            {
              category: 'ACCOUNT',
              items: ['profile'],
            },
          ].map((cat) => {
            const visibleItems = cat.items.filter((key) => {
              if (user?.role === 'admin') {
                return key !== 'profile'; // Admins don't need to edit their profile in this view
              }
              if (user?.role === 'counselor') {
                return ['students', 'teachers', 'sos', 'counseling_requests', 'profile'].includes(
                  key
                );
              }
              if (user?.role === 'staff') {
                return ['students', 'teachers', 'sos', 'help_requests', 'profile'].includes(key);
              }
              return false;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={cat.category} className="space-y-2">
                <p className="px-4 text-xs font-black text-teal-400 uppercase tracking-[0.2em] opacity-50">
                  {cat.category}
                </p>
                {visibleItems.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActivePage(key);
                      setSearchTerm('');
                      setFilterDept('All');
                    }}
                    className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all duration-300 group relative overflow-hidden ${
                      activePage === key
                        ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-blue-950 shadow-[0_8px_20px_-6px_rgba(45,212,191,0.5)]'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{formatSidebarLabel(key)}</span>
                      {activePage === key && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-950"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="p-6 border-t border-white/5 relative z-10">
          <div className="mb-4 px-2">
            <p className="text-[10px] text-teal-400 uppercase font-black mb-1">Logged in as</p>
            <p className="text-sm text-white font-bold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10 bg-slate-50">
        {activePage === 'profile' && (user.role === 'counselor' || user.role === 'staff') ? (
          <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <header className="mb-12">
              <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">
                Identity <span className="text-teal-600">Verification</span>
              </h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2 px-1">
                Institutional Administrative Identity Profile
              </p>
            </header>
            <ProfileManager
              user={user}
              onUpdate={(updatedUser) => useAdminAuthStore.getState().setUser(updatedUser)}
              type={user.role}
            />
          </div>
        ) : (
          <div className="admin-page-content">
            <header className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-blue-950 capitalize tracking-tighter">
                  {formatSidebarLabel(activePage)}
                </h2>
                <div className="flex gap-4">
                  {activePage === 'counselors' && (
                    <button
                      onClick={() => setShowAddCounselorModal(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                    >
                      <Plus size={16} strokeWidth={3} />
                      Add Counselor
                    </button>
                  )}
                  {activePage === 'staff' && (
                    <button
                      onClick={() => setShowAddStaffModal(true)}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center gap-2"
                    >
                      <Plus size={16} strokeWidth={3} />
                      Add Staff
                    </button>
                  )}
                </div>
              </div>

              {['students', 'teachers', 'counselors', 'staff', 'timetables'].includes(
                activePage
              ) && (
                <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={`Search ${activePage}...`}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 ring-teal-500/20"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {['students', 'teachers', 'timetables'].includes(activePage) && (
                    <select
                      className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 ring-teal-500/20 min-w-[150px]"
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                    >
                      <option value="All">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Business">Business</option>
                      <option value="Arts">Arts</option>
                    </select>
                  )}
                </div>
              )}
            </header>

            {/* --- DASHBOARD OVERVIEW --- */}
            {activePage === 'dashboard' &&
              (loading && !data.stats ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-xs font-black text-teal-600 uppercase tracking-widest">
                    Aggregating System Intelligence...
                  </p>
                </div>
              ) : data.stats ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        label: 'Total Students',
                        value: data.stats.users.students,
                        color: 'bg-blue-600',
                        icon: '🎓',
                      },
                      {
                        label: 'Teachers',
                        value: data.stats.users.teachers,
                        color: 'bg-emerald-600',
                        icon: '👨‍🏫',
                      },
                      {
                        label: 'Counselors',
                        value: data.stats.users.counselors,
                        color: 'bg-amber-600',
                        icon: '🤝',
                      },
                      {
                        label: 'Operational Staff',
                        value: data.stats.users.staff,
                        color: 'bg-indigo-600',
                        icon: '🛠️',
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-3xl">{stat.icon}</span>
                          <div
                            className={`w-2 h-8 rounded-full ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                          ></div>
                        </div>
                        <h4 className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                          {stat.label}
                        </h4>
                        <p className="text-3xl font-black text-blue-900 mt-1">
                          {stat.value.toString().padStart(2, '0')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Critical Alerts */}
                    <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                      <h3 className="text-xs font-black text-teal-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{' '}
                        Critical Node Status
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            label: 'Pending SOS Alerts',
                            value: data.stats.requests.sos,
                            color: 'text-red-500',
                            bg: 'bg-red-500/10',
                          },
                          {
                            label: 'Counseling Requests',
                            value: data.stats.requests.counseling,
                            color: 'text-amber-500',
                            bg: 'bg-amber-500/10',
                          },
                          {
                            label: 'Help Requests',
                            value: data.stats.requests.help,
                            color: 'text-blue-500',
                            bg: 'bg-blue-500/10',
                          },
                          {
                            label: 'Faculty Approvals',
                            value: data.stats.users.pendingFaculty,
                            color: 'text-emerald-500',
                            bg: 'bg-emerald-500/10',
                          },
                          {
                            label: 'Active Timetables',
                            value: data.stats.requests.timetables || 0,
                            color: 'text-indigo-500',
                            bg: 'bg-indigo-500/10',
                          },
                        ].map((alert, idx) => (
                          <div
                            key={idx}
                            className={`flex justify-between items-center p-5 rounded-2xl ${alert.bg} border border-slate-100`}
                          >
                            <span className="text-[10px] font-black uppercase text-teal-700">
                              {alert.label}
                            </span>
                            <span className={`text-xl font-black ${alert.color}`}>
                              {alert.value.toString().padStart(2, '0')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm flex flex-col justify-center text-center">
                      <div className="mb-6">
                        <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-4">
                          <svg
                            className="w-12 h-12 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter italic">
                          System Operational
                        </h3>
                        <p className="text-xs text-teal-600 mt-2 font-bold uppercase tracking-widest">
                          Gateway Verified • Secure Encryption
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <button
                          onClick={() => setActivePage('counseling_requests')}
                          className="bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl transition-all border border-slate-100"
                        >
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                            Queue
                          </p>
                          <p className="text-xs font-black text-blue-900">COUNSELING</p>
                        </button>
                        <button
                          onClick={() => setActivePage('help_requests')}
                          className="bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl transition-all border border-slate-100"
                        >
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                            Queue
                          </p>
                          <p className="text-xs font-black text-blue-900">HELP</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  No system statistics available
                </div>
              ))}

            {/* --- USER LISTS (Students, Teachers, Counselors, Staff) --- */}
            {['students', 'teachers', 'counselors', 'staff'].includes(activePage) && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-slate-400 uppercase font-black border-b border-slate-100">
                    <tr>
                      <th className="pb-4">Member</th>
                      <th className="pb-4">ID</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Dept</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-10 text-center text-slate-400">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                            <span className="font-bold tracking-widest uppercase text-[10px]">
                              Accessing Secure Records...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : data[activePage].length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]"
                        >
                          No records found
                        </td>
                      </tr>
                    ) : (
                      getFilteredData().map((item) => (
                        <tr
                          key={item._id}
                          onClick={() => setSelectedPerson(item)}
                          className={`group hover:bg-slate-50 transition-all cursor-pointer ${!item.isActive ? 'opacity-40' : ''}`}
                        >
                          <td className="py-4 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                              {item.avatar || item.profilePic ? (
                                <img
                                  src={`http://localhost:3000${item.avatar || item.profilePic}`}
                                  className="w-full h-full object-cover"
                                  alt="pfp"
                                />
                              ) : (
                                (item.firstName || item.name || 'U').charAt(0)
                              )}
                            </div>
                            <span className="font-bold text-blue-900 group-hover:text-blue-600">
                              {item.firstName ? `${item.firstName} ${item.lastName}` : item.name}
                            </span>
                          </td>
                          <td className="py-4 font-mono text-slate-500 text-xs">
                            {item.studentId || item.employeeId || item.id}
                          </td>
                          <td className="py-4 font-mono text-slate-500 text-xs text-ellipsis overflow-hidden">
                            {item.email}
                          </td>
                          <td className="py-4 text-slate-600">
                            {item.department || item.specialization || item.category}
                          </td>
                          <td className="py-4 text-right">
                            {user.role === 'admin' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBlock(item._id, activePage);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${!item.isActive ? 'bg-emerald-600 text-white' : 'bg-red-600/10 text-red-500'}`}
                              >
                                {item.isActive ? 'Block' : 'Unblock'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- EVENTS VIEW --- */}
            {activePage === 'events' && (
              <div className="grid gap-6">
                {loading ? (
                  <div className="flex flex-col items-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <span className="font-bold tracking-widest uppercase text-[10px] text-slate-400">
                      Loading events...
                    </span>
                  </div>
                ) : data.events.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    No events found
                  </div>
                ) : (
                  data.events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col md:flex-row"
                    >
                      {/* Event Image */}
                      <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 relative shrink-0">
                        {event.image ? (
                          <img
                            src={`http://localhost:3000${event.image}`}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.classList.add('hidden');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent opacity-60"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-black text-blue-900 group-hover:text-blue-600 leading-tight">
                                {event.title}
                              </h3>
                              <p className="text-[10px] text-teal-600 uppercase tracking-widest mt-2 font-bold">
                                {event.category}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase shrink-0 ml-4 ${
                                event.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : event.status === 'completed'
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                              }`}
                            >
                              {event.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed font-medium">
                            {event.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-bold uppercase tracking-wide mt-auto pt-4 border-t border-slate-50">
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(event.startDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {event.department}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- SOS ALERTS VIEW --- */}
            {activePage === 'sos' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl ${isSirenPlaying ? 'bg-red-100 text-red-600 animate-pulse' : isSoundEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}
                    >
                      {isSirenPlaying ? (
                        <Radio size={24} />
                      ) : (
                        <Bell size={24} className={isSoundEnabled ? '' : 'animate-bounce'} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-blue-950 uppercase tracking-tighter">
                        {isSirenPlaying ? 'CRITICAL EMERGENCY ACTIVE' : 'Emergency Audio Protocol'}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        {isSirenPlaying
                          ? 'Institutional alarm is currently broadcasting'
                          : isSoundEnabled
                            ? 'Audio System Operational'
                            : 'Action Required: Enable siren for real-time alerts'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {isSirenPlaying && (
                      <button
                        onClick={silenceAlarm}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-red-500 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        <X size={14} /> Silence Alarm
                      </button>
                    )}
                    <button
                      onClick={testSiren}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-lg active:scale-95 ${
                        isSoundEnabled
                          ? 'bg-blue-950 text-white hover:bg-teal-600'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {isSoundEnabled ? 'Test Alarm System' : 'Enable Emergency Siren'}
                    </button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {loading ? (
                    <div className="flex flex-col items-center py-20">
                      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                      <span className="font-bold tracking-widest uppercase text-[10px] text-slate-400">
                        Loading SOS alerts...
                      </span>
                    </div>
                  ) : data.sos.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                      No SOS alerts found
                    </div>
                  ) : (
                    data.sos.map((alert) => (
                      <div
                        key={alert._id}
                        className={`bg-white border-2 ${alert.priority === 'critical' ? 'border-red-500 animate-pulse' : 'border-slate-200'} rounded-[2.5rem] p-8 hover:shadow-2xl transition-all group relative overflow-hidden`}
                      >
                        {alert.priority === 'critical' && (
                          <div className="absolute top-0 right-0 p-4">
                            <Radio className="text-red-500 animate-ping" size={24} />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-blue-900 overflow-hidden shadow-inner">
                              {alert.student?.avatar ? (
                                <img
                                  src={`http://localhost:3000${alert.student.avatar}`}
                                  className="w-full h-full object-cover"
                                  alt="pfp"
                                />
                              ) : (
                                (alert.student?.firstName || 'U').charAt(0)
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-blue-950 uppercase italic tracking-tighter">
                                {alert.student?.firstName} {alert.student?.lastName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest px-2 py-0.5 bg-teal-50 rounded">
                                  {alert.type}
                                </p>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                  • {alert.student?.studentId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                alert.status === 'resolved'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : 'bg-red-50 text-red-600 border-red-100'
                              }`}
                            >
                              {alert.status}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                                alert.priority === 'critical'
                                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                  : alert.priority === 'high'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-blue-500 text-white'
                              }`}
                            >
                              {alert.priority} Priority
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-50/50 rounded-3xl p-6 mb-6 border border-slate-100">
                          <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                            "{alert.description}"
                          </p>
                        </div>

                        <div className="flex flex-wrap items-start justify-between gap-4 pt-4 border-t border-slate-50">
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-2 text-blue-950 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                🏢 {alert.location?.building || 'Main Campus'}
                              </span>
                              <span>⏰ {new Date(alert.createdAt).toLocaleString()}</span>
                              {alert.location?.latitude || alert.location?.lat ? (
                                <span className="flex items-center gap-2 text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                                  <Radio size={12} className="animate-pulse" /> GPS Uplink Active
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">No GPS data</span>
                              )}
                            </div>
                            {alert.location?.address && (
                              <div className="bg-slate-50 p-4 rounded-2xl border border-dotted border-slate-200">
                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">
                                  Precise Location Address
                                </p>
                                <p className="text-sm font-bold text-slate-600">
                                  📍 {alert.location.address}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3">
                            {alert.status === 'pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolveSOS(alert._id);
                                }}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                              >
                                <CheckCircle2 size={14} />
                                Resolve
                              </button>
                            )}
                            {(alert.location?.latitude || alert.location?.lat) && (
                              <button
                                onClick={() => {
                                  const lat = alert.location.latitude || alert.location.lat;
                                  const lng = alert.location.longitude || alert.location.lng;
                                  window.open(
                                    `https://www.google.com/maps?q=${lat},${lng}`,
                                    '_blank'
                                  );
                                }}
                                className="flex items-center gap-2 bg-blue-950 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg active:scale-95"
                              >
                                <MapPin size={14} />
                                Open Live Map
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setSelectedPerson({ ...alert.student, sosAlert: alert })
                              }
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* --- COUNSELING REQUESTS VIEW --- */}
            {activePage === 'counseling_requests' && (
              <div className="grid gap-6">
                {loading ? (
                  <div className="flex flex-col items-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <span className="font-bold tracking-widest uppercase text-[10px] text-slate-400 text-center">
                      Establishing secure tunnel to Counseling Database...
                    </span>
                  </div>
                ) : data.counseling_requests.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    No counseling requests found
                  </div>
                ) : (
                  data.counseling_requests.map((req) => (
                    <div
                      key={req._id}
                      onClick={() => setSelectedCounselingRequest(req)}
                      className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-black text-blue-950 italic tracking-tighter uppercase line-clamp-1">
                            {req.title}
                          </h3>
                          <div className="flex gap-3 items-center mt-1">
                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded">
                              {req.category}
                            </p>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              📡 {req.preferredMode}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {req.status === 'pending' && user?.role === 'counselor' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCounselingAction(req._id, 'accept');
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                              >
                                Assign / Accept
                              </button>
                            </>
                          )}
                          <span
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase ${
                              req.status === 'accepted' ||
                              req.status === 'in-session' ||
                              req.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : req.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                        {req.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                              {!req.isAnonymous && req.student?.avatar ? (
                                <img
                                  src={`http://localhost:3000${req.student.avatar}`}
                                  className="w-full h-full object-cover"
                                  alt="avatar"
                                />
                              ) : (
                                <span className="text-[10px]">👤</span>
                              )}
                            </div>
                            <span className="truncate">
                              {req.isAnonymous
                                ? 'ANONYMOUS'
                                : `${req.student?.firstName} ${req.student?.lastName}`}
                            </span>
                          </span>
                          <span>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
                          {req.preferredSlot && (
                            <span className="flex items-center gap-1 text-teal-600">
                              🕒 {req.preferredSlot}
                            </span>
                          )}
                          {req.preferredCounselor && (
                            <span className="text-indigo-500">
                              🎯 Pref: {req.preferredCounselor?.firstName}
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-[8px] font-black uppercase ${
                            req.priority === 'urgent' || req.priority === 'high'
                              ? 'bg-red-600 text-white'
                              : req.priority === 'medium'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-500 text-white'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- HELP REQUESTS VIEW --- */}
            {activePage === 'help_requests' && (
              <div className="grid gap-6">
                {loading ? (
                  <div className="flex flex-col items-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <span className="font-bold tracking-widest uppercase text-[10px] text-slate-400">
                      Retrieving Help Desk Protocol...
                    </span>
                  </div>
                ) : data.help_requests.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    No help requests found
                  </div>
                ) : (
                  data.help_requests.map((req) => (
                    <div
                      key={req._id}
                      className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-black text-blue-900 italic tracking-tighter uppercase">
                            {req.title}
                          </h3>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                            {req.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(req.status === 'Pending' || req.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleHelpAction(req._id, 'accept')}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                              >
                                Assign to Me
                              </button>
                              <button
                                onClick={() => handleHelpAction(req._id, 'reject')}
                                className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-[9px] font-black uppercase rounded-xl border border-red-500/20 transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {req.status !== 'Pending' && req.status !== 'pending' && (
                            <span
                              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase ${
                                req.status === 'Resolved' ||
                                req.status === 'In Progress' ||
                                req.status === 'assigned'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {req.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{req.description}</p>

                      {/* Quick Response Inputs (Optional) */}
                      {(req.status === 'Pending' || req.status === 'pending') && (
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <input
                            type="text"
                            placeholder="Contact Number (Optional)"
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-blue-500"
                            value={adminContact}
                            onChange={(e) => setAdminContact(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Response Message (Optional)"
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-blue-500"
                            value={adminMessage}
                            onChange={(e) => setAdminMessage(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] text-slate-400">
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                            {req.student?.avatar ? (
                              <img
                                src={`http://localhost:3000${req.student.avatar}`}
                                className="w-full h-full object-cover"
                                alt="avatar"
                              />
                            ) : (
                              <span className="text-[10px]">👤</span>
                            )}
                          </div>
                          <span className="font-bold">
                            STUDENT: {req.student?.firstName} {req.student?.lastName}
                          </span>
                          <span>📍 {req.location?.current || 'N/A'}</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                            req.priority === 'High' || req.priority === 'high'
                              ? 'bg-red-600 text-white'
                              : req.priority === 'Medium' || req.priority === 'medium'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-500 text-white'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- TIMETABLES VIEW --- */}
            {activePage === 'timetables' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-slate-400 uppercase font-black border-b border-slate-100">
                    <tr>
                      <th className="pb-4">Department</th>
                      <th className="pb-4">Semester</th>
                      <th className="pb-4">Section</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="py-10 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    ) : getFilteredData().length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]"
                        >
                          No timetables found
                        </td>
                      </tr>
                    ) : (
                      getFilteredData().map((table) => (
                        <tr key={table._id} className="group hover:bg-slate-50 transition-all">
                          <td className="py-6 font-bold text-blue-900">{table.department}</td>
                          <td className="py-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-[10px] uppercase">
                              Semester {table.semester}
                            </span>
                          </td>
                          <td className="py-6 font-mono font-bold text-slate-400">
                            {table.section}
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      'Are you sure you want to delete this timetable?'
                                    )
                                  ) {
                                    try {
                                      const res = await timetableAPI.deleteTimetable(table._id);
                                      if (res.success) {
                                        toast.success('Timetable deleted');
                                        fetchData('timetables');
                                      }
                                    } catch (err) {
                                      toast.error(err.message || 'Delete failed');
                                    }
                                  }
                                }}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- PENDING APPROVALS VIEW --- */}
            {activePage === 'pending_approvals' && <PendingFacultyApprovals />}
          </div>
        )}
      </main>
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-white border border-slate-200 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-40 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white">
                {selectedPerson.avatar || selectedPerson.profilePic ? (
                  <img
                    src={`http://localhost:3000${selectedPerson.avatar || selectedPerson.profilePic}`}
                    className="w-full h-full object-cover"
                    alt="Full Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-3xl font-black text-white">
                    {(selectedPerson.firstName || selectedPerson.name || 'U').charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 pt-12 overflow-y-auto custom-scrollbar flex-1">
              <div className="text-center w-full mb-6">
                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight">
                  {selectedPerson.firstName
                    ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
                    : selectedPerson.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {selectedPerson.role === 'counselor'
                      ? selectedPerson.specialization
                      : selectedPerson.department || selectedPerson.category || selectedPerson.role}
                  </p>
                  <div
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${selectedPerson.isActive ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20'}`}
                  >
                    {selectedPerson.isActive ? 'Active' : 'Blocked'}
                  </div>
                </div>
              </div>
              <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-200 grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Email Interface
                  </p>
                  <p className="text-xs font-bold text-blue-950 truncate">{selectedPerson.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Contact
                  </p>
                  <p className="text-xs font-bold text-blue-900">
                    {selectedPerson.mobile || selectedPerson.phone || 'N/A'}
                  </p>
                </div>
                {selectedPerson.availability && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
                      Availability
                    </p>
                    <p className="text-xs font-bold text-blue-900">
                      🕒 {selectedPerson.availability}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-5 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 space-y-4">
                  <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">
                    Academic Record
                  </p>
                  <div
                    className={`grid ${selectedPerson.section ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}
                  >
                    <div className="text-center p-3 bg-white rounded-2xl border border-indigo-50 shadow-sm">
                      <p className="text-[8px] text-indigo-400 font-black uppercase mb-1">
                        Semester
                      </p>
                      <p className="text-lg font-black text-indigo-900">
                        {selectedPerson.semester || 'N/A'}
                      </p>
                    </div>
                    {selectedPerson.section && (
                      <div className="text-center p-3 bg-white rounded-2xl border border-indigo-50 shadow-sm">
                        <p className="text-[8px] text-indigo-400 font-black uppercase mb-1">
                          Section
                        </p>
                        <p className="text-lg font-black text-indigo-900">
                          {selectedPerson.section}
                        </p>
                      </div>
                    )}
                    <div className="text-center p-3 bg-white rounded-2xl border border-indigo-50 shadow-sm overflow-hidden">
                      <p className="text-[8px] text-indigo-400 font-black uppercase mb-1">
                        Student ID
                      </p>
                      <p className="text-[10px] font-black text-indigo-900 truncate">
                        {selectedPerson.studentId || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPerson.sosAlert && (
                  <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500 text-white rounded-lg animate-pulse">
                        <ShieldAlert size={16} />
                      </div>
                      <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em]">
                        LATEST SOS GEOLOCATION
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-red-50 shadow-sm space-y-3">
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase mb-1">
                          Anchor Building
                        </p>
                        <p className="text-xs font-black text-blue-950 flex items-center gap-2 uppercase">
                          🏢 {selectedPerson.sosAlert.location?.building || 'Institutional Hub'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-50">
                        <p className="text-[8px] text-slate-400 font-black uppercase mb-1">
                          Broadcasted Address
                        </p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                          📍 {selectedPerson.sosAlert.location?.address || 'Generic Campus Signal'}
                        </p>
                      </div>

                      {(selectedPerson.sosAlert.location?.latitude ||
                        selectedPerson.sosAlert.location?.lat) && (
                        <div className="pt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const lat =
                                selectedPerson.sosAlert.location.latitude ||
                                selectedPerson.sosAlert.location.lat;
                              const lng =
                                selectedPerson.sosAlert.location.longitude ||
                                selectedPerson.sosAlert.location.lng;
                              window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                            }}
                            className="w-full py-3 bg-blue-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                          >
                            <MapPin size={12} /> OPEN IN GOOGLE MAPS
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedPerson.role === 'faculty' && (
                <div className="mt-4 p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-4">
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                    Professional Portfolio
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                      <p className="text-[8px] text-blue-400 font-black uppercase mb-1">
                        Employee ID
                      </p>
                      <p className="text-xs font-black text-blue-900">
                        {selectedPerson.employeeId || 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                      <p className="text-[8px] text-blue-400 font-black uppercase mb-1">
                        Designation
                      </p>
                      <p className="text-xs font-black text-blue-900 truncate">
                        {selectedPerson.designation || 'Lecturer'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                      <p className="text-[8px] text-blue-400 font-black uppercase mb-1">Dept.</p>
                      <p className="text-xs font-black text-blue-900">
                        {selectedPerson.department || 'General'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                      <p className="text-[8px] text-blue-400 font-black uppercase mb-1">Exp.</p>
                      <p className="text-xs font-black text-blue-900">
                        {selectedPerson.experience || '0'} Years
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPerson.qualification && (
                      <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                        <p className="text-[8px] text-blue-400 font-black uppercase mb-1">
                          Credentials
                        </p>
                        <p className="text-xs font-bold text-blue-900">
                          {selectedPerson.qualification}
                        </p>
                      </div>
                    )}
                    {selectedPerson.specialization && (
                      <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                        <p className="text-[8px] text-blue-400 font-black uppercase mb-1">
                          Specialization
                        </p>
                        <p className="text-xs font-bold text-blue-900">
                          {selectedPerson.specialization}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedPerson.bio && (
                    <div className="pt-2">
                      <p className="text-xs text-blue-400 uppercase font-black mb-1">
                        Professional Bio
                      </p>
                      <p className="text-sm text-slate-900 font-medium italic leading-relaxed">
                        "{selectedPerson.bio}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedPerson.role === 'counselor' && (
                <div className="mt-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-3">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                    Counselor Profile
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Experience:</span>
                    <span className="text-blue-900 font-bold">
                      {selectedPerson.experience} Years
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Qualification:</span>
                    <span className="text-blue-900 font-bold">{selectedPerson.qualification}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Mode:</span>
                    <span className="text-blue-900 font-bold">{selectedPerson.counselingMode}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Max Students / Day:</span>
                    <span className="text-blue-900 font-bold">
                      {selectedPerson.maxStudentsPerDay || 5}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 uppercase font-black mb-1">
                      About & Strategy
                    </p>
                    <p className="text-sm text-slate-900 font-medium italic leading-relaxed">
                      "{selectedPerson.bio}"
                    </p>
                  </div>
                  {selectedPerson.designation && (
                    <div className="flex justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Title:</span>
                      <span className="text-blue-900 font-bold">{selectedPerson.designation}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedPerson.role === 'staff' && (
                <div className="mt-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-3">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                    Staff Support Protocol
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Department:</span>
                    <span className="text-blue-900 font-bold">{selectedPerson.category}</span>
                  </div>
                  <div className="space-y-3">
                    {selectedPerson.designation && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Designation:</span>
                        <span className="text-blue-900 font-bold">
                          {selectedPerson.designation}
                        </span>
                      </div>
                    )}
                    {selectedPerson.qualification && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Academic:</span>
                        <span className="text-blue-900 font-bold">
                          {selectedPerson.qualification}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 uppercase font-black mb-1">
                      Role & Responsibility
                    </p>
                    <p className="text-sm text-slate-900 font-medium italic leading-relaxed">
                      "
                      {selectedPerson.bio ||
                        'Assisting new coming students and managing college-related operations.'}
                      "
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedPerson(null)}
                className="w-full mt-4 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase text-slate-400 transition-colors hover:bg-slate-200 hover:text-blue-600"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- COUNSELING REQUEST DETAIL MODAL --- */}
      {selectedCounselingRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedCounselingRequest(null)}
        >
          <div
            className="bg-white border border-slate-200 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">
                  {selectedCounselingRequest.student?.firstName}{' '}
                  {selectedCounselingRequest.student?.lastName}
                  {selectedCounselingRequest.isAnonymous && (
                    <span className="ml-3 bg-blue-100 text-blue-600 text-[9px] px-2 py-1 rounded font-black italic">
                      Identity Revealed
                    </span>
                  )}
                </h3>
                <p className="text-teal-600 text-[10px] font-black uppercase tracking-widest mt-1">
                  Request ID: {selectedCounselingRequest._id.slice(-8)}
                </p>
              </div>
              <button
                onClick={() => setSelectedCounselingRequest(null)}
                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Student ID</p>
                  <p className="text-sm font-bold text-blue-950 uppercase">
                    {selectedCounselingRequest.student?.studentId || 'N/A'}
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">
                    Department / Semester
                  </p>
                  <p className="text-sm font-bold text-blue-950 uppercase">
                    {selectedCounselingRequest.student?.department || 'N/A'} (S
                    {selectedCounselingRequest.student?.semester || '?'})
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">
                    Contact Secure
                  </p>
                  <p className="text-sm font-bold text-blue-950">
                    {selectedCounselingRequest.student?.phone || 'No Phone'}
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">
                    Email Interface
                  </p>
                  <p className="text-sm font-bold text-blue-950 truncate">
                    {selectedCounselingRequest.student?.email}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-4">
                  Patient Statement
                </h5>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
                  "{selectedCounselingRequest.description}"
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-[9px] text-blue-400 font-black uppercase mb-1">
                    Preferred Mode
                  </p>
                  <p className="text-xs font-bold text-blue-900 uppercase">
                    📡 {selectedCounselingRequest.preferredMode}
                  </p>
                </div>
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">
                    Priority Level
                  </p>
                  <p
                    className={`text-xs font-bold uppercase ${selectedCounselingRequest.priority?.toLowerCase() === 'urgent' ? 'text-red-500' : 'text-indigo-900'}`}
                  >
                    {selectedCounselingRequest.priority}
                  </p>
                </div>
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <p className="text-[9px] text-teal-400 font-black uppercase mb-1">Requested On</p>
                  <p className="text-xs font-bold text-teal-900 uppercase">
                    📅 {new Date(selectedCounselingRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedCounselingRequest.preferredDate && (
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <p className="text-[9px] text-orange-400 font-black uppercase mb-1">
                      Student's Target Date
                    </p>
                    <p className="text-xs font-bold text-orange-900 uppercase">
                      🗓️ {new Date(selectedCounselingRequest.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedCounselingRequest.preferredSlot && (
                <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                      Student's Preferred Slot
                    </p>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">
                      {selectedCounselingRequest.preferredSlot}
                    </p>
                  </div>
                  <Clock size={24} className="text-indigo-500 opacity-50" />
                </div>
              )}

              {selectedCounselingRequest.assignedSlot && (
                <div className="p-6 bg-teal-950/20 rounded-[2rem] border border-teal-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-teal-500 font-black uppercase tracking-widest mb-1">
                      Confirmed Appointment
                    </p>
                    <p className="text-sm font-bold text-teal-400 uppercase tracking-tight">
                      {new Date(selectedCounselingRequest.assignedSlot).toLocaleString()}
                    </p>
                    <p className="text-[8px] text-teal-600/60 font-black uppercase tracking-widest mt-1">
                      📍 {selectedCounselingRequest.location || 'Location Pending'}
                    </p>
                  </div>
                  <Calendar size={24} className="text-teal-400" />
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setSelectedCounselingRequest(null)}
                className="px-10 py-4 bg-blue-950 hover:bg-blue-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-950/20"
              >
                Terminate View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD COUNSELOR MODAL --- */}
      <AddCounselorModal
        isOpen={showAddCounselorModal}
        onClose={() => setShowAddCounselorModal(false)}
        onSuccess={() => fetchData('counselors')}
      />

      {/* --- ADD STAFF MODAL --- */}
      <AddStaffModal
        isOpen={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        onSuccess={() => fetchData('staff')}
      />

      {/* Acceptance Modal */}
      <AcceptanceModal
        isOpen={showAcceptanceModal}
        onClose={() => setShowAcceptanceModal(false)}
        acceptanceForm={acceptanceForm}
        setAcceptanceForm={setAcceptanceForm}
        onSubmit={handleSubmitAcceptance}
        onAutoGenerate={handleAutoGenerateMessage}
        isUpdating={loading}
      />
    </div>
  );
};

export default AdminCoreDashboard;
