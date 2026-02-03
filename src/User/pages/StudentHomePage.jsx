import React, { useState } from 'react';
import { 
  AlertTriangle, MessageSquare, Calendar, Users, 
  UserCircle, Plus, Send, X, Phone, Mail 
} from 'lucide-react';

const StudentHomePage = () => {
  const [activeTab, setActiveTab] = useState('SOS System');
  const [selectedItem, setSelectedItem] = useState(null); // Handles sub-views (Events, Counselors, Staff)
  const [registered, setRegistered] = useState(false);
  const [showFacultyChat, setShowFacultyChat] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // --- Mock Data ---
  const events = [
    { id: 1, name: "Tech Symposium 2026", type: "Workshop", venue: "Hall A", date: "Feb 15", time: "10:00 AM" },
    { id: 2, name: "Career Fair", type: "Seminar", venue: "Main Square", date: "Feb 20", time: "09:00 AM" }
  ];

  const counselors = [
    { id: 1, name: "Dr. Sarah Smith", specialty: "Mental Health", bio: "15 years experience in student psychology.", availability: "Mon-Fri" },
    { id: 2, name: "Mr. David Chen", specialty: "Academic Stress", bio: "Expert in time management and exam anxiety.", availability: "Tue-Thu" }
  ];

  const staff = [
    { id: 1, name: "John Doe", role: "Librarian", dept: "Central Library" },
    { id: 2, name: "Maria Garcia", role: "IT Support", dept: "Tech Hub" }
  ];

  const facultyList = [
    { id: 1, name: "Prof. Alan Turing", dept: "Computer Science" },
    { id: 2, name: "Dr. Ada Lovelace", dept: "Mathematics" }
  ];

  // --- Handlers ---
  const resetSubView = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setRegistered(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b flex items-center gap-2 text-blue-600 font-bold text-xl">
          <ShieldAlert className="w-8 h-8" /> Campus Core
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'SOS System', icon: <AlertTriangle size={20}/> },
            { id: 'Chat Group', icon: <MessageSquare size={20}/> },
            { id: 'Event News', icon: <Calendar size={20}/> },
            { id: 'Counselor List', icon: <Users size={20}/> },
            { id: 'Staff List', icon: <UserCircle size={20}/> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => resetSubView(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-medium ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-blue-50 text-slate-600'
              }`}
            >
              {item.icon} {item.id}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative p-8">
        
        {/* 1. SOS SYSTEM (DEFAULT HERO) */}
        {activeTab === 'SOS System' && (
          <div className="h-full bg-white rounded-3xl border-4 border-red-50 flex flex-col items-center justify-center p-10 text-center shadow-xl">
             <div className="bg-red-600 p-8 rounded-full animate-pulse mb-6 shadow-red-200 shadow-2xl">
               <AlertTriangle size={80} color="white" />
             </div>
             <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">SOS EMERGENCY</h1>
             <p className="text-slate-500 max-w-lg mb-10 text-lg">Broadcast your location and ID to campus security and emergency medical services instantly.</p>
             <a href="/sos-system">
                <button className="bg-red-600 hover:bg-red-700 text-white px-16 py-5 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                ACTIVATE NOW
             </button>
             </a>
          </div>
        )}

        {/* 2. CHAT GROUPS */}
        {activeTab === 'Chat Group' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Groups</h2>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold"><Plus size={20}/> Create Group</button>
            </div>
            <div className="grid gap-4">
              {['CS Students 2026', 'Drama Club', 'Residents Hall A'].map(g => (
                <div key={g} className="bg-white p-5 rounded-2xl border flex justify-between items-center hover:shadow-md cursor-pointer transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">{g[0]}</div>
                    <span className="font-bold text-lg">{g}</span>
                  </div>
                  <button className="text-blue-600 font-medium">Open Chat</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. EVENT NEWS */}
        {activeTab === 'Event News' && (
          <div className="max-w-4xl mx-auto">
            {!selectedItem ? (
              <div className="grid gap-6">
                {events.map(e => (
                  <div key={e.id} onClick={() => setSelectedItem(e)} className="group bg-white p-6 rounded-2xl border hover:border-blue-500 transition cursor-pointer flex justify-between items-center">
                    <div>
                      <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">{e.type}</span>
                      <h3 className="text-2xl font-bold mt-1 group-hover:text-blue-600 transition">{e.name}</h3>
                      <p className="text-slate-500 mt-2">{e.date} • {e.venue}</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-lg font-semibold text-slate-600">Details →</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border shadow-sm">
                <button onClick={() => setSelectedItem(null)} className="mb-6 text-slate-400 hover:text-slate-900 flex items-center gap-1">← Back</button>
                <h2 className="text-4xl font-black mb-6">{selectedItem.name}</h2>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-4 bg-slate-50 rounded-2xl"><strong>Venue:</strong> {selectedItem.venue}</div>
                  <div className="p-4 bg-slate-50 rounded-2xl"><strong>Time:</strong> {selectedItem.time}</div>
                </div>
                <div className="border-t pt-8">
                  {registered ? (
                    <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-200 text-center font-bold text-xl">✓ Registration Successful!</div>
                  ) : (
                    <form onSubmit={(e) => {e.preventDefault(); setRegistered(true)}} className="space-y-4">
                      <h3 className="text-xl font-bold">Register Now</h3>
                      <input required className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Register Number" />
                      <input required className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Full Name" />
                      <input required className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Class" />
                      <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg">Register Now</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. COUNSELOR LIST */}
        {activeTab === 'Counselor List' && (
           <div className="max-w-4xl mx-auto">
             {!selectedItem ? (
               <div className="grid gap-6">
                 {counselors.map(c => (
                   <div key={c.id} onClick={() => setSelectedItem(c)} className="bg-white p-6 rounded-2xl border hover:border-blue-500 cursor-pointer flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">{c.name[4]}</div>
                     <div>
                       <h3 className="text-xl font-bold">{c.name}</h3>
                       <p className="text-slate-500">{c.specialty}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="bg-white p-10 rounded-3xl border shadow-sm">
                 <button onClick={() => setSelectedItem(null)} className="mb-6 text-slate-400">← Back</button>
                 <h2 className="text-3xl font-bold mb-2">{selectedItem.name}</h2>
                 <p className="text-blue-600 font-semibold mb-6">{selectedItem.specialty}</p>
                 <p className="text-slate-600 mb-8">{selectedItem.bio}</p>
                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="font-bold mb-4">Apply for Appointment</h4>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Request Availability</button>
                 </div>
               </div>
             )}
           </div>
        )}

        {/* 5. NON-TEACHING STAFF */}
        {activeTab === 'Staff List' && (
           <div className="max-w-4xl mx-auto">
             {!selectedItem ? (
               <div className="grid gap-4">
                 {staff.map(s => (
                   <div key={s.id} onClick={() => setSelectedItem(s)} className="bg-white p-5 rounded-2xl border hover:shadow-md cursor-pointer flex justify-between">
                     <div>
                       <h3 className="font-bold text-lg">{s.name}</h3>
                       <p className="text-slate-500">{s.role} • {s.dept}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="bg-white p-10 rounded-3xl border shadow-sm">
                 <button onClick={() => setSelectedItem(null)} className="mb-6 text-slate-400">← Back</button>
                 <h2 className="text-3xl font-bold">{selectedItem.name}</h2>
                 <p className="text-slate-500 mb-8">{selectedItem.role} | {selectedItem.dept}</p>
                 <div className="space-y-4">
                    <textarea className="w-full p-4 bg-slate-50 border rounded-2xl h-32" placeholder="Explain how this staff member can help you..."></textarea>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black">
                      <Send size={18}/> Get Help
                    </button>
                 </div>
               </div>
             )}
           </div>
        )}

      </main>

      {/* FLOATING FACULTY CHAT BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setShowFacultyChat(!showFacultyChat)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2"
        >
          <MessageSquare size={28} />
          {showFacultyChat ? <X size={20}/> : <span className="pr-2 font-bold">Faculty Chat</span>}
        </button>

        {showFacultyChat && (
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center">
              <span>Faculties</span>
              <button onClick={() => {setShowFacultyChat(false); setSelectedFaculty(null)}}><X size={18}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {!selectedFaculty ? (
                <div className="p-2">
                  {facultyList.map(f => (
                    <div 
                      key={f.id} 
                      onClick={() => setSelectedFaculty(f)}
                      className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3 transition"
                    >
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">{f.name[6]}</div>
                      <div>
                        <div className="text-sm font-bold">{f.name}</div>
                        <div className="text-xs text-slate-400">{f.dept}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center text-center h-full">
                   <button onClick={() => setSelectedFaculty(null)} className="self-start text-xs text-blue-600 mb-4 italic">← All Faculties</button>
                   <div className="w-20 h-20 bg-blue-50 rounded-full mb-4 flex items-center justify-center text-2xl font-black text-blue-600">
                     {selectedFaculty.name[6]}
                   </div>
                   <h3 className="font-bold text-xl">{selectedFaculty.name}</h3>
                   <p className="text-slate-500 mb-6">{selectedFaculty.dept}</p>
                   <div className="flex gap-4 mb-8">
                     <button className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-100 transition"><Phone size={20}/></button>
                     <button className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-100 transition"><Mail size={20}/></button>
                   </div>
                   <button className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                     <Send size={18}/> Message
                   </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ShieldAlert = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="M12 8v4" /><path d="M12 16h.01" />
  </svg>
);

export default StudentHomePage;