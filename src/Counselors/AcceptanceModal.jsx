import React from 'react';
import { Calendar, MapPin, LinkIcon, MessageSquare, Send } from 'lucide-react';

const AcceptanceModal = ({
  isOpen,
  onClose,
  acceptanceForm,
  setAcceptanceForm,
  onSubmit,
  onAutoGenerate,
  isUpdating,
}) => {
  console.log('[ACCEPTANCE MODAL] Rendered. isOpen:', isOpen);

  if (!isOpen) {
    console.log('[ACCEPTANCE MODAL] Not open, returning null');
    return null;
  }

  console.log('[ACCEPTANCE MODAL] Modal is open, rendering...');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-[2.5rem] shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">
              Accept Request
            </h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
              Schedule Appointment & Send Confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          {/* Appointment Date/Time */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" /> Appointment Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
              value={acceptanceForm.assignedSlot}
              onChange={(e) =>
                setAcceptanceForm({ ...acceptanceForm, assignedSlot: e.target.value })
              }
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <MapPin size={12} className="text-blue-500" /> Appointment Location
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
              placeholder="Counseling Room – Block B, Room 203"
              value={acceptanceForm.location}
              onChange={(e) => setAcceptanceForm({ ...acceptanceForm, location: e.target.value })}
            />
          </div>

          {/* Meeting Link (Optional) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <LinkIcon size={12} className="text-blue-500" /> Virtual Meeting Link (Optional)
            </label>
            <input
              type="url"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
              placeholder="https://zoom.us/meet/..."
              value={acceptanceForm.meetingLink}
              onChange={(e) =>
                setAcceptanceForm({ ...acceptanceForm, meetingLink: e.target.value })
              }
            />
          </div>

          {/* Auto-Generate Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onAutoGenerate}
              className="px-4 py-2 text-[9px] font-black text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all uppercase tracking-widest"
            >
              ✨ Auto-Generate Message
            </button>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <MessageSquare size={12} className="text-blue-500" /> Message to Student
            </label>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold resize-none whitespace-pre-wrap h-56"
              placeholder="Your message to the student with appointment details..."
              value={acceptanceForm.counselorResponse}
              onChange={(e) =>
                setAcceptanceForm({ ...acceptanceForm, counselorResponse: e.target.value })
              }
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || !acceptanceForm.assignedSlot}
              className="flex-[2] px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isUpdating ? (
                'Processing...'
              ) : (
                <>
                  <Send size={14} /> Send Confirmation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptanceModal;
