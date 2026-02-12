import React, { useState, useEffect } from 'react';
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
  acceptCounselingRequest,
  rejectCounselingRequest,
  getHelpRequests,
  acceptHelpRequest,
  rejectHelpRequest,
} from '../api/admin';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import toast from 'react-hot-toast';
import PendingFacultyApprovals from './PendingFacultyApprovals';
import AddCounselorModal from './AddCounselorModal';
import AddStaffModal from './AddStaffModal';

const AdminCoreDashboard = () => {
  const navigate = useNavigate();
  const logout = useAdminAuthStore((state) => state.logout);
  const user = useAdminAuthStore((state) => state.user);

  const [activePage, setActivePage] = useState(() => {
    if (user?.role === 'counselor') return 'counseling_requests';
    if (user?.role === 'staff') return 'help_requests';
    return 'students';
  });
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddCounselorModal, setShowAddCounselorModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

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
  });

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
        setData((prev) => ({ ...prev, [page]: fetchedData }));
      }
    } catch (error) {
      console.error(`Error fetching ${page}:`, error);
      toast.error(`Failed to fetch ${page}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      [
        'students',
        'teachers',
        'counselors',
        'staff',
        'events',
        'sos',
        'counseling_requests',
        'help_requests',
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
    try {
      let response;
      if (action === 'accept') {
        response = await acceptCounselingRequest(id);
      } else {
        response = await rejectCounselingRequest(id);
      }

      if (response.success) {
        toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'}`);
        fetchData('counseling_requests');
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${action} request`);
    }
  };

  const handleHelpAction = async (id, action) => {
    try {
      let response;
      if (action === 'accept') {
        response = await acceptHelpRequest(id);
      } else {
        response = await rejectHelpRequest(id);
      }

      if (response.success) {
        toast.success(`Help request ${action === 'accept' ? 'accepted' : 'rejected'}`);
        fetchData('help_requests');
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${action} help request`);
    }
  };

  const formatSidebarLabel = (key) => {
    const labels = {
      students: 'STUDENTS',
      teachers: 'TEACHERS',
      counselors: 'COUNSELORS',
      staff: 'NON-TEACHING STAFF',
      events: 'EVENTS',
      sos: 'EMERGENCY SOS',
      pending_approvals: 'PENDING APPROVALS',
      counseling_requests: 'COUNSELING REQUESTS',
      help_requests: 'HELP REQUESTS',
    };
    return labels[key] || key.toUpperCase();
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-slate-700 text-center">
          <h1 className="text-xl font-black tracking-widest text-white italic">CAMPUS CORE</h1>
          <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-widest font-bold">
            Administrative HUB
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {[
            'students',
            'teachers',
            'counselors',
            'staff',
            'events',
            'sos',
            'pending_approvals',
            'counseling_requests',
            'help_requests',
          ]
            .filter((key) => {
              if (user?.role === 'admin') return true;
              if (user?.role === 'counselor') {
                return ['students', 'teachers', 'sos', 'counseling_requests'].includes(key);
              }
              if (user?.role === 'staff') {
                return ['students', 'teachers', 'sos', 'help_requests'].includes(key);
              }
              return false;
            })
            .map((key) => (
              <button
                key={key}
                onClick={() => setActivePage(key)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all ${activePage === key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}
              >
                {formatSidebarLabel(key)}
              </button>
            ))}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-slate-700">
          <div className="mb-3 px-2">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Logged in as</p>
            <p className="text-sm text-white font-bold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/10 text-red-500 border border-red-500/20 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-600/20 transition-all flex items-center justify-center gap-2"
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10 bg-slate-900">
        <header className="mb-10 flex justify-between items-center">
          <h2 className="text-3xl font-black text-white capitalize tracking-tighter">
            {formatSidebarLabel(activePage)}
          </h2>
          {activePage === 'counselors' && (
            <button
              onClick={() => setShowAddCounselorModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Counselor
            </button>
          )}
          {activePage === 'staff' && (
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Staff
            </button>
          )}
        </header>

        {/* --- USER LISTS (Students, Teachers, Counselors, Staff) --- */}
        {['students', 'teachers', 'counselors', 'staff'].includes(activePage) && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-700">
                <tr>
                  <th className="pb-4">Member</th>
                  <th className="pb-4">ID</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Dept</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
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
                  data[activePage].map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => setSelectedPerson(item)}
                      className={`group hover:bg-slate-700/30 transition-all cursor-pointer ${!item.isActive ? 'opacity-40' : ''}`}
                    >
                      <td className="py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-indigo-400">
                          {item.profilePic || item.avatar ? (
                            <img
                              src={item.profilePic || item.avatar}
                              className="w-full h-full object-cover"
                              alt="pfp"
                            />
                          ) : (
                            (item.firstName || item.name || 'U').charAt(0)
                          )}
                        </div>
                        <span className="font-bold text-white group-hover:text-indigo-400">
                          {item.firstName ? `${item.firstName} ${item.lastName}` : item.name}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-slate-400 text-xs">
                        {item.studentId || item.employeeId || item.id}
                      </td>
                      <td className="py-4 font-mono text-slate-400 text-xs text-ellipsis overflow-hidden">
                        {item.email}
                      </td>
                      <td className="py-4 text-slate-400">
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
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <span className="font-bold tracking-widest uppercase text-[10px] text-slate-500">
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
                  className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:bg-slate-700/60 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-indigo-400">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                        {event.category}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        event.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : event.status === 'completed'
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            : 'bg-slate-500/10 text-slate-500'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <span>📍 {event.location}</span>
                    <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                    <span>🏫 {event.department}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- SOS ALERTS VIEW --- */}
        {activePage === 'sos' && (
          <div className="grid gap-6">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <span className="font-bold tracking-widest uppercase text-[10px] text-slate-500">
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
                  className={`border-l-4 bg-slate-800/60 border-slate-700 rounded-r-2xl p-6 hover:bg-slate-700/60 transition-all cursor-pointer group ${
                    alert.priority === 'critical'
                      ? 'border-l-red-500'
                      : alert.priority === 'high'
                        ? 'border-l-orange-500'
                        : alert.priority === 'medium'
                          ? 'border-l-yellow-500'
                          : 'border-l-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-black text-white group-hover:text-indigo-400">
                          {alert.student?.firstName} {alert.student?.lastName}
                        </h3>
                        <span className="text-xs text-slate-400">({alert.student?.studentId})</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {alert.student?.email}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest">
                        {alert.type}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          alert.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : alert.status === 'in-progress'
                              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              : alert.status === 'acknowledged'
                                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                      >
                        {alert.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                          alert.priority === 'critical'
                            ? 'bg-red-600 text-white'
                            : alert.priority === 'high'
                              ? 'bg-orange-500 text-white'
                              : alert.priority === 'medium'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-500 text-white'
                        }`}
                      >
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{alert.description}</p>
                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    {alert.location?.building && <span>🏢 {alert.location.building}</span>}
                    {alert.location?.room && <span>🚪 {alert.location.room}</span>}
                    <span>⏰ {new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- COUNSELING REQUESTS VIEW --- */}
        {activePage === 'counseling_requests' && (
          <div className="grid gap-6">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <span className="font-bold tracking-widest uppercase text-[10px] text-slate-500 text-center">
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
                  className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:bg-slate-700/60 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">
                        {req.title}
                      </h3>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">
                        {req.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCounselingAction(req._id, 'accept')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleCounselingAction(req._id, 'reject')}
                            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-[9px] font-black uppercase rounded-xl border border-red-500/20 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {req.status !== 'pending' && (
                        <span
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase ${
                            req.status === 'accepted'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                    {req.isAnonymous ? '[Anonymous Content Encrypted]' : req.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] text-slate-400">
                      <span className="font-bold">
                        STUDENT:{' '}
                        {req.isAnonymous
                          ? 'ANONYMOUS'
                          : `${req.student?.firstName} ${req.student?.lastName}`}
                      </span>
                      <span>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                        req.priority === 'high'
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
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <span className="font-bold tracking-widest uppercase text-[10px] text-slate-500">
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
                  className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:bg-slate-700/60 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">
                        {req.title}
                      </h3>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
                        {req.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {req.status === 'pending' && (
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
                            Dismiss
                          </button>
                        </>
                      )}
                      {req.status !== 'pending' && (
                        <span
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase ${
                            req.status === 'assigned' || req.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4 line-clamp-3">{req.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] text-slate-400">
                      <span className="font-bold">
                        STUDENT: {req.student?.firstName} {req.student?.lastName}
                      </span>
                      <span>📍 {req.location?.current || 'N/A'}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                        req.priority === 'high'
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

        {/* --- PENDING APPROVALS VIEW --- */}
        {activePage === 'pending_approvals' && <PendingFacultyApprovals />}
      </main>

      {/* --- PERSON DETAIL POPUP --- */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-32 bg-slate-700 relative overflow-hidden">
              {selectedPerson.profilePic || selectedPerson.avatar ? (
                <img
                  src={selectedPerson.profilePic || selectedPerson.avatar}
                  className="w-full h-full object-cover"
                  alt="Full Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-6xl font-black text-white">
                  {(selectedPerson.firstName || selectedPerson.name || 'U').charAt(0)}
                </div>
              )}
            </div>
            <div className="p-8 pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {selectedPerson.firstName
                      ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
                      : selectedPerson.name}
                  </h3>
                  <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    {selectedPerson.role === 'counselor'
                      ? selectedPerson.specialization
                      : selectedPerson.department || selectedPerson.category}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${selectedPerson.isActive ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20'}`}
                >
                  {selectedPerson.isActive ? 'Active' : 'Blocked'}
                </div>
              </div>
              <div className="p-5 bg-slate-900/60 rounded-[2rem] border border-slate-700/50">
                <p className="text-[10px] text-slate-600 font-black uppercase mb-1">
                  Contact Details
                </p>
                <p className="text-sm font-bold text-white">
                  {selectedPerson.mobile || selectedPerson.phone || 'N/A'}
                </p>
                <p className="text-xs text-slate-400">{selectedPerson.email}</p>
                {selectedPerson.availability && (
                  <p className="text-[10px] text-indigo-400 mt-2 font-bold uppercase tracking-widest">
                    🕒 {selectedPerson.availability}
                  </p>
                )}
              </div>

              {selectedPerson.role === 'counselor' && (
                <div className="mt-4 p-5 bg-slate-900/60 rounded-[2rem] border border-slate-700/50 space-y-3">
                  <p className="text-[10px] text-slate-600 font-black uppercase mb-1">
                    Counselor Profile
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Experience:</span>
                    <span className="text-white font-bold">{selectedPerson.experience} Years</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Qualification:</span>
                    <span className="text-white font-bold">{selectedPerson.qualification}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Mode:</span>
                    <span className="text-white font-bold">{selectedPerson.counselingMode}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Max Students / Day:</span>
                    <span className="text-white font-bold">
                      {selectedPerson.maxStudentsPerDay || 5}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">About</p>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{selectedPerson.bio}"
                    </p>
                  </div>
                </div>
              )}

              {selectedPerson.role === 'staff' && (
                <div className="mt-4 p-5 bg-slate-900/60 rounded-[2rem] border border-slate-700/50 space-y-3">
                  <p className="text-[10px] text-slate-600 font-black uppercase mb-1">
                    Staff Support Protocol
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Department:</span>
                    <span className="text-white font-bold">{selectedPerson.category}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">
                      Role & Responsibility
                    </p>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
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
                className="w-full mt-4 py-4 bg-slate-700 rounded-2xl font-black text-[10px] uppercase text-slate-300 transition-colors hover:bg-slate-600"
              >
                Close Profile
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
    </div>
  );
};

export default AdminCoreDashboard;
