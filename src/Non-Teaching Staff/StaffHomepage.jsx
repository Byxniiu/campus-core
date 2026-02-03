import React, { useState } from 'react';

const StaffHomepage = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // --- STAFF DATA FEEDS ---
  const alerts = [
    { id: 1, type: 'Emergency', title: 'Power Failure: Block C', time: '5m ago', level: 'High' },
    { id: 2, type: 'Maintenance', title: 'Water Leak - Room 402', time: '12m ago', level: 'Medium' },
    { id: 3, type: 'Security', title: 'Unauthorized Entry: Gate 4', time: '1h ago', level: 'High' },
  ];

  const messages = [
    { id: 101, from: 'Registrar Office', subject: 'Transcript Processing', body: 'We need the physical files for the 2024 batch by EOD. Several students are requesting urgent transfers and the digital copies are pending verification from the Dean.', time: '09:30 AM', status: 'Unread' },
    { id: 102, from: 'Campus Security', subject: 'Night Shift Schedule', body: 'Please confirm your availability for the weekend. We are increasing patrols near the North Gate due to the upcoming festival events.', time: 'Yesterday', status: 'Important' },
    { id: 103, from: 'IT Department', subject: 'Server Room Temp', body: 'The air conditioning unit in the North Wing is vibrating excessively. We need a maintenance check before it impacts server uptime.', time: '2 days ago', status: 'Under Review' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans relative selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <div>
            <h1 className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase mb-2">Non-Teaching Staff Portal</h1>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Information Terminal</h2>
          </div>
          <div className="hidden sm:block text-right">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-4 py-2 rounded-full border border-slate-700">Read-Only Access</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MESSAGES LIST */}
          <section className="lg:col-span-8 bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-8 border-b border-slate-800 bg-slate-800/20">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">📩 Message Feed</h3>
            </div>
            
            <div className="overflow-y-auto max-h-[600px] divide-y divide-slate-800">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => setSelectedMessage(msg)}
                  className="p-8 hover:bg-slate-800/40 cursor-pointer transition-all group flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                       <h4 className="font-black text-white group-hover:text-amber-500 transition-colors uppercase text-sm tracking-tight">{msg.from}</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-400 ml-5">{msg.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ALERTS COLUMN */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-8 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Urgent System Alerts
              </h3>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-5 rounded-2xl border bg-slate-950 border-slate-800 hover:border-red-500/50 transition-colors">
                    <p className="text-[8px] font-black text-red-500 uppercase mb-1 tracking-widest">{alert.type}</p>
                    <p className="text-xs font-black text-white uppercase tracking-tight leading-tight">{alert.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* --- INFO MODAL (READ ONLY) --- */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-800 text-center relative">
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >✕</button>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Message Entry</p>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedMessage.subject}</h3>
            </div>

            {/* Modal Body */}
            <div className="p-10">
              <div className="flex justify-between items-center mb-6 px-2">
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sender</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">{selectedMessage.from}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Received</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">{selectedMessage.time}</p>
                 </div>
              </div>
              
              <div className="bg-slate-950/80 p-8 rounded-[2rem] border border-slate-800 shadow-inner">
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {selectedMessage.body}
                </p>
              </div>
            </div>

            {/* Modal Footer (No Replying allowed) */}
            <div className="p-8 bg-slate-950/30 text-center">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="px-12 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHomepage;