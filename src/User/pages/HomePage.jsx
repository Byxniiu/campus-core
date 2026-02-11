import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export default function HomePage() {
  const [heroDropdownOpen, setHeroDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setHeroDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-blue-950 overflow-x-hidden font-jakarta">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-teal-50/50 via-transparent to-blue-50/30 -z-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl border-b border-teal-100/50 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-6 px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-950 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-teal-100">
              <Shield className="text-teal-400 w-6 h-6" />
            </div>
            <h1 className="text-2xl font-outfit font-bold tracking-tight text-blue-950">
              Campus <span className="text-teal-500">Core</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-12 font-bold text-[11px] uppercase tracking-widest text-blue-900/40">
            <li className="hover:text-teal-600 transition-colors cursor-pointer">
              <a href="#features">Features</a>
            </li>
            <li className="hover:text-teal-600 transition-colors cursor-pointer">
              <a href="#tech">Technologies</a>
            </li>
            <li className="hover:text-teal-600 transition-colors cursor-pointer">
              <a href="#impact">Our Impact</a>
            </li>
          </ul>

          {/* Action Button */}
          <div className="relative">
            <button
              onClick={() => setHeroDropdownOpen(!heroDropdownOpen)}
              className="bg-blue-950 text-white px-8 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-teal-100 active:scale-95 flex items-center gap-2 border border-white/10"
            >
              Enter Portal{' '}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${heroDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {heroDropdownOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-2xl shadow-2xl rounded-[32px] border border-teal-50 py-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                <PortalList onSelect={handleNavigation} />
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-teal-50 text-teal-700 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-10 border border-teal-100 shadow-sm">
          <Activity size={14} className="animate-pulse" /> Redefining Campus Wellbeing
        </div>
        <h1 className="text-6xl md:text-8xl font-outfit font-bold mb-10 tracking-tight text-blue-950 leading-[0.95]">
          The Future of <span className="text-teal-500">Student Support</span> is Here.
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-16 text-blue-900/60 font-medium leading-relaxed">
          A comprehensive ecosystem designed to prioritize student safety, mental health, and
          academic success through intelligent collaboration and real-time assistance.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-950 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={() => setHeroDropdownOpen(!heroDropdownOpen)}
              className="relative px-12 py-5 rounded-2xl bg-blue-950 text-white font-bold text-lg shadow-2xl shadow-teal-100 hover:bg-teal-600 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase tracking-widest"
            >
              Get Started Now <ArrowRight size={20} />
            </button>
          </div>
          <button className="px-12 py-5 rounded-2xl bg-white text-blue-950 font-bold text-lg border-2 border-teal-50 hover:border-blue-950 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
            Explore Features
          </button>
        </div>

        {/* Floating Stats */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-teal-100 pt-16">
          <div className="space-y-2">
            <p className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              24/7
            </p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Active Support
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              100%
            </p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Secure & Private
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Global
            </p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Emergency Response
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Unified
            </p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              Campus Interface
            </p>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section
        className="py-32 px-8 bg-blue-950 relative rounded-[100px] mx-4 overflow-hidden"
        id="features"
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] -z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/5 rounded-full blur-[100px] -z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-outfit font-bold text-white mb-6 tracking-tight">
              Core <span className="text-teal-400">Capabilities</span>
            </h2>
            <p className="text-blue-100/60 text-lg max-w-2xl mx-auto font-medium">
              Empowering every stakeholder with the tools they need for a better academic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-teal-400" />}
              title="SOS Emergency Alerts"
              desc="Instant location-tagged notifications to all faculty and security units during critical incidents."
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-teal-400" />}
              title="Secure Counseling"
              desc="End-to-end encrypted messaging portal for students to seek professional help privately."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-teal-500" />}
              title="Collaborative Pods"
              desc="Student-led study groups that integrate with class schedules and faculty resources."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-teal-400" />}
              title="Emergency Assist"
              desc="A specialized support network connecting newcomers with non-teaching staff for campus navigation help."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-8 h-8 text-teal-400" />}
              title="Live Schedule Sync"
              desc="Automatic timetable management that keeps everyone updated on changes, venues and sessions."
            />
            <FeatureCard
              icon={<ArrowRight className="w-8 h-8 text-teal-400/40" />}
              title="Explore More"
              desc="From event news to faculty chats, Campus Core is the heartbeat of your digital campus."
            />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto text-center" id="tech">
        <h2 className="text-2xl font-bold text-blue-950 mb-16 font-outfit tracking-[0.2em] opacity-30 uppercase">
          Powered by Modern Engineering
        </h2>
        <div className="flex flex-wrap justify-center gap-16 grayscale opacity-40 hover:grayscale-0 transition-all duration-1000 ease-in-out">
          <div className="font-outfit font-bold text-4xl tracking-tight text-blue-900">NODE.JS</div>
          <div className="font-outfit font-bold text-4xl tracking-tight text-teal-600">MONGODB</div>
          <div className="font-outfit font-bold text-4xl tracking-tight text-blue-950">
            REACT.JS
          </div>
          <div className="font-outfit font-bold text-4xl tracking-tight text-teal-500">
            SOCKET.IO
          </div>
          <div className="font-outfit font-bold text-4xl tracking-tight text-blue-800">
            TAILWIND
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto bg-blue-950 rounded-[60px] p-20 text-center text-white shadow-2xl shadow-teal-100/50 relative overflow-hidden group border border-teal-500/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -z-0 group-hover:scale-110 transition-transform duration-700"></div>
          <h2 className="text-5xl md:text-7xl font-outfit font-bold tracking-tight mb-12 leading-tight relative z-10">
            Ready to transform your
            <br />
            campus experience?
          </h2>
          <div className="flex justify-center flex-col sm:flex-row gap-6 relative z-10">
            <button className="bg-teal-400 text-blue-950 px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-white transition active:scale-95 shadow-xl shadow-teal-400/20">
              Launch Student Portal
            </button>
            <button className="bg-blue-900/50 text-white px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-900 transition border border-teal-500/20 active:scale-95">
              Contact Support Terminal
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 px-8 border-t border-teal-50 mt-20 bg-blue-50/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-blue-950 p-2 rounded-xl group-hover:bg-teal-600 transition-colors shadow-lg shadow-teal-100">
              <Shield className="text-teal-400 w-5 h-5" />
            </div>
            <span className="font-outfit font-bold tracking-tight text-2xl text-blue-950">
              Campus <span className="text-teal-500">Core</span>
            </span>
          </div>
          <p className="text-blue-900/40 text-[11px] font-bold uppercase tracking-[0.3em]">
            © 2026 Le-Ment CAS Intelligence. All rights synchronized.
          </p>
          <div className="flex gap-10 text-blue-900/40 text-[11px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-teal-600 transition-colors">
              Privacy Privacy
            </a>
            <a href="#" className="hover:text-teal-600 transition-colors">
              Terms Node
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/5 p-12 rounded-[50px] hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 group cursor-pointer relative shadow-inner">
      <div className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={20} className="text-teal-400 -rotate-45" />
      </div>
      <div className="mb-10 bg-blue-900/50 w-20 h-20 rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-all duration-500 border border-teal-400/10">
        {icon}
      </div>
      <h3 className="text-white text-3xl font-outfit font-bold tracking-tight mb-5">{title}</h3>
      <p className="text-blue-100/60 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function PortalList({ onSelect }) {
  const portals = [
    { name: 'Student Portal', path: '/student-signin', icon: <Users size={16} /> },
    { name: 'Faculty Portal', path: '/faculty-login', icon: <Activity size={16} /> },
    { name: 'Counsellor Node', path: '/counselor-login', icon: <Shield size={16} /> },
    { name: 'Staff Network', path: '/non-teaching-login', icon: <Globe size={16} /> },
  ];

  return (
    <ul className="flex flex-col px-3 gap-1">
      <p className="px-4 py-3 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
        Select Entry Point
      </p>
      {portals.map((p) => (
        <li
          key={p.path}
          onClick={() => onSelect(p.path)}
          className="px-4 py-4 hover:bg-teal-50 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="text-blue-200 group-hover:text-teal-600 transition-colors">
              {p.icon}
            </div>
            <span className="text-xs font-bold text-blue-900 group-hover:text-blue-950 uppercase tracking-widest transition-colors">
              {p.name}
            </span>
          </div>
          <ArrowRight
            size={14}
            className="text-blue-100 group-hover:text-teal-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
          />
        </li>
      ))}
    </ul>
  );
}
