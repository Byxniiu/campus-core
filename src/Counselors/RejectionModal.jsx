import React, { useState } from 'react';
import { XCircle, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RejectionModal = ({ isOpen, onClose, onSubmit, isUpdating }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white border border-slate-200 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
          <div>
            <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter flex items-center gap-3">
              <XCircle size={24} /> Decline Request
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Provide a reason for the student
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-red-600"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <AlertCircle size={12} className="text-red-500" /> Reason for Declining *
            </label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-bold resize-none h-40"
              placeholder="e.g. Schedule fully booked, request details unclear, or redirected to another department..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || !reason.trim()}
              className="flex-[2] px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isUpdating ? (
                'Processing...'
              ) : (
                <>
                  <Send size={14} /> Confirm Decline
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RejectionModal;
