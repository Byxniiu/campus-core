import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  MessageSquare,
  Calendar,
  Users,
  UserCircle,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  Waves,
  Radio,
  Anchor,
  FileText,
  BookOpen,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentAuthStore } from '../../stores/useStudentAuthStore';
import { useSocketStore } from '../../stores/useSocketStore';
import { authAPI } from '../../api/auth';
import toast from 'react-hot-toast';

// Tab Components
import SOSTab from './Dashboard/SOSTab';
import GroupsTab from './Dashboard/GroupsTab';
import EventsTab from './Dashboard/EventsTab';
import CounselorsTab from './Dashboard/CounselorsTab';
import StaffTab from './Dashboard/StaffTab';
import ProfileTab from './Dashboard/ProfileTab';
import MyRequestsTab from './Dashboard/MyRequestsTab';
import StudyMaterialsTab from './Dashboard/StudyMaterialsTab';
import TimetableTab from './Dashboard/TimetableTab';
import { useEffect } from 'react';

const StudentHomePage = () => {
  const navigate = useNavigate();
  const { user, token, logout, refreshToken } = useStudentAuthStore();
  const { connect, disconnect } = useSocketStore();
  const [activeTab, setActiveTab] = useState('SOS');

  useEffect(() => {
    if (token) {
      connect(token);
    }
  }, [token, connect]);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      disconnect();
      logout();
      toast.success('Session terminated securely.');
      navigate('/');
    }
  };

  const navItems = [
    { id: 'SOS', icon: <AlertTriangle size={20} />, tooltip: 'Emergency SOS & Alert System' },
    {
      id: 'Groups',
      icon: <MessageSquare size={20} />,
      tooltip: 'Collaborative Study Pods & Community',
    },
    { id: 'Events', icon: <Calendar size={20} />, tooltip: 'Campus Events & Milestones Sync' },
    {
      id: 'Counseling',
      icon: <Users size={20} />,
      tooltip: 'Expert Mental Health & Career Support',
    },
    { id: 'Staff', icon: <UserCircle size={20} />, tooltip: 'Non-Teaching Support Personnel Hub' },
    {
      id: 'Academic',
      icon: <BookOpen size={20} />,
      tooltip: 'Curated Study Materials & Dept. Catalog',
    },
    { id: 'Schedule', icon: <Clock size={20} />, tooltip: 'Personal Timetable & Weekly Routine' },
    {
      id: 'Requests',
      icon: <FileText size={20} />,
      tooltip: 'My Submitted Institutional Requests',
    },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'SOS':
        return <SOSTab />;
      case 'Groups':
        return <GroupsTab />;
      case 'Events':
        return <EventsTab />;
      case 'Counseling':
        return <CounselorsTab />;
      case 'Staff':
        return <StaffTab />;
      case 'My Profile':
        return <ProfileTab />;
      case 'Requests':
        return <MyRequestsTab />;
      case 'Academic':
        return <StudyMaterialsTab />;
      case 'Schedule':
        return <TimetableTab />;
      default:
        return <SOSTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F9FF] text-blue-950 font-jakarta overflow-hidden selection:bg-teal-100">
      {/* TOP NAVIGATION BAR */}
      <header className="h-20 px-6 lg:px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-teal-50 z-50 shrink-0 shadow-sm relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-20 bg-gradient-to-l from-teal-50/50 to-transparent pointer-events-none -z-10"></div>

        {/* LOGO AREA */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10 group-hover:rotate-12 transition-transform duration-300">
            <Shield className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-xl font-black tracking-tight text-blue-950 uppercase leading-none">
              Campus <span className="text-teal-500">Core</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] leading-none mt-1">
              Student Portal
            </span>
          </div>
        </div>

        {/* CENTER NAVIGATION - DESKTOP */}
        <nav className="flex overflow-x-auto items-center gap-1 p-1 bg-white border border-slate-100 shadow-sm rounded-full mx-2 md:mx-4 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.tooltip}
              className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-blue-950 rounded-full shadow-lg shadow-blue-900/20"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                {React.cloneElement(item.icon, {
                  size: 14,
                  className: activeTab === item.id ? 'text-teal-400' : 'opacity-70',
                  strokeWidth: 2.5,
                })}
              </span>
              <span className="relative z-10 hidden xl:block">{item.id}</span>
            </button>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button
            title="Pulse Notifications & System Alerts"
            className="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

          {/* User Profile */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => setActiveTab('My Profile')}
            title="Identity Matrix & Personal Config"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-blue-950 uppercase tracking-tight leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[9px] text-teal-600 font-bold uppercase tracking-[0.1em] mt-0.5">
                {user?.studentId || 'ID Pending'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-teal-500 p-[2px] shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-teal-600 font-black text-lg overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={`http://localhost:3000${user.avatar}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.firstName?.[0]
                )}
              </div>
            </div>
          </div>

          {/* Logout - Small icon button now */}
          <button
            onClick={handleLogout}
            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
            title="Secure Session Termination Protocol"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-teal-100 scrollbar-track-transparent">
        {/* Decorative Background Elements */}
        <div className="fixed top-20 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-200/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-teal-200/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col min-h-full">
          {/* Page Header */}
          <div className="mb-10 flex items-end justify-between">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 text-teal-600 mb-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Active Module
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-outfit font-black text-blue-950 tracking-tighter uppercase relative inline-block">
                {activeTab}
                <span className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-teal-400 rounded-full"></span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex flex-col items-end"
            >
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <p className="text-xs text-slate-300 font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </motion.div>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 relative z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full"
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentHomePage;
