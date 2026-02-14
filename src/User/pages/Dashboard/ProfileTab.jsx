import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Hash,
  GraduationCap,
  Layers,
  Award,
  Camera,
  Save,
  Loader,
  CircleCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudentAuthStore } from '../../../stores/useStudentAuthStore';
import { userAPI } from '../../../api/user';
import toast from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
const InfoCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-teal-50 shadow-sm flex items-center gap-5 group hover:border-teal-200 transition-all duration-300">
      <div className="p-4 rounded-2xl bg-teal-50 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500 shadow-inner">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p className="text-lg font-bold text-blue-950 tracking-tight">{value || 'Not Set'}</p>
      </div>
    </div>
  );
};

const ProfileTab = () => {
  const { user, setUser } = useStudentAuthStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    department: '',
    semester: '',
    section: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      if (res.success) {
        setUser(res.data.user);
        const u = res.data.user;
        setFormData({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          bio: u.bio || '',
          department: u.department || '',
          semester: u.semester || '',
          section: u.section || '',
        });
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
        setUser(res.data.user);
        toast.success('Profile synchronized successfully!');
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.toString());
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: AVATAR & QUICK STATS */}
        <div className="lg:col-span-1 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[48px] border border-teal-50 shadow-xl shadow-teal-100/20 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-950 to-blue-900 -z-0"></div>

            <div className="relative mt-8 group">
              <div className="w-40 h-40 rounded-[48px] bg-white p-2 shadow-2xl relative z-10">
                <div className="w-full h-full rounded-[40px] bg-slate-50 overflow-hidden flex items-center justify-center border-2 border-teal-50">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user?.avatar ? (
                    <img
                      src={`http://localhost:3000${user.avatar}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-teal-200" />
                  )}
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-teal-400 text-blue-950 p-3 rounded-2xl border-4 border-white shadow-xl z-20 hover:scale-110 transition-transform active:scale-95"
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
              <h2 className="text-3xl font-outfit font-black text-blue-950 tracking-tighter uppercase leading-none">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-100">
                  {user?.role}
                </span>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                  ID: {user?.studentId}
                </span>
              </div>
            </div>

            <div className="w-full mt-10 pt-10 border-t border-teal-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">
                Verification Hash
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-950/40 truncate max-w-[150px]">
                  {user?._id}
                </span>
                <CircleCheck size={16} className="text-teal-500" />
              </div>
            </div>
          </motion.div>

          {/* ACADEMIC PROGRESS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-950 p-10 rounded-[48px] text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400 mb-8">
              Performance Matrix
            </h4>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-outfit font-black tracking-tighter leading-none mb-1">
                  {user?.cgpa || '0.00'}
                </p>
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest">
                  Cumulative GPA
                </p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-teal-400 border border-white/5">
                <Award size={24} />
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                  style={{ width: `${(user?.cgpa || 0) * 10}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-blue-200/30">
                <span>Progress Scale</span>
                <span>10.00 Max</span>
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
            className="bg-white p-10 md:p-14 rounded-[48px] border border-teal-50 shadow-xl shadow-teal-100/20"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-outfit font-black text-blue-950 uppercase tracking-tight">
                  Profile Configuration
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 italic">
                  Institutional identification & contact vectors
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={updating}
                className="flex items-center gap-3 bg-blue-950 text-white px-8 py-4 rounded-[20px] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {updating ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {updating ? 'Synchronizing...' : 'Save Changes'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  First Designation
                </label>
                <div className="relative">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Last Designation
                </label>
                <div className="relative">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Biological Vector / Personal Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm resize-none"
                  placeholder="A short description of your academic interests and protocol status..."
                ></textarea>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Comms Relay (Phone)
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Institutional Dept.
                </label>
                <div className="relative">
                  <BookOpen
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm"
                    placeholder="Computer Science"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Academic Semester
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm"
                    placeholder="6"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Operational Section
                </label>
                <div className="relative">
                  <Layers
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/5 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 text-sm"
                    placeholder="A"
                  />
                </div>
              </div>
            </div>
          </motion.form>

          {/* STATIC INFO GRID (READ ONLY) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InfoCard icon={Mail} label="Core Relay Email" value={user?.email} />
            <InfoCard icon={GraduationCap} label="Institutional ID" value={user?.studentId} />
            <InfoCard icon={Hash} label="System Identifier" value={user?._id} />
            <InfoCard
              icon={Award}
              label="Merit Index"
              value={user?.cgpa ? `${user.cgpa} OGPA` : 'Pending'}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
