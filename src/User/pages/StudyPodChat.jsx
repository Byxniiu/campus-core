import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  MessageSquare,
  Send,
  Paperclip,
  Users,
  BookOpen,
  LogOut,
  ShieldCheck,
  Activity,
  Waves,
  Anchor,
  Radio,
  Box,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudyPodChat = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      id: 1,
      sender: 'Dr. Aris',
      role: 'Faculty',
      text: "Welcome everyone! Let's focus on the integration rules today within the campus node.",
      time: '10:00 AM',
    },
    {
      id: 2,
      sender: 'Sarah Miller',
      role: 'Student',
      text: "Thanks, Dr. Aris. I'm having trouble with the substitution method.",
      time: '10:02 AM',
    },
    {
      id: 3,
      sender: 'James Wilson',
      role: 'Student',
      text: 'Me too! Can we look at the exercise on page 42?',
      time: '10:03 AM',
    },
  ]);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      role: 'Student',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatLog([...chatLog, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F0F9FF] p-4 md:p-8 font-jakarta gap-6">
      {/* Left Sidebar - Pod Info & Resources */}
      <div className="hidden lg:flex flex-col w-96 bg-white rounded-[40px] shadow-2xl shadow-teal-100 border border-teal-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full blur-3xl -z-0"></div>

        <div className="p-10 relative z-10">
          <Link
            to="/study-pod-list"
            className="inline-flex items-center gap-2 text-blue-900/40 hover:text-teal-600 font-bold text-[9px] uppercase tracking-[0.2em] mb-10 transition-all group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />{' '}
            Exit to Pods
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3.5 py-1.5 rounded-lg border border-teal-100">
                High-Density module
              </span>
            </div>
            <h1 className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Advanced <span className="text-teal-500">Mathematics</span>
            </h1>
            <p className="text-blue-950/40 text-sm font-medium mt-5 leading-relaxed">
              Shared module for the mastery of complex integration and calculus within the network.
            </p>
          </header>

          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between font-bold text-[10px] text-blue-950/20 uppercase tracking-[0.2em] mb-8 border-b border-teal-50 pb-3">
                <span>Asset Repository</span>
                <Box size={14} className="text-teal-400" />
              </div>
              <ul className="space-y-4">
                {[
                  { name: 'Calculus_CheatSheet.pdf', size: '1.2MB' },
                  { name: 'Assignment_Week4.docx', size: '42KB' },
                ].map((asset, i) => (
                  <li
                    key={i}
                    className="group flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-teal-50 hover:border-teal-300 transition-all cursor-pointer shadow-inner"
                  >
                    <span className="text-[11px] font-bold text-blue-950 truncate max-w-[150px]">
                      {asset.name}
                    </span>
                    <span className="text-[10px] font-bold text-teal-500 uppercase">
                      {asset.size}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-[10px] text-blue-950/20 uppercase tracking-[0.2em] mb-8 border-b border-teal-50 pb-3">
                <span>Active Members</span>
                <Users size={14} className="text-teal-400" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {['Dr. Aris', 'Sarah Miller', 'James Wilson', 'You'].map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-blue-50/50 transition-colors group/user"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,1)] animate-pulse' : 'bg-blue-100'}`}
                      ></div>
                      <span className="text-xs font-bold text-blue-950 uppercase tracking-tight group-hover/user:text-teal-600 transition-colors">
                        {user}
                      </span>
                    </div>
                    {i === 0 && <ShieldCheck size={16} className="text-blue-950/30" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-10 bg-blue-50/50 border-t border-teal-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-teal-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-950/20 uppercase tracking-widest">
              Connected
            </span>
          </div>
          <button className="text-[10px] font-bold text-blue-950/20 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2 group">
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Leave
            Module
          </button>
        </div>
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col bg-white rounded-[40px] shadow-2xl shadow-teal-100 border border-teal-50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-950"></div>

        {/* Top Nav (Mobile & Desktop) */}
        <div className="h-24 flex items-center justify-between px-10 border-b border-teal-50 bg-white/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-950 p-3.5 rounded-[22px] text-teal-400 shadow-xl shadow-teal-100/50">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-1">
                Transmission Stream
              </p>
              <span className="font-outfit text-3xl font-bold tracking-tight text-blue-950 uppercase">
                General Discussion
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,1)]"></div>
            <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] hidden sm:block">
              8 Members Connected
            </span>
          </div>
        </div>

        {/* Messages Wrapper */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-blue-50/20 scrollbar-none">
          {chatLog.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'} max-w-xl`}
              >
                <div className="flex items-center gap-3 mb-3 px-2">
                  <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                    {msg.sender}
                  </span>
                  {msg.role === 'Faculty' && (
                    <span className="text-[9px] bg-blue-950 text-teal-400 px-3 py-1 rounded-full font-bold uppercase tracking-[0.1em] border border-blue-900 flex items-center gap-2">
                      <ShieldCheck size={10} /> Lead Mentor
                    </span>
                  )}
                </div>
                <div
                  className={`p-7 rounded-[32px] shadow-2xl text-[15px] leading-relaxed transition-all ${
                    msg.sender === 'You'
                      ? 'bg-blue-950 text-white rounded-tr-none shadow-teal-100/50 font-medium'
                      : msg.role === 'Faculty'
                        ? 'bg-white border border-teal-100 text-blue-950 rounded-tl-none shadow-sm'
                        : 'bg-white border border-teal-50 text-blue-950 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] font-bold text-blue-950/20 uppercase tracking-widest mt-4 px-3">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-10 bg-white border-t border-teal-50 relative z-10">
          <form
            onSubmit={handleSend}
            className="flex items-center bg-blue-50/50 rounded-[30px] p-3 border border-teal-100 group focus-within:ring-4 focus-within:ring-teal-400/10 focus-within:border-teal-400 transition-all duration-300 shadow-inner"
          >
            <button
              type="button"
              className="p-4 text-blue-300 hover:text-blue-950 transition-colors group/clip"
            >
              <Paperclip size={22} className="group-hover:rotate-12 transition-transform" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Post a query or update to the group..."
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm text-blue-950 font-bold placeholder:text-blue-200"
            />
            <button
              type="submit"
              className="bg-blue-950 text-teal-400 px-6 py-5 rounded-[22px] hover:bg-teal-600 hover:text-white transition-all shadow-2xl active:scale-[0.98] group/send"
            >
              <Send
                size={22}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </form>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none">
            <Waves size={100} className="text-blue-950" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPodChat;
