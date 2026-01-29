import React, { useState } from 'react';

const FacultyDashboard = () => {
  const [activePage, setActivePage] = useState('Overview');
  const [activeTab, setActiveTab] = useState('Default'); 
  const [activeChat, setActiveChat] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [replyText, setReplyText] = useState("");

  // --- DATA FEEDS ---
  const [events, setEvents] = useState([
    { id: 1, name: 'Math Olympiad Prep', type: 'Workshop', venue: 'Hall A', dateTime: '2026-02-10 10:00', status: 'Upcoming', description: 'Advanced problem-solving for national qualifiers.' },
    { id: 2, name: 'AI Ethics Seminar', type: 'Seminar', venue: 'Main Auditorium', dateTime: '2026-02-15 14:00', status: 'Upcoming', description: 'Exploring the future of machine learning ethics.' }
  ]);

  const [counselors] = useState([
    { id: 'COUN-1', name: 'Dr. Sarah Jenkins', specialty: 'Clinical Psychology', availability: 'Mon-Fri', bio: 'Expert in student stress management.' },
    { id: 'COUN-2', name: 'Marcus Vane', specialty: 'Career Guidance', availability: 'Tue-Sat', bio: 'Specializes in post-grad planning.' }
  ]);

  const [podcasts] = useState([
    { id: 'POD-101', title: 'Advanced Calculus Theory', participants: '12 Students', lastMsg: 'Does the limit exist?', time: '2m ago' },
    { id: 'POD-202', title: 'Linear Algebra Basics', participants: '45 Students', lastMsg: 'Check the new PDF!', time: '1h ago' }
  ]);

  const [eventForm, setEventForm] = useState({ name: '', type: '', venue: '', dateTime: '', status: 'Upcoming', description: '' });

  // --- CHAT HISTORY ---
  const [chatHistory, setChatHistory] = useState({
    'POD-101': [{ id: 1, sender: 'Alex', msg: 'Will Fourier transforms be on the test?', time: '10:05 AM', isFaculty: false }],
    'POD-202': [{ id: 1, sender: 'Jordan', msg: 'Is the zero vector always in the subspace?', time: '09:00 AM', isFaculty: false }]
  });

  // --- HANDLERS ---
  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvent = { ...eventForm, id: Date.now() };
    setEvents([newEvent, ...events]);
    setEventForm({ name: '', type: '', venue: '', dateTime: '', status: 'Upcoming', description: '' });
    setActiveTab('EventList'); // Jump to list after creation
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;
    const newMessage = { id: Date.now(), sender: 'Dr. Aris (You)', msg: replyText, time: 'Just now', isFaculty: true };
    setChatHistory({...chatHistory, [activeChat.id]: [...(chatHistory[activeChat.id] || []), newMessage]});
    setReplyText("");
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-200 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-slate-700 text-center">
          <h1 className="text-xl font-black tracking-widest text-white italic uppercase">Faculty Core</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-4 mt-4 overflow-y-auto">
          <div>
            <p className="text-[10px] text-slate-500 font-black px-4 mb-2 uppercase tracking-widest">Main</p>
            <button onClick={() => { setActivePage('Overview'); setActiveTab('Default'); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase mb-1 ${activePage === 'Overview' && activeTab === 'Default' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}>Dashboard</button>
            <button onClick={() => { setActivePage('Overview'); setActiveTab('Counselors'); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase mb-1 ${activeTab === 'Counselors' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}>Counselors</button>
          </div>

          <div>
            <p className="text-[10px] text-slate-500 font-black px-4 mb-2 uppercase tracking-widest">Events Engine</p>
            <button onClick={() => { setActivePage('Overview'); setActiveTab('EventCreating'); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase mb-1 ${activeTab === 'EventCreating' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}>+ Create Event</button>
            <button onClick={() => { setActivePage('Overview'); setActiveTab('EventList'); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase ${activeTab === 'EventList' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}>📅 Event List</button>
          </div>

          <div>
            <p className="text-[10px] text-slate-500 font-black px-4 mb-2 uppercase tracking-widest">Podcasts</p>
            {podcasts.map(pod => (
              <button key={pod.id} onClick={() => { setActivePage('Messages'); setActiveChat(pod); }} className={`w-full text-left px-4 py-3 rounded-xl mb-1 ${activeChat?.id === pod.id && activePage === 'Messages' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                <p className="text-[11px] font-bold truncate">{pod.title}</p>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-900 p-10">
        <header className="mb-10"><h2 className="text-3xl font-black text-white uppercase tracking-tighter">{activePage}</h2></header>

        {activePage === 'Overview' && (
          <div className="space-y-10">
            {/* 6-Card Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[{ id: 'Students', title: 'Students', val: '42', icon: '👥' }, { id: 'Counselors', title: 'Counselors', val: counselors.length, icon: '🧠' }, { id: 'Messages', title: 'Chats', val: podcasts.length, icon: '🎙️' }, { id: 'EventCreating', title: 'New Event', val: '+', icon: '📅' }, { id: 'EventList', title: 'Schedule', val: events.length, icon: '📋' }, { id: 'Alerts', title: 'Alerts', val: '03', icon: '🔔' }].map((card) => (
                <div key={card.id} onClick={() => card.id === 'Messages' ? setActivePage('Messages') : setActiveTab(card.id)}
                  className={`cursor-pointer bg-slate-800 border-2 p-5 rounded-[2.2rem] shadow-xl transition-all hover:scale-105 ${activeTab === card.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700'}`}>
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{card.title}</h4>
                  <p className="text-2xl font-black text-white">{card.val}</p>
                </div>
              ))}
            </div>

            {/* DYNAMIC VIEWPORT */}
            <div className="mt-8 min-h-[400px]">
              {activeTab === 'Counselors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4">
                  {counselors.map(c => (
                    <div key={c.id} onClick={() => setSelectedCounselor(c)} className="bg-slate-800 border border-slate-700 p-6 rounded-[2.5rem] flex items-center space-x-4 hover:border-indigo-500 cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white">{c.name.charAt(0)}</div>
                      <div><h4 className="font-black text-white leading-tight">{c.name}</h4><p className="text-[10px] text-indigo-400 font-black uppercase">{c.specialty}</p></div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'EventCreating' && (
                <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
                  <h3 className="text-xl font-black text-white uppercase text-center mb-6 tracking-widest">Draft New Event</h3>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <input type="text" placeholder="Event Name" required className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none" value={eventForm.name} onChange={e => setEventForm({...eventForm, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Venue" className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-3 text-white outline-none" value={eventForm.venue} onChange={e => setEventForm({...eventForm, venue: e.target.value})} />
                      <input type="datetime-local" className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-3 text-white outline-none" value={eventForm.dateTime} onChange={e => setEventForm({...eventForm, dateTime: e.target.value})} />
                    </div>
                    <div className="flex justify-around p-3 bg-slate-900 rounded-2xl border border-slate-700">
                      {['Past', 'Present', 'Upcoming'].map(s => (
                        <label key={s} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" checked={eventForm.status === s} onChange={() => setEventForm({...eventForm, status: s})} className="accent-indigo-500" />
                          <span className={`text-[10px] font-black uppercase ${eventForm.status === s ? 'text-indigo-400' : 'text-slate-500'}`}>{s}</span>
                        </label>
                      ))}
                    </div>
                    <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl hover:bg-indigo-500 transition-all">Publish to Schedule</button>
                  </form>
                </div>
              )}

              {activeTab === 'EventList' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
                  {events.map(evt => (
                    <div key={evt.id} onClick={() => setSelectedEvent(evt)} className="bg-slate-800 border border-slate-700 p-6 rounded-[2.5rem] cursor-pointer hover:border-indigo-500 transition-all relative group">
                      <span className={`absolute top-4 right-6 text-[8px] font-black px-2 py-1 rounded bg-indigo-600 text-white uppercase`}>{evt.status}</span>
                      <h4 className="font-black text-white group-hover:text-indigo-400 transition-colors">{evt.name}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">{evt.type}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Default' && <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-[3rem] text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Ready for input</div>}
            </div>
          </div>
        )}

        {/* --- CHAT VIEW --- */}
        {activePage === 'Messages' && (
           <div className="h-[70vh] bg-slate-800 border border-slate-700 rounded-[3rem] flex overflow-hidden animate-in slide-in-from-right-8">
             {activeChat ? (
               <div className="flex-1 flex flex-col">
                  <div className="p-8 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                    <div><h3 className="text-xl font-black text-white uppercase tracking-tighter">{activeChat.title}</h3><p className="text-[10px] text-indigo-400 font-black uppercase">Active Session</p></div>
                  </div>
                  <div className="flex-1 p-8 overflow-y-auto space-y-4">
                    {chatHistory[activeChat.id]?.map(msg => (
                      <div key={msg.id} className={`flex ${msg.isFaculty ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-4 rounded-2xl ${msg.isFaculty ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 text-slate-300 rounded-bl-none border border-slate-700'}`}>
                          <p className="text-sm font-medium">{msg.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="p-6 bg-slate-900 border-t border-slate-700 flex space-x-3">
                    <input value={replyText} onChange={e => setReplyText(e.target.value)} type="text" placeholder="Type a reply..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                    <button className="bg-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase">Send</button>
                  </form>
               </div>
             ) : <div className="flex-1 flex items-center justify-center text-slate-500 uppercase text-[10px] font-black tracking-widest">Select a Podcast Chat</div>}
           </div>
        )}
      </main>

      {/* --- SHARED MODALS --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
             <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">{selectedEvent.name}</h3>
             <div className="space-y-3 mb-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">📍 Location: <span className="text-white ml-2">{selectedEvent.venue}</span></p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">📅 Schedule: <span className="text-white ml-2">{selectedEvent.dateTime}</span></p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">🏷️ Status: <span className="text-indigo-400 ml-2">{selectedEvent.status}</span></p>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{selectedEvent.description}"</p>
             <button onClick={() => setSelectedEvent(null)} className="w-full py-4 bg-slate-700 rounded-2xl font-black text-[10px] uppercase text-slate-300 hover:bg-slate-600 transition-all">Close Entry</button>
          </div>
        </div>
      )}
      
      {/* (Counselor Popup logic remains the same) */}
    </div>
  );
};

export default FacultyDashboard;