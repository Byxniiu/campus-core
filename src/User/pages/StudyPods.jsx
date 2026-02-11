import React, { useState } from 'react';
import {
  Search,
  Users,
  Clock,
  ArrowRight,
  Plus,
  ChevronLeft,
  MessageSquare,
  Target,
  Waves,
  Anchor,
  Box,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudyPods = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const pods = [
    {
      id: 1,
      subject: 'Advanced Mathematics',
      topic: 'Calculus & Integration',
      members: 8,
      status: 'Active Now',
      mentor: 'Alex Rivera',
      difficulty: 'Hard',
    },
    {
      id: 2,
      subject: 'Physics',
      topic: 'Thermodynamics',
      members: 5,
      status: 'Starting in 10m',
      mentor: 'Sarah Chen',
      difficulty: 'Medium',
    },
    {
      id: 3,
      subject: 'Computer Science',
      topic: 'Data Structures (Trees)',
      members: 12,
      status: 'Active Now',
      mentor: 'Jordan Smyth',
      difficulty: 'Hard',
    },
    {
      id: 4,
      subject: 'Organic Chemistry',
      topic: 'Reaction Mechanisms',
      members: 3,
      status: 'Idle',
      mentor: 'Priya Das',
      difficulty: 'Medium',
    },
  ];

  const filteredPods = pods.filter(
    (pod) =>
      pod.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-8 md:p-16 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb / Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-900/40 hover:text-teal-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Dashboard
        </Link>

        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-950 p-2.5 rounded-xl shadow-lg shadow-teal-100">
                <Users size={20} className="text-teal-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                High-Velocity Collaboration
              </span>
            </div>
            <h1 className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Study <span className="text-teal-500">Pods</span>
            </h1>
            <p className="text-blue-950/60 text-lg font-medium mt-6 max-w-lg leading-relaxed">
              Join peer-led modules and master your curriculum through collective intelligence.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-teal-500 transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search subjects or topics..."
              className="pl-16 pr-8 py-6 bg-white border border-teal-50 rounded-[30px] shadow-2xl shadow-teal-100/50 focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none w-full lg:w-[450px] text-sm font-bold transition-all placeholder:text-blue-200 text-blue-950"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ActionBar */}
        <div className="flex justify-between items-center mb-10 px-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,1)]"></div>
            <p className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              {filteredPods.length} active learning nodes detected
            </p>
          </div>
          <Link to="/study-pod-create">
            <button className="flex items-center gap-4 bg-blue-950 text-white px-10 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all shadow-xl shadow-teal-100 active:scale-[0.98] group">
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-300 text-teal-400"
              />{' '}
              Initialize New Pod
            </button>
          </Link>
        </div>

        {/* Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredPods.map((pod) => (
            <div
              key={pod.id}
              className="group bg-white rounded-[40px] p-10 border border-teal-50 shadow-2xl shadow-teal-100/50 hover:shadow-teal-200/30 hover:border-teal-300 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/30 rounded-full blur-3xl -z-0"></div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-inner ${
                        pod.difficulty === 'Hard'
                          ? 'bg-blue-950 text-teal-400 border border-blue-900'
                          : 'bg-blue-50 text-blue-950/40 border border-teal-50'
                      }`}
                    >
                      {pod.difficulty} Rank
                    </span>
                    <span className="text-blue-950/30 font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>{' '}
                      {pod.status}
                    </span>
                  </div>
                  <h3 className="text-3xl font-outfit font-bold text-blue-950 mb-3 tracking-tight group-hover:text-teal-600 transition-colors uppercase">
                    {pod.subject}
                  </h3>
                  <div className="flex items-center gap-2.5 text-blue-950/40 font-bold text-sm">
                    <Target size={14} className="text-teal-400" />
                    {pod.topic}
                  </div>
                </div>
                <div className="bg-blue-50/50 p-5 rounded-3xl border border-teal-50 flex flex-col items-center gap-1 shadow-inner group-hover:bg-blue-50 transition-colors">
                  <span className="text-xs font-bold text-blue-950">{pod.members}</span>
                  <Users size={14} className="text-teal-400" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-10 pt-10 border-t border-teal-50 relative z-10">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 bg-blue-50 border border-teal-50 rounded-[20px] flex items-center justify-center text-[10px] font-bold text-blue-950 group-hover:bg-blue-950 group-hover:text-teal-400 group-hover:rotate-6 transition-all duration-500 shadow-inner group-hover:shadow-teal-200">
                    {pod.mentor
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-1">
                      Node Mentor
                    </p>
                    <p className="font-bold text-blue-950 uppercase tracking-tight">{pod.mentor}</p>
                  </div>
                </div>
                <Link to={`/study-pod-chat`}>
                  <button className="px-10 py-5 bg-blue-950 text-white rounded-[24px] hover:bg-teal-600 transition shadow-2xl shadow-teal-100/50 active:scale-[0.98] flex items-center gap-4 group/btn">
                    <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                      Access Channel
                    </span>
                    <ArrowRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform text-teal-400"
                    />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPods.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[60px] border-2 border-dashed border-teal-100 animate-in fade-in duration-1000 shadow-inner relative overflow-hidden">
            <div className="bg-blue-50/50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-blue-100 border border-teal-50 shadow-inner relative z-10">
              <Waves size={44} className="animate-pulse" />
            </div>
            <h4 className="text-blue-950 font-outfit font-bold text-5xl mb-4 tracking-tight uppercase relative z-10">
              Node Not Found
            </h4>
            <p className="text-blue-950/30 font-bold uppercase tracking-[0.2em] text-[10px] relative z-10">
              No learning pods match your query "{searchQuery}"
            </p>
            <button className="mt-12 px-10 py-5 bg-blue-950 text-white rounded-[24px] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 transition shadow-xl shadow-teal-100 active:scale-[0.98] flex items-center gap-4 mx-auto relative z-10">
              <Plus size={18} className="text-teal-400" /> Initialize First Node
            </button>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
              <Anchor size={400} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPods;
