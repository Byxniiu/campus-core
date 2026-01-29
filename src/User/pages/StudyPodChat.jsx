import React, { useState, useRef, useEffect } from 'react';

const StudyPodChat = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { id: 1, sender: 'Dr. Aris', role: 'Faculty', text: "Welcome everyone! Let's focus on the integration rules today.", time: '10:00 AM' },
    { id: 2, sender: 'Sarah Miller', role: 'Student', text: "Thanks, Dr. Aris. I'm having trouble with the substitution method.", time: '10:02 AM' },
    { id: 3, sender: 'James Wilson', role: 'Student', text: "Me too! Can we look at the exercise on page 42?", time: '10:03 AM' },
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatLog([...chatLog, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-slate-50 p-2 md:p-6 font-sans">
      <div className="max-w-7xl w-full mx-auto bg-white rounded-3xl shadow-xl flex overflow-hidden border border-slate-200">
        
        {/* Left Sidebar - Pod Info & Resources */}
        <div className="hidden lg:flex flex-col w-72 bg-slate-50/50 border-r border-slate-100">
          <div className="p-6">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Current Pod</h2>
            <h1 className="text-xl font-black text-slate-800 leading-tight">Advanced Mathematics</h1>
            <p className="text-xs text-slate-500 mt-2">8 Members • 1 Faculty Online</p>
          </div>

          <div className="px-6 py-4 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Study Resources
              </h3>
              <ul className="space-y-2">
                <li className="text-xs p-2 bg-white rounded-lg border border-slate-200 text-slate-600 cursor-pointer hover:border-indigo-300 transition">Calculus_CheatSheet.pdf</li>
                <li className="text-xs p-2 bg-white rounded-lg border border-slate-200 text-slate-600 cursor-pointer hover:border-indigo-300 transition">Assignment_Week4.docx</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Participants</h3>
              <div className="space-y-3">
                {['Dr. Aris', 'Sarah Miller', 'James Wilson', 'You'].map((user, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-medium text-slate-600">{user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Top Nav */}
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
              </div>
              <span className="font-bold text-slate-800">General Discussion</span>
            </div>
            <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Leave Pod</button>
          </div>

          {/* Messages Wrapper */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
            {chatLog.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-500">{msg.sender}</span>
                    {msg.role === 'Faculty' && (
                      <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-black uppercase">Faculty</span>
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'You' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : msg.role === 'Faculty' 
                      ? 'bg-white border-2 border-purple-200 text-slate-800 rounded-tl-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center bg-slate-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
              <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
              </button>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question or share a thought..." 
                className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-slate-700"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudyPodChat;