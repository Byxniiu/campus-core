import React, { useState } from 'react';

const CounselingChat = () => {
  const [message, setMessage] = useState('');

  const chatHistory = [
    { id: 1, sender: 'counselor', text: 'Hello! How are you feeling today?', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'I have been feeling a bit overwhelmed with work lately.', time: '10:02 AM' },
    { id: 3, sender: 'counselor', text: 'I understand. Let’s talk about what specifically feels heavy right now.', time: '10:03 AM' },
  ];

  // SVG Components (No installation required)
  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  );

  const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  );

  return (
    <div className="flex h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-xl flex overflow-hidden border border-slate-200">
        
        {/* Sidebar - Contacts */}
        <div className="hidden md:flex flex-col w-80 border-r border-slate-100 bg-slate-50/50">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 bg-indigo-50 border-r-4 border-indigo-600 flex items-center space-x-4 cursor-pointer">
              <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">SJ</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Dr. Sarah Jenkins</p>
                <p className="text-xs text-indigo-600 font-medium">Online</p>
              </div>
            </div>
            {/* Mock other contacts */}
            <div className="p-4 flex items-center space-x-4 opacity-60 grayscale cursor-not-allowed">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">MR</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Support Group</p>
                <p className="text-xs text-slate-500 font-medium">Offline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center space-x-4">
              <div className="md:hidden w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">SJ</div>
              <div>
                <h3 className="font-bold text-slate-800">Dr. Sarah Jenkins</h3>
                <p className="text-xs text-slate-500">Typical response: 5 mins</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <PhoneIcon />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 mt-2 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100">
            <form 
              className="flex items-center space-x-3" 
              onSubmit={(e) => { e.preventDefault(); setMessage(''); }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-slate-100 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-lg flex items-center justify-center"
              >
                <SendIcon />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-3 italic">
              All conversations are encrypted and confidential.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CounselingChat;