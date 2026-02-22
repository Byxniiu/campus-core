import React, { useState, useEffect } from 'react';
import {
  Heart,
  Send,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Clock,
  User,
  Phone,
  Mail,
  Waves,
  Anchor,
  Globe,
  Users,
  Calendar,
  Lock,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/useAuthStore';
import { counselingAPI } from '../../api/counseling';

const CounselingForm = ({ preSelectedCounselorId, initialAvailability, onCancel, onSuccess }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [counselors, setCounselors] = useState([]);
  const [availabilityDetail, setAvailabilityDetail] = useState(null);
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    category: 'mental-health',
    priority: 'medium',
    description: '',
    preferredMode: 'either',
    preferredCounselor: preSelectedCounselorId || location.state?.preferredCounselor || '',
    hadPreviousCounseling: false,
    preferredSlot: '',
    preferredDate: '',
    isAnonymous: false,
    title: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await counselingAPI.getCounselors();
        if (res.success) {
          setCounselors(res.data.counselors);
        }
      } catch (err) {
        console.error('Failed to fetch counselors:', err);
      }
    };
    fetchCounselors();
  }, []);

  // Fetch specific availability slots/detail when counselor changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.preferredCounselor) {
        setAvailabilityDetail(null);
        return;
      }

      setIsFetchingAvailability(true);
      try {
        const res = await counselingAPI.getCounselorAvailability(formData.preferredCounselor);
        if (res.success) {
          setAvailabilityDetail(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch counselor availability:', err);
      } finally {
        setIsFetchingAvailability(false);
      }
    };

    fetchAvailability();

    // Update mode when counselor selection changes
    if (!formData.preferredCounselor) {
      setFormData((prev) => ({ ...prev, preferredMode: 'in-person' }));
    }
  }, [formData.preferredCounselor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        title: formData.title || `${formData.category.replace('-', ' ')} request`,
      };

      const res = await counselingAPI.createRequest(submitData);
      if (res.success) {
        toast.success(res.message || 'Request sent securely');
        setIsSubmitted(true);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(error?.message || error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const selectedCounselorData = counselors.find((c) => c._id === formData.preferredCounselor);

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-[32px] text-center max-w-xl w-full font-jakarta">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-teal-100 shadow-inner">
          <CheckCircle2 size={40} className="text-blue-950" />
        </div>
        <h2 className="text-3xl font-outfit font-bold text-blue-950 mb-4 tracking-tight">
          Request Received
        </h2>
        <p className="text-blue-950/60 text-base leading-relaxed mb-8">
          Your request has been securely logged. Our professional counselors will reach out within{' '}
          <span className="text-teal-600 font-bold">24 hours</span>.
        </p>
        <button
          onClick={() => (onCancel ? onCancel() : navigate('/'))}
          className="w-full py-4 bg-blue-950 text-white font-bold rounded-2xl hover:bg-teal-600 transition shadow-lg text-xs uppercase tracking-widest"
        >
          {onCancel ? 'Close' : 'Return to Dashboard'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] border border-teal-50 relative overflow-hidden font-jakarta max-h-[90vh] overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-950"></div>

      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl border border-teal-50">
              <Heart size={18} className="text-teal-500 fill-teal-500/10" />
            </div>
            <span className="text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              Care Request Form
            </span>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-blue-950/20 hover:text-red-500 transition-colors"
            >
              <ChevronLeft className="rotate-90" size={24} />
            </button>
          )}
        </div>
        <h1 className="text-4xl font-outfit font-bold tracking-tight text-blue-950 mb-4">
          Counseling <span className="text-teal-500">Uplink</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-3 ml-1">
              Category of Concern
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                className="w-full p-4 bg-blue-50/50 border border-teal-50 rounded-xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 appearance-none cursor-pointer shadow-inner"
                onChange={handleChange}
              >
                <option value="mental-health">Mental Health</option>
                <option value="career">Career Guidance</option>
                <option value="personal">Personal Issues</option>
                <option value="academic">Academic Stress</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-300">
                <Waves size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-3 ml-1">
              Priority Level
            </label>
            <div className="flex gap-3 p-1 bg-blue-50/50 border border-teal-50 rounded-xl h-[58px] shadow-inner">
              {['low', 'medium', 'high', 'urgent'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: level }))}
                  className={`flex-1 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${
                    formData.priority === level
                      ? 'bg-white text-blue-950 shadow-md border border-teal-100'
                      : 'text-blue-300 hover:text-teal-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-3 ml-1">
              Select Specialist
            </label>
            <div className="relative">
              <select
                name="preferredCounselor"
                value={formData.preferredCounselor}
                className="w-full p-4 bg-blue-50/50 border border-teal-50 rounded-xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 appearance-none cursor-pointer shadow-inner"
                onChange={handleChange}
              >
                <option value="">Either / No Preference (In-Person Only)</option>
                {counselors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.firstName} {c.lastName} ({c.specialization})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-300">
                <Users size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-3 ml-1">
              Session Mode
            </label>
            <div className="relative">
              <select
                name="preferredMode"
                value={formData.preferredMode}
                disabled={!formData.preferredCounselor}
                className="w-full p-4 bg-blue-50/50 border border-teal-50 rounded-xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 appearance-none cursor-pointer shadow-inner disabled:opacity-50"
                onChange={handleChange}
              >
                <option value="in-person">In-Person Meeting</option>
                <option value="online"> Call</option>
                <option value="either">Either</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-3 ml-1">
              When Do You Need This Session?
            </label>
            <div
              className="relative cursor-pointer"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && input.showPicker) input.showPicker();
              }}
            >
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                className="w-full p-4 bg-blue-50/50 border border-teal-100 rounded-xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 shadow-inner h-[58px] cursor-pointer"
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-teal-500">
                <Calendar size={18} />
              </div>
            </div>
            <p className="text-[9px] text-teal-600 font-medium mt-2 ml-1">
              Select your preferred appointment date (today or future date)
            </p>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-3 ml-1">
              Time Preference / Slot
            </label>
            {isFetchingAvailability ? (
              <div className="flex items-center gap-2 mb-2 ml-1">
                <div className="w-3 h-3 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">
                  Fetching slots...
                </span>
              </div>
            ) : availabilityDetail?.availability ||
              initialAvailability ||
              selectedCounselorData?.availability ? (
              <div className="flex flex-col gap-1 mb-2 ml-1">
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                  Expert Window:{' '}
                  {availabilityDetail?.availability ||
                    initialAvailability ||
                    selectedCounselorData?.availability}
                </p>
                {availabilityDetail?.isBusy && (
                  <p className="text-[9px] text-orange-500 font-black uppercase tracking-tighter flex items-center gap-1">
                    <Clock size={10} /> Sector reaching capacity today (
                    {availabilityDetail.requestsToday}/{availabilityDetail.maxStudentsPerDay})
                  </p>
                )}
              </div>
            ) : null}
            <input
              type="text"
              name="preferredSlot"
              value={formData.preferredSlot}
              placeholder="e.g. Mon after 4 PM"
              className="w-full p-4 bg-blue-50/50 border border-teal-50 rounded-xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 shadow-inner"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-blue-50/50 border border-teal-50 rounded-xl shadow-inner transition-all hover:bg-white group relative h-[58px]">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="hadPreviousCounseling"
                    checked={formData.hadPreviousCounseling}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${formData.hadPreviousCounseling ? 'bg-teal-500' : 'bg-blue-200'}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.hadPreviousCounseling ? 'translate-x-4' : ''}`}
                  ></div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-blue-950/60 uppercase tracking-widest block">
                    Prior Consultation?
                  </span>
                  <span className="text-[8px] text-blue-950/20 font-bold uppercase tracking-widest mt-0.5 block">
                    For continuity of care
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 ml-1">
            <label className="block text-[9px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              Request Description
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border-2 rounded transition-colors ${formData.isAnonymous ? 'bg-teal-500 border-teal-500' : 'border-blue-200'}`}
              >
                {formData.isAnonymous && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span className="text-[9px] font-bold text-blue-950/30 uppercase tracking-widest group-hover:text-teal-500 transition-colors">
                Proceed Anonymously
              </span>
            </label>
          </div>
          <textarea
            name="description"
            value={formData.description}
            required
            rows="3"
            placeholder="Please share what's on your mind... all information is encrypted."
            className="w-full p-4 bg-blue-50/50 border border-teal-50 rounded-xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all font-bold text-blue-950 placeholder:text-blue-300 resize-none h-32 shadow-inner"
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-blue-950 text-white font-bold rounded-2xl shadow-xl shadow-teal-100/30 hover:bg-teal-600 transition-all flex justify-center items-center gap-4 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Anchor size={18} className="text-teal-400" />
            )}
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">
              {isLoading ? 'Processing...' : 'Finalize Request'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CounselingForm;
