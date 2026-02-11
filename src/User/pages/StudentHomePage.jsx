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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';
import { authAPI } from '../../api/auth';
import toast from 'react-hot-toast';

// Tab Components
import SOSTab from './Dashboard/SOSTab';
import GroupsTab from './Dashboard/GroupsTab';
import EventsTab from './Dashboard/EventsTab';
import CounselorsTab from './Dashboard/CounselorsTab';
import StaffTab from './Dashboard/StaffTab';

const StudentHomePage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Safety SOS');

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      toast.success('Session terminated securely.');
      navigate('/');
    }
  };

  const navItems = [
    { id: 'Safety SOS', icon: <AlertTriangle size={20} /> },
    { id: 'Chat Groups', icon: <MessageSquare size={20} /> },
    { id: 'Upcoming Events', icon: <Calendar size={20} /> },
    { id: 'Counseling', icon: <Users size={20} /> },
    { id: 'Campus Staff', icon: <UserCircle size={20} /> },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Safety SOS':
        return <SOSTab />;
      case 'Chat Groups':
        return <GroupsTab />;
      case 'Upcoming Events':
        return <EventsTab />;
      case 'Counseling':
        return <CounselorsTab />;
      case 'Campus Staff':
        return <StaffTab />;
      default:
        return <SOSTab />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F9FF] text-blue-950 font-jakarta overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-80 bg-blue-950 flex flex-col shadow-[12px_0_40px_rgba(30,58,138,0.2)] z-20 relative"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div
          className="p-10 border-b border-white/5 flex items-center gap-4 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <motion.div
            whileHover={{ rotate: 12 }}
            className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg group-hover:bg-teal-400/10 transition-colors"
          >
            <Shield className="w-6 h-6 text-teal-400" />
          </motion.div>
          <span className="font-outfit text-2xl font-bold tracking-tight text-white uppercase">
            Campus <span className="text-teal-400">Core</span>
          </span>
        </div>

        <div className="p-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 p-6 rounded-[32px] flex items-center gap-4 border border-white/5 mb-8 shadow-inner"
          >
            <div className="w-14 h-14 bg-teal-400 rounded-2xl flex items-center justify-center text-blue-950 font-bold text-xl shadow-[0_8px_20px_rgba(45,212,191,0.3)]">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 truncate">
              <p className="text-base font-bold text-white tracking-tight truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-bold text-teal-400/50 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <div className="w-1 h-1 bg-teal-400 rounded-full"></div> Verified
              </p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto scrollbar-none">
          <p className="px-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">
            Operational Nodes
          </p>
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4.5 rounded-[22px] transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-white/10 text-teal-400 shadow-xl border border-white/10 translate-x-1'
                  : 'hover:bg-white/5 text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`p-2.5 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-teal-400 text-blue-950 shadow-lg shadow-teal-400/20' : 'bg-white/5 group-hover:bg-white/10'}`}
                >
                  {React.cloneElement(item.icon, { size: 18 })}
                </div>
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${activeTab === item.id ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}
                >
                  {item.id}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-all duration-500 ${activeTab === item.id ? 'text-teal-400 translate-x-1' : 'text-white/10 group-hover:text-white/20'}`}
              />
            </motion.button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <motion.button
            whileHover={{ x: 5, color: '#f87171' }}
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 rounded-[22px] transition font-bold text-[10px] text-white/20 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 uppercase tracking-[0.2em]"
          >
            <LogOut size={18} /> Sign Out Node
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[140px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/10 rounded-full blur-[120px] -z-10 pointer-events-none text-blue-950/5">
          <Anchor size={400} />
        </div>

        <header className="h-28 px-12 flex items-center justify-between bg-white/60 backdrop-blur-2xl border-b border-teal-50 shrink-0 z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-outfit font-bold text-blue-950 tracking-tight uppercase">
              {activeTab}
            </h2>
            <p className="text-[10px] text-blue-950/30 font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <Radio size={14} className="text-teal-500 animate-pulse" /> Active Node •{' '}
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>

          <div className="flex items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3.5 bg-white text-blue-300 hover:text-teal-500 hover:bg-blue-50/50 rounded-2xl transition-all border border-teal-50 shadow-sm group"
            >
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(45,212,191,1)]"></span>
            </motion.button>
            <div className="h-10 w-[1px] bg-teal-100/50 mx-2"></div>
            <div className="text-right hidden lg:block">
              <p className="text-xs font-bold text-blue-950 tracking-tight">
                {user?.studentId || 'U-7281-NODE'}
              </p>
              <p className="text-[10px] text-teal-600 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center justify-end gap-2">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>{' '}
                {user?.department || 'Advanced Studies'}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 rounded-2xl bg-blue-950 text-teal-400 flex items-center justify-center font-bold text-lg border border-blue-900 shadow-xl shadow-teal-100 cursor-pointer"
            >
              {user?.firstName?.[0]}
            </motion.div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 relative z-0 scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto"
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default StudentHomePage;
