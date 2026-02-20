import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Users,
  MessageSquare,
  Waves,
  Anchor,
  Radio,
  Globe,
  Hash,
  Wifi,
  WifiOff,
  Send,
  X,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupsAPI } from '../../../api/groups';
import { useStudentAuthStore } from '../../../stores/useStudentAuthStore';
import { useSocketStore } from '../../../stores/useSocketStore';
import toast from 'react-hot-toast';

const GroupsTab = () => {
  const { user, token } = useStudentAuthStore();
  const { socket, isConnected } = useSocketStore();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const chatBottomRef = useRef(null);
  const typingTimerRef = useRef({});

  // Variants removed for being unused after UI refactor

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const enterGroup = useCallback(
    async (groupId) => {
      setActiveGroupId(groupId);
      setChatMessages([]);
      setChatLoading(true);
      setTypingUsers([]);
      try {
        const isForum = groupId === 'DEPT_FORUM';
        const res = isForum
          ? await groupsAPI.getDeptForumHistory()
          : await groupsAPI.getGroupHistory(groupId);

        if (res.success) {
          setChatMessages(res.data.messages || []);
          if (!isForum) {
            socket?.emit('faculty:join-group', { groupId });
          }
        }
      } catch (err) {
        console.error('Enter group error:', err);
        toast.error('Failed to load history');
      } finally {
        setChatLoading(false);
      }
    },
    [socket]
  );

  // ── Fetch Groups ───────────────────────────────────────────────────────────
  const fetchGroups = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await groupsAPI.getMyGroups();
      if (res.success) {
        // Only list the groups where the student is actually present (member)
        setGroups(res.data.groups || []);
      } else {
        toast.error(res.message || 'Transmission failed');
      }
    } catch (err) {
      console.error('Fetch groups error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Network anomaly detected';
      toast.error(`Groups Offline: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Socket connection is now handled in StudentHomePage.jsx

  // ── Socket Listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleMsg = (msg) => {
      if (msg.group === activeGroupId) {
        setChatMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      // Update group preview
      if (msg.group) {
        setGroups((prev) =>
          prev.map((g) =>
            g._id === msg.group
              ? { ...g, lastMessage: { content: msg.content, sentAt: msg.createdAt } }
              : g
          )
        );
      }
    };

    const handleTyping = ({ groupId, userName, userId }) => {
      if (activeGroupId === groupId && userId !== user?._id) {
        setTypingUsers((prev) => (prev.includes(userName) ? prev : [...prev, userName]));
        clearTimeout(typingTimerRef.current[userId]);
        typingTimerRef.current[userId] = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((n) => n !== userName));
        }, 3000);
      }
    };

    socket.on('faculty:group-message', handleMsg);
    socket.on('faculty:dept-message', handleMsg);
    socket.on('faculty:group-typing', handleTyping);

    return () => {
      socket.off('faculty:group-message', handleMsg);
      socket.off('faculty:dept-message', handleMsg);
      socket.off('faculty:group-typing', handleTyping);
    };
  }, [socket, activeGroupId, user?._id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket || !isConnected) return;

    socket.emit('faculty:group-message', {
      groupId: activeGroupId,
      content: chatInput.trim(),
    });
    socket.emit('faculty:group-typing-stop', { groupId: activeGroupId });
    setChatInput('');
  };

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
    if (socket && isConnected) {
      socket.emit('faculty:group-typing-start', { groupId: activeGroupId });
    }
  };

  // ── Render Helpers ───────────────────────────────────────────────────────
  if (activeGroupId) {
    const activeGroup = groups.find((g) => g._id === activeGroupId);
    return (
      <div className="h-[calc(100vh-250px)] bg-white rounded-[40px] border border-teal-50 shadow-2xl shadow-teal-100/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Chat Header */}
        <header className="p-6 bg-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveGroupId(null)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="text-lg font-outfit font-bold uppercase tracking-tight">
                {activeGroup?.name}
              </h3>
              <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                Led by Faculty • {activeGroup?.members?.length || 0} Members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-teal-400 animate-pulse' : 'bg-slate-500'}`}
            ></div>
            <span className="text-[9px] font-black uppercase tracking-widest">
              {isConnected ? 'Sync Active' : 'Offline'}
            </span>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
          {chatLoading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Hydrating History...
              </p>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 grayscale">
              <MessageSquare size={64} className="mb-6" />
              <p className="text-sm font-black uppercase tracking-[0.3em]">Void Interface</p>
              <p className="text-[9px] font-bold mt-2">Initialize the conversation below</p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const senderId = (msg.sender?._id || msg.sender?.id)?.toString();
              const myId = (user?._id || user?.id)?.toString();
              const isMine = senderId === myId;

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  {!isMine && (
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">
                      {msg.sender?.firstName} {msg.sender?.lastName} •{' '}
                      {msg.sender?.role === 'faculty' ? 'Faculty' : 'Student'}
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                      isMine
                        ? 'bg-blue-950 text-teal-50 rounded-tr-none'
                        : 'bg-white text-blue-950 border border-teal-50 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[8px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          )}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="flex gap-1">
                <div
                  className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
              <span className="text-[9px] font-black text-teal-600 uppercase italic tracking-widest">
                {typingUsers.join(', ')} typing...
              </span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-6 bg-white border-t border-teal-50">
          <div className="flex gap-4 p-2 bg-slate-50 rounded-3xl border border-slate-100 focus-within:ring-4 ring-teal-500/10 transition-all">
            <input
              placeholder="Inject message into the grid..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-bold text-blue-950 placeholder:text-slate-300"
              value={chatInput}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || !isConnected}
              className="w-12 h-12 bg-blue-950 text-teal-400 rounded-2xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all active:scale-90 disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative overflow-hidden font-jakarta animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-950 p-2.5 rounded-xl border border-blue-900 shadow-xl shadow-teal-100/50">
              <Globe size={18} className="text-teal-400" />
            </div>
            <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
              Academic Matrix
            </span>
          </div>
          <h2 className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
            Learning <span className="text-teal-500">Groups</span>
          </h2>
          <p className="text-blue-950/40 font-medium text-lg mt-5 flex items-center gap-3 uppercase shrink-0">
            <Waves size={16} className="text-teal-400" /> Official Departmental Communication
            Channels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-white rounded-[40px] border border-teal-50 animate-pulse flex flex-col items-center justify-center p-10"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-3xl mb-10"></div>
                <div className="w-3/4 h-6 bg-slate-100 rounded-full mb-4"></div>
                <div className="w-1/2 h-4 bg-slate-100 rounded-full"></div>
              </div>
            ))
          : groups.map((group) => (
              <motion.div
                key={group._id}
                whileHover={{ y: -10 }}
                onClick={() => enterGroup(group._id)}
                className="group bg-white p-10 rounded-[40px] border border-teal-100 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:shadow-teal-100/30 hover:border-teal-400 cursor-pointer transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-50/50 group-hover:bg-blue-950 transition-colors"></div>

                {group.isForum && (
                  <div className="absolute top-6 right-6 flex items-center gap-2 bg-teal-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20">
                    <Globe size={10} /> Forum
                  </div>
                )}

                <motion.div
                  whileHover={{ rotate: 6 }}
                  className="w-24 h-24 bg-blue-50/50 rounded-[32px] group-hover:bg-blue-950 flex items-center justify-center font-bold text-3xl text-teal-600 group-hover:text-teal-400 border border-teal-50 group-hover:border-blue-950 transition-all duration-500 mb-10 shadow-inner"
                >
                  {group.name[0]}
                </motion.div>

                <div className="space-y-4">
                  <h3 className="font-outfit font-bold text-2xl text-blue-950 group-hover:text-teal-600 transition-colors tracking-tight mb-3 px-4 uppercase truncate max-w-full">
                    {group.name}
                  </h3>
                  <div className="flex items-center justify-center gap-4 bg-blue-50/50 px-6 py-2.5 rounded-full border border-teal-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-950/40 uppercase tracking-[0.1em]">
                      <Users size={12} className="text-teal-400" /> {group.members?.length || 0}
                    </div>
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-[0.1em]">
                      <Radio size={12} className="animate-pulse" /> Active
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase truncate">
                    {group.lastMessage?.content || 'Awaiting transmission...'}
                  </p>
                </div>

                <div className="w-full mt-10 pt-10 border-t border-teal-50 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-blue-950 text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/10 transition-all group/btn"
                  >
                    <MessageSquare
                      size={16}
                      className="text-teal-400 group-hover/btn:rotate-12 transition-transform"
                    />{' '}
                    Establish Uplink
                  </motion.button>
                </div>
              </motion.div>
            ))}

        {groups.length === 0 && !loading && (
          <motion.div
            variants={itemVariants}
            className="col-span-full py-20 bg-white rounded-[60px] border-2 border-dashed border-teal-100 flex flex-col items-center justify-center grayscale opacity-50"
          >
            <Anchor size={80} className="text-slate-200 mb-8" />
            <p className="text-lg font-outfit font-black text-blue-950 uppercase tracking-[0.2em]">
              No Network Nodes Detected
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
              Awaiting departmental group assignment by faculty
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GroupsTab;
