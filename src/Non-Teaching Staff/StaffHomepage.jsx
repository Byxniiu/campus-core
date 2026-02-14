import React, { useState, useEffect } from 'react';
import { helpRequestAPI } from '../api/helpRequest';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import {
  Loader,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  ExternalLink,
  Check,
} from 'lucide-react';

const StaffHomepage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [staffMessage, setStaffMessage] = useState('');
  const [staffContact, setStaffContact] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await helpRequestAPI.getMyRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to synchronize request protocol');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdating(true);
      await helpRequestAPI.updateStatus(id, status, {
        staffMessage,
        staffContact,
      });
      toast.success(`Protocol updated to ${status}`);
      setSelectedRequest(null);
      setStaffMessage('');
      setStaffContact('');
      fetchRequests();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update protocol status');
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-amber-500';
      case 'Low':
        return 'text-teal-500';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={14} className="text-amber-500" />;
      case 'In Progress':
        return <Loader size={14} className="text-blue-500 animate-spin" />;
      case 'Resolved':
        return <CheckCircle size={14} className="text-teal-500" />;
      case 'Rejected':
        return <AlertTriangle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans relative selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center border border-blue-900 shadow-inner overflow-hidden">
              {user?.avatar ? (
                <img
                  src={`http://localhost:3000${user.avatar}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-amber-500" size={32} />
              )}
            </div>
            <div>
              <h1 className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase mb-2">
                Staff Operations Control
              </h1>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                Terminal Node:{' '}
                <span className="text-amber-500">
                  {user?.firstName} {user?.lastName}
                </span>
              </h2>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
              Operational Level: {user?.category || 'General Staff'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* HELP REQUESTS FEED */}
          <section className="lg:col-span-8 bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                <FileText size={16} className="text-amber-500" /> Support Protocol Queue
              </h3>
              <span className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                {requests.length} Pending Actions
              </span>
            </div>

            <div className="overflow-y-auto max-h-[700px] divide-y divide-slate-800">
              {requests.length === 0 ? (
                <div className="p-20 text-center opacity-20">
                  <FileText size={64} className="mx-auto mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">
                    Queue Empty / All Clear
                  </p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req._id}
                    onClick={() => setSelectedRequest(req)}
                    className="p-8 hover:bg-slate-800/40 cursor-pointer transition-all group flex justify-between items-center border-l-4 border-transparent hover:border-amber-500"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span
                          className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md bg-slate-950 border border-slate-800 ${getPriorityColor(req.priority)}`}
                        >
                          {req.priority}
                        </span>
                        <h4 className="font-black text-white group-hover:text-amber-500 transition-colors uppercase text-sm tracking-tight">
                          {req.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-6 ml-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                          <User size={12} className="text-slate-600" /> {req.student?.firstName}{' '}
                          {req.student?.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
                          <Calendar size={12} className="text-slate-600" />{' '}
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                        {getStatusIcon(req.status)}
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          {req.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* DASHBOARD STATS */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-8 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-500" /> Critical Vectors
              </h3>
              <div className="space-y-6">
                <div className="p-6 rounded-[2rem] bg-slate-950 border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Clock size={40} className="text-amber-500" />
                  </div>
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    {requests.filter((r) => r.priority === 'High').length}
                  </p>
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] mt-2">
                    High Priority Alerts
                  </p>
                </div>
                <div className="p-6 rounded-[2rem] bg-slate-950 border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <CheckCircle size={40} className="text-teal-500" />
                  </div>
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    {requests.filter((r) => r.status === 'Resolved').length}
                  </p>
                  <p className="text-[9px] font-black text-teal-500 uppercase tracking-[0.2em] mt-2">
                    Protocols Resolved
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.1)] overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-800 relative bg-slate-800/20">
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                disabled={updating}
              >
                ✕
              </button>
              <div className="flex items-center gap-4 mb-3 justify-center">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 ${getPriorityColor(selectedRequest.priority)}`}
                >
                  Priority: {selectedRequest.priority}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-500">
                  Category: {selectedRequest.category}
                </span>
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter text-center">
                {selectedRequest.title}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-12 overflow-y-auto max-h-[60vh] space-y-10">
              <div className="grid grid-cols-2 gap-8 px-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <User size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Student Core
                    </p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">
                      {selectedRequest.student?.firstName} {selectedRequest.student?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedRequest.student?.studentId}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-end text-right">
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Logged Epoch
                    </p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Calendar size={20} className="text-slate-500" />
                  </div>
                </div>
              </div>

              {selectedRequest.preferredDate && (
                <div className="px-4">
                  <div className="bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock size={24} className="text-amber-500" />
                      <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          Target Resolution Deadline
                        </p>
                        <p className="text-xl font-black text-white uppercase tracking-tighter italic">
                          {new Date(selectedRequest.preferredDate).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        Priority Index
                      </p>
                      <p
                        className={`text-sm font-black uppercase tracking-tight ${getPriorityColor(selectedRequest.priority)}`}
                      >
                        {selectedRequest.priority}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 shadow-inner">
                <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-4 italic">
                  Protocol Specification
                </p>
                <p className="text-slate-300 text-base leading-relaxed font-medium">
                  {selectedRequest.description}
                </p>
              </div>

              {selectedRequest.attachments?.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">
                    Stored Attachments ({selectedRequest.attachments.length})
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {selectedRequest.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={`http://localhost:3000${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-6 py-3 rounded-2xl transition-all group"
                      >
                        <ExternalLink
                          size={14}
                          className="text-amber-500 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          Resource {idx + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 bg-teal-500/5 rounded-2xl border border-teal-500/20 flex items-center gap-4">
                <CheckCircle size={18} className="text-teal-500" />
                <p className="text-[10px] font-bold text-teal-500/80 uppercase tracking-widest">
                  Identity Verification Consent: Confirmed by Student Core
                </p>
              </div>

              {/* Staff Response Form */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <p className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-4 italic">
                  Response Control
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 XXXXX XXXXX"
                      value={staffContact}
                      onChange={(e) => setStaffContact(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-amber-500 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">
                      Response Message
                    </label>
                    <textarea
                      placeholder="Enter update message for student..."
                      value={staffMessage}
                      onChange={(e) => setStaffMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-amber-500 transition-all text-sm resize-none h-14"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Actions */}
            <div className="p-10 bg-slate-950/50 border-t border-slate-800 flex gap-4">
              {['In Progress', 'Resolved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(selectedRequest._id, status)}
                  disabled={updating || selectedRequest.status === status}
                  className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                    selectedRequest.status === status
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : status === 'Resolved'
                        ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/10'
                        : status === 'Rejected'
                          ? 'bg-red-950/50 hover:bg-red-900/50 text-red-500 border border-red-500/20'
                          : 'bg-white hover:bg-slate-200 text-slate-950 shadow-lg'
                  }`}
                >
                  {updating && status !== selectedRequest.status ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHomepage;
