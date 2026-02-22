import React, { useState, useEffect, useCallback } from 'react';
import { helpRequestAPI } from '../../../api/helpRequest';
import {
  Loader,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  MapPin,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { counselingAPI } from '../../../api/counseling';

const MyRequestsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('Administrative');
  const [helpRequests, setHelpRequests] = useState([]);
  const [counselingRequests, setCounselingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[TAB] Fetching requests for:', activeSubTab);

      if (activeSubTab === 'Administrative') {
        const res = await helpRequestAPI.getMyRequests();
        console.log('[TAB] Help requests response:', res);
        if (res.success) {
          setHelpRequests(res.data || []);
        } else {
          toast.error('Failed to load help requests');
        }
      } else {
        const res = await counselingAPI.getMyRequests();
        console.log('[TAB] Counseling requests response:', res);
        if (res.success) {
          setCounselingRequests(res.data.requests || []);
        } else {
          toast.error('Failed to load counseling requests');
        }
      }
    } catch (error) {
      console.error('[TAB] Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [activeSubTab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getStatusStyle = (status) => {
    switch (status) {
      // Administrative statuses (capitalized)
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Resolved':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border-red-100';

      // Counseling statuses (lowercase)
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'accepted':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'in-session':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'completed':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'declined':
        return 'bg-red-50 text-red-600 border-red-100';

      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      // Administrative statuses
      case 'Pending':
        return <Clock size={12} />;
      case 'In Progress':
        return <Loader size={12} className="animate-spin" />;
      case 'Resolved':
        return <CheckCircle size={12} />;
      case 'Rejected':
        return <AlertTriangle size={12} />;

      // Counseling statuses
      case 'pending':
        return <Clock size={12} />;
      case 'accepted':
        return <CheckCircle size={12} />;
      case 'in-session':
        return <MessageCircle size={12} />;
      case 'completed':
        return <CheckCircle size={12} />;
      case 'declined':
        return <AlertTriangle size={12} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="animate-spin text-teal-500 mb-4" size={32} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Accessing records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] border border-teal-50 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {['Administrative', 'Counseling'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full">
            Total Actions:{' '}
            {activeSubTab === 'Administrative' ? helpRequests.length : counselingRequests.length}
          </span>
        </div>

        {(activeSubTab === 'Administrative' ? helpRequests : counselingRequests).length === 0 ? (
          <div className="py-20 text-center opacity-30">
            <Info size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No active protocols found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {(activeSubTab === 'Administrative' ? helpRequests : counselingRequests).map((req) => (
              <motion.div
                key={req._id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedRequest(req)}
                className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getStatusStyle(req.status)}`}
                  >
                    {getStatusIcon(req.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {req.category}
                      </span>
                      <h4 className="text-sm font-black text-blue-950 uppercase tracking-tight">
                        {req.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                          {req.staff?.avatar || req.counselor?.avatar ? (
                            <img
                              src={`http://localhost:3000${req.staff?.avatar || req.counselor?.avatar}`}
                              className="w-full h-full object-cover"
                              alt="avatar"
                            />
                          ) : (
                            <User size={10} className="text-slate-400" />
                          )}
                        </div>
                        <span className="truncate">
                          {req.staff
                            ? `${req.staff.firstName} ${req.staff.lastName}`
                            : req.counselor
                              ? `${req.counselor.firstName} ${req.counselor.lastName}`
                              : 'Awaiting Assignment'}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      {activeSubTab === 'Counseling' && req.preferredSlot && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1.5 text-teal-600">
                            <Clock size={12} /> {req.preferredSlot}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${getStatusStyle(req.status)}`}
                  >
                    {req.status}
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-950/20 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-teal-50 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 relative">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="absolute top-8 right-8 text-slate-400 hover:text-blue-950 transition-colors"
                >
                  ✕
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${getStatusStyle(selectedRequest.status)}`}
                  >
                    {selectedRequest.status}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Ref: {selectedRequest._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">
                  {selectedRequest.title}
                </h3>
                {activeSubTab === 'Counseling' && (
                  <p className="text-teal-600 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Shield size={12} /> Counseling Protocol Operational
                  </p>
                )}
              </div>

              <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
                      {selectedRequest.staff?.avatar || selectedRequest.counselor?.avatar ? (
                        <img
                          src={`http://localhost:3000${selectedRequest.staff?.avatar || selectedRequest.counselor?.avatar}`}
                          className="w-full h-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                        {activeSubTab === 'Administrative'
                          ? 'Assigned Official'
                          : 'Assigned Counselor'}
                      </p>
                      <p className="text-sm font-bold text-blue-950 uppercase tracking-tighter">
                        {activeSubTab === 'Administrative'
                          ? `${selectedRequest.staff?.firstName || 'Pending'} ${selectedRequest.staff?.lastName || ''}`
                          : `${selectedRequest.counselor?.firstName || 'Pending'} ${selectedRequest.counselor?.lastName || ''}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Priority Gradient
                    </p>
                    <p
                      className={`text-sm font-black uppercase tracking-tight ${
                        selectedRequest.priority?.toLowerCase() === 'high' ||
                        selectedRequest.priority?.toLowerCase() === 'urgent'
                          ? 'text-red-500'
                          : selectedRequest.priority?.toLowerCase() === 'medium'
                            ? 'text-amber-500'
                            : 'text-teal-500'
                      }`}
                    >
                      {selectedRequest.priority} Level
                    </p>
                  </div>
                </div>

                {(selectedRequest.preferredDate || selectedRequest.assignedSlot) && (
                  <div className="flex items-center gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <Calendar size={18} className="text-blue-500" />
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[10px] font-black text-blue-950/40 uppercase tracking-widest">
                        {selectedRequest.assignedSlot
                          ? 'Dispatched Appointment'
                          : 'Requested Target Date'}
                      </p>
                      <p className="text-xs font-black text-blue-950 uppercase tracking-tight text-right">
                        {selectedRequest.assignedSlot
                          ? new Date(selectedRequest.assignedSlot).toLocaleString()
                          : new Date(selectedRequest.preferredDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.preferredSlot && (
                  <div className="flex items-center gap-4 bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100">
                    <Clock size={18} className="text-indigo-500" />
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[10px] font-black text-indigo-500/40 uppercase tracking-widest">
                        Preferred Window / Time
                      </p>
                      <p className="text-xs font-black text-blue-950 uppercase tracking-tight">
                        {selectedRequest.preferredSlot}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.location && (
                  <div className="flex items-center gap-4 bg-teal-50/30 p-6 rounded-2xl border border-teal-100">
                    <MapPin size={18} className="text-teal-500" />
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[10px] font-black text-teal-600/40 uppercase tracking-widest">
                        Physical Venue / Room
                      </p>
                      <p className="text-xs font-black text-blue-950 uppercase tracking-tight">
                        {selectedRequest.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Detailed Specification
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {selectedRequest.description}
                  </p>
                </div>

                {selectedRequest.attachments?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Stored Attachments
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedRequest.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={`http://localhost:3000${file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-xl transition-all group"
                        >
                          <ExternalLink
                            size={14}
                            className="text-teal-500 group-hover:scale-110 transition-transform"
                          />
                          <span className="text-[12px] font-black text-blue-950 uppercase tracking-widest">
                            File_{idx + 1}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedRequest.staffMessage ||
                  selectedRequest.staffContact ||
                  selectedRequest.counselorResponse ||
                  selectedRequest.declineReason) && (
                  <div
                    className={`p-8 rounded-[2rem] border space-y-4 ${['declined', 'Rejected'].includes(selectedRequest.status) ? 'bg-red-50/50 border-red-100' : 'bg-teal-50/50 border-teal-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      {['declined', 'Rejected'].includes(selectedRequest.status) ? (
                        <AlertTriangle size={18} className="text-red-500" />
                      ) : (
                        <CheckCircle size={18} className="text-teal-500" />
                      )}
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest ${['declined', 'Rejected'].includes(selectedRequest.status) ? 'text-red-600' : 'text-teal-600'}`}
                      >
                        {['declined', 'Rejected'].includes(selectedRequest.status)
                          ? 'Decline Rationale'
                          : activeSubTab === 'Administrative'
                            ? 'Official Support Feedback'
                            : 'Professional Consultation Notes'}
                      </p>
                    </div>

                    {(selectedRequest.staffMessage ||
                      selectedRequest.counselorResponse ||
                      selectedRequest.declineReason) && (
                      <div className="space-y-4">
                        <div
                          className={`p-6 rounded-2xl border shadow-inner ${['declined', 'Rejected'].includes(selectedRequest.status) ? 'bg-white/60 border-red-100' : 'bg-white/60 border-teal-100'}`}
                        >
                          <p
                            className={`text-sm font-medium leading-relaxed whitespace-pre-line ${['declined', 'Rejected'].includes(selectedRequest.status) ? 'text-red-900' : 'text-blue-950'}`}
                          >
                            {selectedRequest.staffMessage ||
                              selectedRequest.counselorResponse ||
                              selectedRequest.declineReason}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedRequest.staffContact && (
                      <div className="flex items-center gap-4 pt-2">
                        <div className="px-5 py-2.5 bg-white rounded-xl border border-teal-100 flex items-center gap-3">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Direct Line:
                          </span>
                          <span className="text-xs font-black text-blue-950">
                            {selectedRequest.staffContact}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 text-center">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-10 py-4 bg-blue-950 hover:bg-blue-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                  Terminate View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRequestsTab;
