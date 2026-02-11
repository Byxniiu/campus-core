import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import toast from 'react-hot-toast';
import {
  UserPlus,
  Mail,
  Phone,
  Lock,
  Book,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Waves,
  Anchor,
  Activity,
} from 'lucide-react';

const StudentSignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: '',
    semester: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'student',
        department: formData.department,
        semester: parseInt(formData.semester),
      };

      const response = await authAPI.register(registrationData);

      if (response.success) {
        const { studentId } = response.data;
        toast.success(`Registration successful! ID: ${studentId}`, { duration: 6000 });

        navigate('/otp-verification', {
          state: {
            email: formData.email,
            studentId: studentId,
            devOTP: response.data.devOTP,
          },
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF] p-4 md:p-8 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-100/20 rounded-full blur-[150px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -z-0"></div>

      <div className="flex w-full max-w-6xl bg-white shadow-2xl rounded-[40px] overflow-hidden min-h-[750px] border border-teal-50 relative z-10">
        {/* Left Side: Illustration Area */}
        <div className="hidden lg:flex lg:w-5/12 bg-blue-950 items-center justify-center p-16 relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl -z-0"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-3 bg-blue-900/40 px-6 py-3 rounded-full border border-teal-400/20 mb-12 shadow-inner backdrop-blur-sm">
              <ShieldCheck size={20} className="text-teal-400" />
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">
                Institutional Matrix
              </span>
            </div>
            <h3 className="text-6xl font-outfit font-bold tracking-tight text-white leading-[1.1] mb-8">
              Initialize <span className="text-teal-500">Identity</span>
            </h3>
            <p className="text-blue-100/60 text-lg font-medium mb-12 max-w-sm mx-auto">
              Synchronize with the campus network and claim your student profile today.
            </p>

            <div className="grid grid-cols-2 gap-6 text-left">
              {[
                { label: 'Active Learners', value: '12k+', icon: <Anchor size={14} /> },
                { label: 'Daily Syncs', value: '45k', icon: <Waves size={14} /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 p-6 rounded-3xl border border-teal-400/10 shadow-inner group hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest leading-none">
                      {stat.label}
                    </p>
                    <span className="text-blue-200/40">{stat.icon}</span>
                  </div>
                  <p className="text-2xl font-outfit font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="w-full lg:w-7/12 p-8 md:p-16 flex flex-col justify-between relative overflow-y-auto max-h-[90vh] lg:max-h-none font-jakarta">
          <header className="mb-12 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
                <GraduationCap size={24} className="text-teal-400" />
              </div>
              <span className="font-outfit text-3xl font-bold tracking-tight text-blue-950">
                Campus <span className="text-teal-500">Core</span>
              </span>
            </div>
            <Link
              to="/"
              className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest hover:text-teal-600 transition-colors flex items-center gap-2 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />{' '}
              Back to Portal
            </Link>
          </header>

          <div className="mb-12">
            <h2 className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-tight">
              Student <span className="text-teal-500">Registration</span>
            </h2>
            <p className="text-blue-950/45 text-[11px] font-bold mt-4 uppercase tracking-[0.2em]">
              Deployment Protocol v4.2 // Secure Entry
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Given Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  required
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Surname Identity
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  required
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Academic Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@campus.edu"
                  required
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Primary Liaison (Phone)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 0000 000 000"
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Knowledge Sector (Dept)
                </label>
                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. BCA"
                  required
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Academic Phase (Sem)
                </label>
                <select
                  id="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-950 appearance-none shadow-inner cursor-pointer"
                >
                  <option value="">Select Phase</option>
                  {[1, 2, 3, 4, 5, 6].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Security Passkey
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] ml-1">
                  Verify Passkey
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-5 pl-7 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-semibold text-blue-900 shadow-inner placeholder:text-blue-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-950 text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-teal-100/50 hover:bg-teal-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
            >
              {isLoading ? 'Processing Protocols...' : 'Initialize Identity Node'}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform text-teal-400"
              />
            </button>
          </form>

          <footer className="mt-14 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-teal-50 pt-10">
            <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest flex items-center gap-3">
              Existing Member?
              <Link
                to="/student-signin"
                className="text-blue-950 hover:text-teal-600 transition-colors bg-teal-50 px-5 py-2.5 rounded-full"
              >
                Sign In Terminal
              </Link>
            </p>
            <div className="flex items-center gap-6 grayscale opacity-20">
              <Waves size={20} />
              <Anchor size={20} />
              <Activity size={20} />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUpPage;
