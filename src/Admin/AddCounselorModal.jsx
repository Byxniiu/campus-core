import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createCounselor } from '../api/admin';

const AddCounselorModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialization: 'Academic Issues',
    phone: '',
    experience: '',
    qualification: '',
    bio: '',
    maxStudentsPerDay: 5,
    counselingMode: 'Both',
    availability: '',
    isActive: true,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createCounselor(formData);
      if (response.success) {
        toast.success('Counselor created successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating counselor:', error);
      toast.error(error.message || 'Failed to create counselor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-[2.5rem] shadow-2xl my-8">
        <div className="p-8 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              Add New Counselor
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Personnel Registration Terminal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400"
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

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                First Name
              </label>
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Last Name
              </label>
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="counselor@campuscore.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Security Password
              </label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="Academic Issues">Academic Issues</option>
                <option value="Career Guidance">Career Guidance</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Placement Support">Placement Support</option>
                <option value="Personal Issues">Personal Issues</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Phone Number
              </label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Years of Experience
              </label>
              <input
                required
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Qualification
              </label>
              <input
                required
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Ph.D. in Psychology"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Max Students / Day
              </label>
              <input
                required
                type="number"
                name="maxStudentsPerDay"
                value={formData.maxStudentsPerDay}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Counseling Mode
              </label>
              <select
                name="counselingMode"
                value={formData.counselingMode}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="In-Person">In-Person</option>
                <option value="Online">Online</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              Availability
            </label>
            <input
              required
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Mon-Fri, 9:00 AM - 5:00 PM"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              Short Bio
            </label>
            <textarea
              required
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="A brief description of their role and approach..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 bg-slate-900 border border-slate-700 rounded-lg text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="isActive"
              className="text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              Active Account Status
            </label>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Authorize Counselor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCounselorModal;
