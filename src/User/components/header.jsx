import React, { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const primaryColor = 'indigo';
    const logoText = "Campus Core";

    // Main navigation links based on platform modules
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Study Pods', href: '/study-pod-list' }, // Based on Social Connect & Study Pods [cite: 33]
        { name: 'Counselling', href: '/counseling-form' }, // Based on Secure Counselling Request System [cite: 37]
        { name: 'Timetable', href: '/timetable' },
    ];

    return (
        <header className={`bg-white shadow-md sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo/Title */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center">
                            <h1 className="text-xl sm:text-2xl font-bebas tracking-wider text-gray-900">
                                {logoText}
                            </h1>
                        </a>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex md:space-x-6 lg:space-x-10">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name}
                                href={link.href}
                                className={`text-gray-600 hover:text-${primaryColor}-600 font-medium transition duration-150 ease-in-out`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Right Side: Icons and Profile */}
                    <div className="flex items-center space-x-4">
                        {/* SOS/Notification Icon (for real-time alerts [cite: 40]) */}
                        <button className="p-1 rounded-full text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            {/* Simple bell icon for notifications/SOS */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v2a3 3 0 11-6 0v-2m6 0H9"></path></svg>
                        </button>

                        {/* User Profile Placeholder */}
                        <div className={`w-8 h-8 rounded-full bg-${primaryColor}-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer`}>
                            SK
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${primaryColor}-500 md:hidden"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-${primaryColor}-600 hover:bg-gray-50`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;