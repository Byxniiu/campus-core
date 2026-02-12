import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createStaff } from '../api/admin';

const AddStaffModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    category: 'Office',
    phone: '',
    bio: '',
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
      const response = await createStaff(formData);
      if (response.success) {
        toast.success('Staff member created successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error(error.message || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto font-jakarta">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-[2.5rem] shadow-2xl my-8">
        <div className="p-8 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              Add Non-Teaching Staff
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Operational Support Node
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
                placeholder="Staff Member"
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
                placeholder="Name"
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
                placeholder="staff@campuscore.com"
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
                Department Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="Office">Office Administration</option>
                <option value="Help Desk">Student Help Desk</option>
                <option value="Security">Campus Security</option>
                <option value="Maintenance">Maintenance & Facility</option>
                <option value="Transport">Transport Management</option>
                <option value="Other">Miscellaneous Support</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Contact Phone
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

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              Availability / Office Hours
            </label>
            <input
              required
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Mon-Fri, 9:00 AM - 6:00 PM"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              Role Description / Support Details
            </label>
            <textarea
              required
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Describe how this staff member assists students (e.g., handles admission queries, help incoming freshmen...)"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              id="isActiveStaff"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 bg-slate-900 border border-slate-700 rounded-lg text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="isActiveStaff"
              className="text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              Active Staff Member
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
              {loading ? 'Processing...' : 'Register Staff Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
