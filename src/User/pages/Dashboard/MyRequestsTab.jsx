import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MyRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
      toast.error('Unable to retrieve support history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Resolved':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={12} />;
      case 'In Progress':
        return <Loader size={12} className="animate-spin" />;
      case 'Resolved':
        return <CheckCircle size={12} />;
      case 'Rejected':
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
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
            <FileText size={18} className="text-teal-500" /> Administrative Requests History
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full">
            Total Actions: {requests.length}
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-20 text-center opacity-30">
            <Info size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No active protocols found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((req) => (
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
                      <span className="flex items-center gap-1.5">
                        <User size={12} /> {req.staff?.firstName} {req.staff?.lastName}
                      </span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
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
              </div>

              <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Assigned Official
                      </p>
                      <p className="text-sm font-bold text-blue-950 uppercase tracking-tighter">
                        {selectedRequest.staff?.firstName} {selectedRequest.staff?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Priority Gradient
                    </p>
                    <p
                      className={`text-sm font-black uppercase tracking-tight ${
                        selectedRequest.priority === 'High'
                          ? 'text-red-500'
                          : selectedRequest.priority === 'Medium'
                            ? 'text-amber-500'
                            : 'text-teal-500'
                      }`}
                    >
                      {selectedRequest.priority} Level
                    </p>
                  </div>
                </div>

                {selectedRequest.preferredDate && (
                  <div className="flex items-center gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <Calendar size={18} className="text-blue-500" />
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[10px] font-black text-blue-950/40 uppercase tracking-widest">
                        Preferred Resolution Cycle
                      </p>
                      <p className="text-xs font-black text-blue-950 uppercase tracking-tight">
                        {new Date(selectedRequest.preferredDate).toLocaleDateString()}
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
                          <span className="text-[9px] font-black text-blue-950 uppercase tracking-widest">
                            File_{idx + 1}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedRequest.staffMessage || selectedRequest.staffContact) && (
                  <div className="p-8 bg-teal-50/50 rounded-[2rem] border border-teal-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-teal-500" />
                      <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                        Official Support Feedback
                      </p>
                    </div>

                    {selectedRequest.staffMessage && (
                      <p className="text-blue-950 text-sm font-bold leading-relaxed italic">
                        "{selectedRequest.staffMessage}"
                      </p>
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
