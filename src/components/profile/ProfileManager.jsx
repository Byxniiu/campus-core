import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader,
  CircleCheck,
  Shield,
  Briefcase,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { userAPI } from '../../api/user';

const ProfileManager = ({ user, onUpdate, type = 'student' }) => {
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    department: user?.department || '',
    semester: user?.semester || '',
    section: user?.section || '',
    designation: user?.designation || '',
    qualification: user?.qualification || '',
    experience: user?.experience || '',
    specialization: user?.specialization || '',
    category: user?.category || '',
    counselingMode: user?.counselingMode || 'Both',
    availability: user?.availability || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Max 5MB.');
        return;
      }
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await userAPI.updateProfile(formData);
      if (res.success) {
        onUpdate(res.data.user);
        toast.success('Identity profile synchronized!');
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Synchronization failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: AVATAR & QUICK STATS */}
        <div className="lg:col-span-1 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div
              className={`absolute top-0 left-0 w-full h-24 ${type === 'student' ? 'bg-gradient-to-br from-blue-950 to-blue-800' : 'bg-gradient-to-br from-slate-900 to-slate-800'} -z-0`}
            ></div>

            <div className="relative mt-8 group">
              <div className="w-40 h-40 rounded-[48px] bg-white p-2 shadow-2xl relative z-10 transition-transform group-hover:scale-[1.02]">
                <div className="w-full h-full rounded-[40px] bg-slate-50 overflow-hidden flex items-center justify-center border-2 border-slate-100 shadow-inner">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user?.avatar ? (
                    <img
                      src={`http://localhost:3000${user.avatar}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-slate-200" />
                  )}
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-teal-500 text-white p-3 rounded-2xl border-4 border-white shadow-xl z-20 hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
              >
                <Camera size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-100">
                  {user?.role}
                </span>
                <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 italic">
                  ID: {user?.studentId || user?.employeeId || 'STAFF_ID'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* QUICK INFO CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${type === 'student' ? 'bg-blue-950' : 'bg-slate-900'} p-10 rounded-[48px] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden`}
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-8 italic">
              Authentication Ledger
            </h4>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-teal-400 border border-white/5 shadow-inner">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-xs font-bold truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-teal-400 border border-white/5 shadow-inner">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </p>
                  <p className="text-xs font-bold flex items-center gap-2">
                    {user?.isVerified ? 'VERIFIED' : 'PENDING'}
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: DETAILS FORM */}
        <div className="lg:col-span-2 space-y-10">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-14 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/20"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                  Profile <span className="text-teal-600">Configuration</span>
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">
                  Synchronizing identity vectors across institutional grid
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={updating}
                className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20 hover:bg-teal-600 transition-all disabled:opacity-50"
              >
                {updating ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {updating ? 'SYNCING...' : 'UPDATE'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  First name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                    placeholder="First Name"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Last name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {type !== 'student' && (
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    Biological Brief / Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm resize-none shadow-inner italic"
                    placeholder="Tell us about your professional or academic trajectory..."
                  ></textarea>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Secure Comms (Phone)
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {type !== 'counselor' && type !== 'staff' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    Sector / Department
                  </label>
                  <div className="relative group">
                    <Briefcase
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                      placeholder="Department Name"
                    />
                  </div>
                </div>
              )}

              {/* ROLE SPECIFIC FIELDS */}
              {type === 'student' ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Academic Phase (Semester)
                    </label>
                    <div className="relative group">
                      <GraduationCap
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                        size={18}
                      />
                      <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                        placeholder="Semester"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Operational Group (Section)
                    </label>
                    <div className="relative group">
                      <BookOpen
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                        placeholder="Section"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      {type === 'staff' ? 'Job Role / Category' : 'Title (Designation)'}
                    </label>
                    <div className="relative group">
                      <GraduationCap
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                        size={18}
                      />
                      {type === 'staff' ? (
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner appearance-none"
                        >
                          <option value="">Select Category</option>
                          <option value="Office">Institutional Office</option>
                          <option value="Security">Security Matrix</option>
                          <option value="Maintenance">Maintenance Core</option>
                          <option value="Help Desk">Help Desk / Support</option>
                          <option value="Transport">Transport Hub</option>
                          <option value="Other">Other Operational Unit</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                          placeholder="Ex: Senior Professor / Lead Counselor"
                        />
                      )}
                    </div>
                  </div>
                  {type !== 'counselor' && type !== 'staff' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Academic Credentials
                      </label>
                      <div className="relative group">
                        <Shield
                          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
                          size={18}
                        />
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                          placeholder="Ex: Ph.D in Computer Science"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      Service Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                      placeholder="Ex: 5"
                    />
                  </div>
                  {type !== 'counselor' && type !== 'staff' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                        Area of Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                        placeholder="Ex: Machine Learning / Network Security"
                      />
                    </div>
                  )}

                  {type === 'counselor' && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                          Counseling Mode
                        </label>
                        <select
                          name="counselingMode"
                          value={formData.counselingMode}
                          onChange={handleChange}
                          className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner appearance-none"
                        >
                          <option value="Both">Both (Hybrid)</option>
                          <option value="In-Person">In-Person Only</option>
                          <option value="Online">Online / Remote</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                          Temporal Availability
                        </label>
                        <input
                          type="text"
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 text-sm shadow-inner"
                          placeholder="Ex: Mon-Fri, 9AM-5PM"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
