import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import {
  GraduationCap,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Lock,
  ChevronRight,
} from 'lucide-react';

const FacultyRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    section: '',
    designation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Required fields missing');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;

      const response = await authAPI.register({
        ...registrationData,
        role: 'faculty',
      });

      if (response.success) {
        toast.success('Registration sequence initiated');
        navigate('/faculty-otp-verification', {
          state: {
            userId: response.data.userId,
            email: formData.email,
            employeeId: response.data.employeeId,
          },
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-600/10 transform -rotate-6">
            <GraduationCap size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black tracking-tighter text-slate-900 italic uppercase">
          Faculty <span className="text-emerald-600">Recruitment</span>
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
          Join the Campus Core Academic Network
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 py-10 px-6 shadow-2xl rounded-[2.5rem] sm:px-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-emerald-600 rounded-b-full"></div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <InputField
                icon={<UserPlus size={18} />}
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
              {/* Last Name */}
              <InputField
                icon={<UserPlus size={18} />}
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>

            {/* Email */}
            <InputField
              icon={<Mail size={18} />}
              label="Academic Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@university.edu"
              required
            />

            {/* Phone */}
            <InputField
              icon={<Phone size={18} />}
              label="Contact Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Department */}
              <SelectField
                icon={<Building2 size={18} />}
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                options={[
                  'Computer Science',
                  'BCA',
                  'BBA',
                  'Commerce',
                  'Electronics',
                  'Mechanical',
                  'Civil',
                  'Electrical',
                  'Mathematics',
                  'Physics',
                  'Chemistry',
                  'English',
                ]}
              />
              {/* Designation */}
              <SelectField
                icon={<Briefcase size={18} />}
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                options={[
                  'Professor',
                  'Associate Professor',
                  'Assistant Professor',
                  'Lecturer',
                  'Senior Lecturer',
                  'Teaching Assistant',
                ]}
              />
            </div>

            {/* Section */}
            <InputField
              icon={<Building2 size={18} />}
              label="Assigned Section (Optional)"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Ex: A, B, C"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Password */}
              <InputField
                icon={<Lock size={18} />}
                label="Access Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {/* Confirm Password */}
              <InputField
                icon={<Lock size={18} />}
                label="Confirm Access"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[1.25rem] shadow-xl text-sm font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Submit Application'}
                {!isLoading && <ChevronRight size={18} className="ml-2" />}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
              Already credentialed?{' '}
              <Link
                to="/faculty-login"
                className="text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Access Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
      {label} {required && <span className="text-emerald-600">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
      />
    </div>
  </div>
);

const SelectField = ({ icon, label, name, value, onChange, options, required }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
      {label} {required && <span className="text-emerald-600">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
        {icon}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
      >
        <option value="" className="bg-white">
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FacultyRegister;
