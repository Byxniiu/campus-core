import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // Independent states for each dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [heroDropdownOpen, setHeroDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Helper to handle navigation and close all menus
  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setHeroDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 relative">

          {/* Logo */}
          <a href="#"><h1 className="text-2xl font-bold text-blue-600">CampusWellbeing</h1></a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <li className="hover:text-blue-600 cursor-pointer"><a href="#home">Home</a></li>
            <li className="hover:text-blue-600 cursor-pointer"><a href="#features">Features</a></li>
            <li className="hover:text-blue-600 cursor-pointer"><a href="#tech">Technology</a></li>
            <li className="hover:text-blue-600 cursor-pointer"><a href="#contact">Contact</a></li>
          </ul>

          {/* Navbar Button + Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/90 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 py-2 z-50">
                <PortalList onSelect={handleNavigation} />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-3xl">☰</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-b from-blue-50 to-white mt-20" id="home">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          A Smarter, Safer, More Connected Campus
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600">
          Your all-in-one student support platform for wellbeing, safety, productivity, and academic collaboration.
        </p>
        
        <div className="flex justify-center items-start gap-4">
          {/* --- Hero Button + Dropdown (FIXED) --- */}
          <div className="relative">
            <button 
              onClick={() => setHeroDropdownOpen(prev => !prev)}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </button>

            {heroDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-44 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <PortalList onSelect={handleNavigation} />
              </div>
            )}
          </div>

          <button className="px-6 py-3 rounded-xl border border-gray-400 hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto" id="features">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: "Event News & Personalized Class Updates",
              desc: "Stay ahead with synchronized calendars, reminders, and alerts for events and daily classes.",
            },
            {
              title: "Emergency Assist",
              desc: "One tap connects new students to non-teaching staff for campus help.",
            },
            {
              title: "Secure Counselling System",
              desc: "End-to-end encrypted and role-controlled. Request counselling safely and privately.",
            },
            {
              title: "SOS Alerts",
              desc: "Instant notifications to faculty during emergencies like bullying or disasters.",
            },
            {
              title: "Study Pods & Social Connect",
              desc: "Create pods, chat with peers and teachers, share materials, and collaborate smarter.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition bg-white"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <ol className="max-w-3xl mx-auto space-y-6 text-lg">
          <li>1. Students log in and sync their academic schedule.</li>
          <li>2. Study pods, chats, materials, and events appear automatically.</li>
          <li>3. SOS, Emergency Assist, and Counselling are one tap away.</li>
          <li>4. Faculty receive instant notifications and manage requests.</li>
          <li>5. A smarter, safer, more collaborative campus emerges.</li>
        </ol>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto" id="tech">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Technology Stack
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl bg-blue-50">
            <h3 className="text-xl font-semibold mb-2">Frontend</h3>
            <p>React.js + Tailwind CSS</p>
          </div>
          <div className="p-6 rounded-xl bg-blue-50">
            <h3 className="text-xl font-semibold mb-2">Backend</h3>
            <p>Node.js + Express.js</p>
          </div>
          <div className="p-6 rounded-xl bg-blue-50">
            <h3 className="text-xl font-semibold mb-2">Database</h3>
            <p>MongoDB</p>
          </div>
          <div className="p-6 rounded-xl bg-blue-50">
            <h3 className="text-xl font-semibold mb-2">Real-Time Communication</h3>
            <p>Socket.io / Firebase</p>
          </div>
          <div className="p-6 rounded-xl bg-blue-50">
            <h3 className="text-xl font-semibold mb-2">Security</h3>
            <p>JWT + OAuth2</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-3xl mx-auto" id="contact">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Contact Us
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for your message! We'll get back to you soon.");
            e.target.reset();
          }}
          className="flex flex-col gap-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </section>

    </div>
  );
}

/**
 * Reusable list to keep the UI consistent
 */
function PortalList({ onSelect }) {
  return (
    <ul className="flex flex-col text-gray-700">
      <li
        onClick={() => onSelect('/student-signin')}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        Student
      </li>
      <li
        onClick={() => onSelect('/faculty-login')}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        Faculty
      </li>
      <li
        onClick={() => onSelect('/counselor-login')}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        Counsellor
      </li>
      <li
        onClick={() => onSelect('/non-teaching-login')}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
      >
        Staff
      </li>
    </ul>
  );
}


