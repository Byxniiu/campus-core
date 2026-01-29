import React, { useState } from 'react';

const StudyPods = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const pods = [
    {
      id: 1,
      subject: "Advanced Mathematics",
      topic: "Calculus & Integration",
      members: 8,
      status: "Active Now",
      mentor: "Alex Rivera",
      difficulty: "Hard"
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Thermodynamics",
      members: 5,
      status: "Starting in 10m",
      mentor: "Sarah Chen",
      difficulty: "Medium"
    },
    {
      id: 3,
      subject: "Computer Science",
      topic: "Data Structures (Trees)",
      members: 12,
      status: "Active Now",
      mentor: "Jordan Smyth",
      difficulty: "Hard"
    },
    {
      id: 4,
      subject: "Organic Chemistry",
      topic: "Reaction Mechanisms",
      members: 3,
      status: "Idle",
      mentor: "Priya Das",
      difficulty: "Medium"
    }
  ];

  const filteredPods = pods.filter(pod => 
    pod.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pod.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Study Pods</h1>
            <p className="text-slate-500">Join a peer-led session to boost your grades.</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search subjects..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPods.map((pod) => (
            <div key={pod.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    pod.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {pod.difficulty}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2">{pod.subject}</h3>
                  <p className="text-sm text-indigo-600 font-medium">{pod.topic}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {pod.members} Students
                  </div>
                  <span className={`text-[10px] ${pod.status === 'Active Now' ? 'text-green-500 animate-pulse' : 'text-slate-400'}`}>
                    ● {pod.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                    {pod.mentor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-[11px]">
                    <p className="text-slate-400 leading-none">Mentor</p>
                    <p className="font-bold text-slate-700">{pod.mentor}</p>
                  </div>
                </div>
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center">
                  Enter Chat
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPods.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-medium">No study pods found for "{searchQuery}"</p>
            <button className="mt-4 text-indigo-600 font-bold hover:underline">Create a New Pod</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPods;