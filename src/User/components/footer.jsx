import React from 'react';

const Footer = () => {
    const primaryColor = 'indigo';
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Faculty', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ];

    return (
        <footer className={`bg-gray-800 text-white mt-12 pt-10 pb-6`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-b border-gray-700 pb-8">
                    
                    {/* Column 1: Logo & Mission */}
                    <div>
                        <h4 className={`text-xl font-bebas tracking-wider text-${primaryColor}-400 mb-3`}>
                            Le-Ment College 
                        </h4>
                        <p className="text-sm text-gray-400">
                            A unified platform for student support, safety, and engagement.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-3">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.slice(0, 2).map(link => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition duration-150">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-3">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.slice(2, 4).map(link => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition duration-150">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column 4: Contact/Location */}
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-3">Campus Core</h4>
                        <p className="text-sm text-gray-400">
                            Le-Ment College Of Advanced Studies 
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Email: contact@lement.edu
                        </p>
                    </div>
                </div>

                {/* Copyright Row */}
                <div className="text-center md:flex md:justify-between md:items-center pt-4">
                    <p className="text-sm text-gray-400">
                        &copy; [cite_start]{currentYear} Le-Ment College Of Advanced Studies[cite: 1]. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 mt-2 md:mt-0">
                        Built with React.js and Tailwind CSS.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;