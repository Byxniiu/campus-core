import React, { useState } from 'react';

const CounselorHome = () => {
  const [activeTab, setActiveTab] = useState('Requests');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- TRIAGE DATA FEED ---
  const studentData = {
    Requests: [
      { id: 'REQ-01', name: 'James Wilson', issue: 'Academic Stress', date: '2026-01-28', priority: 'High', bio: 'Student is feeling overwhelmed by midterms.' },
      { id: 'REQ-02', name: 'Sophia Chen', issue: 'Career Pathing', date: '2026-01-29', priority: 'Medium', bio: 'Wants to discuss switching from Bio to CS.' },
      { id: 'REQ-03', name: 'Liam O’Brien', issue: 'Social Anxiety', date: '2026-01-30', priority: 'Low', bio: 'Needs tips for public speaking in seminars.' }
    ],
    Pending: [
      { id: 'PEN-01', name: 'Emma Watson', issue: 'Grief Support', date: '2026-01-25', priority: 'High', bio: 'Waiting for student to confirm time slot.' },
      { id: 'PEN-02', name: 'Noah Miller', issue: 'Focus Issues', date: '2026-01-26', priority: 'Medium', bio: 'Documentation requested from faculty.' },
      { id: 'PEN-03', name: 'Olivia Pope', issue: 'Leadership Prep', date: '2026-01-27', priority: 'Low', bio: 'Initial assessment completed.' }
    ],
    Approved: [
      { id: 'APP-01', name: 'Lucas Scott', issue: 'Sports Psych', date: '2026-02-05', priority: 'Medium', bio: 'Confirmed session in Hall B.' },
      { id: 'APP-02', name: 'Mia Khalifa', issue: 'Time Management', date: '2026-02-06', priority: 'Low', bio: 'Bi-weekly check-in scheduled.' },
      { id: 'APP-03', name: 'Ethan Hunt', issue: 'Crisis Recovery', date: '2026-02-07', priority: 'High', bio: 'Follow-up after successful intervention.' }
    ]
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR: TRIAGE NAVIGATION */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-black text-indigo-500 italic tracking-tighter uppercase">Counselor<span className="text-white">Pro</span></h1>
        </div>
        
        <nav className="p-6 space-y-2">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-4 mb-4">Case Management</p>
          {Object.keys(studentData).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-800'}`}
            >
              {tab === 'Requests' ? '📥 New Requests' : tab === 'Pending' ? '⏳ Pending List' : '✅ Approved List'}
            </button>
          ))}
        </nav>
      </aside>

      {/* OVERVIEW CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Overview</h2>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Counselor: Dr. Aris</span>
          </div>
        </header>

        {/* 3 MAJOR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(studentData).map(([key, list]) => (
            <div 
              key={key} 
              onClick={() => setActiveTab(key)}
              className={`p-8 rounded-[2.5rem] bg-slate-900 border-2 cursor-pointer transition-all hover:scale-105 ${activeTab === key ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700'}`}
            >
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{key} Count</h4>
              <p className="text-4xl font-black text-white">{list.length.toString().padStart(2, '0')}</p>
              <div className={`mt-4 h-1 w-12 rounded-full ${key === 'Requests' ? 'bg-red-500' : key === 'Pending' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            </div>
          ))}
        </div>

        {/* LIST VIEW */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 px-2">{activeTab} Directory</h3>
          <div className="grid grid-cols-1 gap-4">
            {studentData[activeTab].map(student => (
              <div 
                key={student.id} 
                onClick={() => setSelectedStudent(student)}
                className="group bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex justify-between items-center hover:border-indigo-500 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg">{student.name}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{student.issue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${student.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                    {student.priority} Priority
                  </span>
                  <p className="text-[10px] text-slate-600 mt-2 font-black">{student.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* DETAIL POPUP */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedStudent.name}</h3>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">{selectedStudent.id}</p>
              </div>
              <span className="bg-indigo-600/20 text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Profile View</span>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Subject of Concern</p>
                <p className="text-sm font-bold text-white uppercase italic">{selectedStudent.issue}</p>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Case Notes</p>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">"{selectedStudent.bio}"</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <button onClick={() => setSelectedStudent(null)} className="py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase text-slate-400 hover:bg-slate-700">Go Back</button>
              <button className="py-4 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase text-white shadow-lg shadow-indigo-500/20">Update Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorHome;