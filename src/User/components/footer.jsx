import React from 'react';
import { Waves, Anchor, Radio, ShieldCheck, Activity } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Faculty', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-blue-950 text-white mt-24 pt-28 pb-16 relative overflow-hidden font-jakarta">
      {/* Arctic Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/5 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24 border-b border-white/5 pb-24">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="bg-blue-900/50 p-3 rounded-xl border border-teal-400/20 shadow-xl">
                <Waves size={24} className="text-teal-400" />
              </div>
              <h4 className="text-3xl font-outfit font-bold tracking-tight text-white">
                Campus <span className="text-teal-400">Core</span>
              </h4>
            </div>
            <p className="text-[13px] text-blue-100/40 font-medium leading-relaxed max-w-xs">
              A unified platform for student support, real-time safety, and academic synchronization
              across the campus network.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-outfit text-xl font-bold text-teal-400 mb-10 tracking-tight flex items-center gap-3">
              <Activity size={20} /> Support Node
            </h4>
            <ul className="space-y-6">
              {footerLinks.slice(0, 2).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[10px] font-bold text-blue-100/40 hover:text-teal-400 transition-all uppercase tracking-[0.2em] flex items-center gap-4 group"
                  >
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-outfit text-xl font-bold text-teal-400 mb-10 tracking-tight flex items-center gap-3">
              <ShieldCheck size={20} /> Protocols
            </h4>
            <ul className="space-y-6">
              {footerLinks.slice(2, 4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[10px] font-bold text-blue-100/40 hover:text-teal-400 transition-all uppercase tracking-[0.2em] flex items-center gap-4 group"
                  >
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact/Location */}
          <div>
            <h4 className="font-outfit text-xl font-bold text-white mb-10 tracking-tight">
              Campus Hub
            </h4>
            <div className="space-y-5">
              <p className="text-[11px] font-bold text-blue-100/30 uppercase tracking-[0.2em] flex items-center gap-3">
                <Anchor size={16} className="text-teal-400/50" /> Le-Ment CAS
              </p>
              <p className="text-[11px] font-bold text-blue-100/30 uppercase tracking-[0.2em] pt-4">
                Uplink:{' '}
                <a
                  href="mailto:contact@lement.edu"
                  className="text-teal-400 hover:text-white transition-colors ml-2 tracking-tight normal-case font-medium"
                >
                  contact@lement.edu
                </a>
              </p>
              <div className="mt-10 flex items-center gap-3 bg-white/5 w-fit px-6 py-3 rounded-full border border-white/5 shadow-inner">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,1)]"></div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-[0.2em]">
                  Matrix Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-10 border-t border-white/5">
          <p className="text-[10px] font-bold text-blue-100/10 uppercase tracking-[0.2em] text-center md:text-left">
            &copy; {currentYear} Le-Ment College Of Advanced Studies. All rights synchronized.
          </p>
          <div className="flex items-center gap-8 grayscale opacity-10">
            <Waves size={24} />
            <Anchor size={24} />
            <Radio size={24} />
          </div>
          <p className="text-[9px] font-bold text-blue-100/10 uppercase tracking-[0.3em]">
            Arctic UI // 4.2.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
