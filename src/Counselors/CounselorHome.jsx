import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { counselingAPI } from '../api/counseling';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import AcceptanceModal from './AcceptanceModal';
import {
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Calendar,
  MessageSquare,
  Eye,
  EyeOff,
  User as UserIcon,
  Shield,
  Search,
  Filter,
  AlertCircle,
  MoreVertical,
  Link as LinkIcon,
  Globe,
  Lock,
  LogOut,
  MapPin,
} from 'lucide-react';

const CounselorHome = () => {
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useAuthStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [acceptanceForm, setAcceptanceForm] = useState({
    assignedSlot: '',
    location: '',
    meetingLink: '',
    counselorResponse: '',
  });

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await counselingAPI.getRequests();
      if (res.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      toast.error(err?.message || err || 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleAcceptClick = () => {
    console.log('[ACCEPT] Accept button clicked');
    console.log('[ACCEPT] Current showAcceptanceModal:', showAcceptanceModal);
    setShowAcceptanceModal(true);
    console.log('[ACCEPT] Setting showAcceptanceModal to true');
  };

  const handleRejectClick = async () => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;

    setIsUpdating(true);
    try {
      const res = await counselingAPI.manageRequest(selectedRequest._id, {
        status: 'declined',
        declineReason: 'Request declined by counselor',
      });
      if (res.success) {
        toast.success('Request declined');
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err?.message || err || 'Failed to decline request');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmitAcceptance = async (e) => {
    e.preventDefault();

    if (!acceptanceForm.assignedSlot) {
      toast.error('Please select an appointment date and time');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await counselingAPI.manageRequest(selectedRequest._id, {
        status: 'accepted',
        assignedSlot: acceptanceForm.assignedSlot,
        location: acceptanceForm.location,
        meetingLink: acceptanceForm.meetingLink,
        counselorResponse: acceptanceForm.counselorResponse,
      });

      if (res.success) {
        toast.success('✅ Request accepted! Student has been notified with appointment details.');
        setSelectedRequest(null);
        setShowAcceptanceModal(false);
        setAcceptanceForm({
          assignedSlot: '',
          location: '',
          meetingLink: '',
          counselorResponse: '',
        });
        fetchRequests();
      }
    } catch (err) {
      toast.error(err?.message || err || 'Failed to accept request');
    } finally {
      setIsUpdating(false);
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

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await counselingAPI.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      toast.success('Session terminated.');
      navigate('/counselor-login');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'active') return ['accepted', 'in-session'].includes(req.status);
    if (activeTab === 'completed') return ['completed', 'declined'].includes(req.status);
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500 bg-red-500/10';
      case 'high':
        return 'text-orange-500 bg-orange-500/10';
      case 'medium':
        return 'text-blue-500 bg-blue-500/10';
      case 'low':
        return 'text-slate-400 bg-slate-800';
      default:
        return 'text-slate-400 bg-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-amber-500" />;
      case 'accepted':
        return <CheckCircle2 size={16} className="text-blue-500" />;
      case 'in-session':
        return <MessageSquare size={16} className="text-indigo-500" />;
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'declined':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-black text-indigo-500 italic tracking-tighter uppercase">
            Counselor<span className="text-white">Pro</span>
          </h1>
        </div>

        <nav className="p-6 space-y-2">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-4 mb-4">
            Case Management
          </p>
          {[
            { id: 'pending', label: 'New Requests', icon: '📥' },
            { id: 'active', label: 'Active Cases', icon: '⏳' },
            { id: 'completed', label: 'History', icon: '✅' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-800'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 space-y-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white uppercase">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                Counselor
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <LogOut size={16} /> Sign Out Profile
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              {activeTab === 'pending'
                ? 'Triage Box'
                : activeTab === 'active'
                  ? 'Active Matrix'
                  : 'Record Archive'}
            </h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2 px-1">
              {filteredRequests.length} cases identified in current sector
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchRequests}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all"
            >
              <Clock size={20} className="text-indigo-400" />
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-20 text-center">
            <Shield size={64} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-2xl font-black text-slate-700 uppercase">Sector Clear</h3>
            <p className="text-slate-600 text-sm font-bold uppercase tracking-widest mt-2">
              No pending matters found in this directory
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                onClick={() => handleSelectRequest(req)}
                className="group bg-slate-900/50 border border-slate-800 p-6 rounded-[2.5rem] flex justify-between items-center hover:border-indigo-500 transition-all cursor-pointer hover:bg-slate-900 shadow-xl"
              >
                <div className="flex items-center space-x-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all ${req.isAnonymous ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white'}`}
                  >
                    {req.isAnonymous ? <EyeOff size={24} /> : <UserIcon size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-white text-xl uppercase tracking-tight">
                        {req.isAnonymous
                          ? 'Anonymous Request'
                          : `${req.student?.firstName} ${req.student?.lastName}`}
                      </h4>
                      {req.isAnonymous && (
                        <span className="bg-slate-800 text-[9px] font-black px-2 py-0.5 rounded uppercase text-slate-500 tracking-tighter">
                          Encrypted ID
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-indigo-400 font-bold uppercase tracking-tight italic">
                        {req.category.replace('-', ' ')}
                      </p>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={12} className="text-slate-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {req.preferredSlot && (
                        <div className="flex items-center gap-2 text-teal-500/80">
                          <Clock size={12} />
                          <p className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">
                            {req.preferredSlot}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden md:block">
                    <p
                      className={`text-[9px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block ${getPriorityColor(req.priority)}`}
                    >
                      {req.priority} Priority
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      {getStatusIcon(req.status)}
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        {req.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl group-hover:bg-indigo-600 transition-all text-slate-400 group-hover:text-white">
                    <MoreVertical size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* DETAIL OVERLAY */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-6">
                <div
                  className={`w-16 h-16 rounded-[2rem] flex items-center justify-center font-black ${selectedRequest.isAnonymous ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white'}`}
                >
                  {selectedRequest.isAnonymous ? <EyeOff size={28} /> : <UserIcon size={28} />}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    {selectedRequest.student?.firstName} {selectedRequest.student?.lastName}
                    {selectedRequest.isAnonymous && (
                      <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-1 rounded">
                        Identity Revealed
                      </span>
                    )}
                  </h3>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                    Request Portfolio: {selectedRequest._id.slice(-8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-4 bg-slate-800 hover:bg-red-500/20 hover:text-red-500 rounded-3xl transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COL: STUDENT INTEL */}
              <div className="space-y-8">
                {/* NEW: Student Intel Section */}
                <div>
                  <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">
                    Student Profile
                  </h5>
                  <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800 shadow-inner grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">
                        Full Name
                      </p>
                      <p className="text-sm font-bold text-white">
                        {selectedRequest.student?.firstName} {selectedRequest.student?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">
                        Student ID
                      </p>
                      <p className="text-sm font-bold text-white uppercase">
                        {selectedRequest.student?.studentId || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">
                        Academic Sector
                      </p>
                      <p className="text-sm font-bold text-white uppercase">
                        {selectedRequest.student?.department || 'N/A'} - S
                        {selectedRequest.student?.semester || '?'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">
                        Contact Secure
                      </p>
                      <p className="text-sm font-bold text-teal-400">
                        {selectedRequest.student?.phone || 'No Phone'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">
                        Email Interface
                      </p>
                      <p className="text-sm font-bold text-slate-400 underline decoration-indigo-500/30">
                        {selectedRequest.student?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">
                    Patient Statement
                  </h5>
                  <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800 shadow-inner max-h-48 overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                      "{selectedRequest.description}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2">
                      <Globe size={10} /> Mode
                    </p>
                    <p className="text-xs font-bold text-white uppercase">
                      {selectedRequest.preferredMode}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2">
                      <Calendar size={10} className="text-indigo-500" /> Requested Slot
                    </p>
                    <p className="text-xs font-bold text-indigo-400 uppercase">
                      {selectedRequest.preferredSlot || 'No Preference'}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2">
                      <Shield size={10} /> Prior Care
                    </p>
                    <p className="text-xs font-bold text-white uppercase">
                      {selectedRequest.hadPreviousCounseling ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2">
                      <Calendar size={10} className="text-teal-500" /> Preferred Date
                    </p>
                    <p className="text-xs font-bold text-teal-400 uppercase">
                      {selectedRequest.preferredDate
                        ? new Date(selectedRequest.preferredDate).toLocaleDateString()
                        : 'No Specific Date'}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2">
                      <AlertCircle size={10} /> Urgency
                    </p>
                    <p
                      className={`text-xs font-bold uppercase ${selectedRequest.priority === 'urgent' ? 'text-red-500' : 'text-indigo-400'}`}
                    >
                      {selectedRequest.priority}
                    </p>
                  </div>
                </div>

                {selectedRequest.assignedSlot && (
                  <div className="p-6 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Calendar size={12} /> Dispatched Appointment
                      </p>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {new Date(selectedRequest.assignedSlot).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                        📍 {selectedRequest.location || 'Counseling Room'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <Calendar size={24} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COL: ACTION BUTTONS */}
              {user?.role === 'counselor' && selectedRequest.status === 'pending' && (
                <div className="space-y-4">
                  <div className="p-6 bg-slate-950/30 rounded-[2rem] border border-slate-800">
                    <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">
                      Request Actions
                    </h5>

                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={handleAcceptClick}
                        disabled={isUpdating}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-wide shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        <CheckCircle2 size={20} />
                        Accept Request
                      </button>

                      <button
                        type="button"
                        onClick={handleRejectClick}
                        disabled={isUpdating}
                        className="w-full py-5 bg-red-600/20 hover:bg-red-600 border-2 border-red-600 text-red-500 hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        <XCircle size={20} />
                        Decline Request
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                    <p className="text-[9px] text-indigo-400 font-medium text-center">
                      Click <span className="font-black">Accept</span> to schedule an appointment
                      with the student
                    </p>
                  </div>
                </div>
              )}

              {/* Show appointment details if already processed */}
              {selectedRequest.status !== 'pending' && (
                <div className="space-y-4">
                  <div
                    className={`p-6 rounded-[2rem] border ${
                      selectedRequest.status === 'accepted' ||
                      selectedRequest.status === 'in-session' ||
                      selectedRequest.status === 'completed'
                        ? 'bg-emerald-600/10 border-emerald-500/20'
                        : 'bg-red-600/10 border-red-500/20'
                    }`}
                  >
                    <h5 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      {selectedRequest.status === 'declined' ? (
                        <>
                          <XCircle size={12} className="text-red-500" /> Request Declined
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-500" /> Request{' '}
                          {selectedRequest.status}
                        </>
                      )}
                    </h5>

                    {selectedRequest.assignedSlot && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-300">
                          📅 {new Date(selectedRequest.assignedSlot).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-300">
                          🕒 {new Date(selectedRequest.assignedSlot).toLocaleTimeString()}
                        </p>
                        {selectedRequest.location && (
                          <p className="text-xs text-slate-300">📍 {selectedRequest.location}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Acceptance Modal */}
      <AcceptanceModal
        isOpen={showAcceptanceModal}
        onClose={() => setShowAcceptanceModal(false)}
        acceptanceForm={acceptanceForm}
        setAcceptanceForm={setAcceptanceForm}
        onSubmit={handleSubmitAcceptance}
        onAutoGenerate={handleAutoGenerateMessage}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default CounselorHome;
