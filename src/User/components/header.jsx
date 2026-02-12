import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudentAuthStore } from '../../stores/useStudentAuthStore';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useStudentAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout(refreshToken);
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend fails, we should clear local session
      logout();
      navigate('/');
    }
  };

  // Main navigation links based on platform modules
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Study Pods', href: '/study-pod-list' }, // Based on Social Connect & Study Pods [cite: 33]
    { name: 'Counselling', href: '/counseling-form' }, // Based on Secure Counselling Request System [cite: 37]
    { name: 'Timetable', href: '/timetable' },
  ];

  return (
    <header
      className={`bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-teal-50 font-jakarta`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-teal-100/30 group-hover:rotate-12 transition-transform">
                <span className="text-teal-400 font-bold text-lg">C</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-outfit font-bold tracking-tight text-blue-950">
                Campus <span className="text-teal-500">Core</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex md:space-x-8 lg:space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-blue-950/60 hover:text-teal-600 font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-200`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side: Icons and Profile */}
          <div className="flex items-center space-x-5">
            {/* SOS/Notification Icon */}
            <button className="p-3 rounded-2xl text-blue-200 hover:text-blue-950 hover:bg-blue-50 transition-all focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v2a3 3 0 11-6 0v-2m6 0H9"
                ></path>
              </svg>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-11 h-11 rounded-full bg-blue-950 flex items-center justify-center text-teal-400 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-teal-400/10 shadow-xl shadow-teal-100/50 transition-all hover:scale-105 border-2 border-teal-400/20`}
              >
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-4 w-60 rounded-[28px] shadow-2xl bg-white border border-teal-50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <div className="px-6 py-5 border-b border-teal-50 bg-blue-50/30">
                      <p className="font-bold text-blue-950 text-sm tracking-tight">
                        {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                      </p>
                      <p className="text-blue-950/40 text-[10px] font-bold truncate uppercase tracking-widest mt-1">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950/60 hover:text-teal-600 hover:bg-teal-50 rounded-[18px] transition-all"
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 hover:text-red-500 hover:bg-red-50 rounded-[18px] transition-all"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-blue-200 hover:text-blue-950 hover:bg-blue-50 focus:outline-none md:hidden transition-all"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-teal-50 animate-in slide-in-from-top-5 duration-300">
          <div className="px-4 pt-6 pb-10 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-6 py-4 rounded-[20px] text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950/60 hover:text-teal-600 hover:bg-teal-50 transition-all`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
