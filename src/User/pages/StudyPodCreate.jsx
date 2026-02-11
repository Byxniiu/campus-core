import React, { useState } from 'react';
import {
  X,
  Plus,
  Search,
  Check,
  ShieldCheck,
  UserPlus,
  HardDrive,
  Waves,
  Anchor,
  Radio,
} from 'lucide-react';

const StudyPodCreate = ({ isOpen, onClose }) => {
  const [podName, setPodName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([
    { id: 101, name: 'Dr. Aris (Faculty)', role: 'Faculty' },
  ]);
  const [searchMember, setSearchMember] = useState('');

  // Mock suggestion list for the "Search and Add" feature
  const suggestions = [
    { id: 1, name: 'Sarah Miller', role: 'Student' },
    { id: 2, name: 'Prof. Robert Fox', role: 'Faculty' },
    { id: 3, name: 'James Wilson', role: 'Student' },
    { id: 4, name: 'Dr. Elena Vance', role: 'Faculty' },
  ];

  const addMember = (person) => {
    if (!selectedMembers.find((m) => m.id === person.id)) {
      setSelectedMembers([...selectedMembers, person]);
    }
    setSearchMember('');
  };

  const removeMember = (id) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== id));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    // Logic to save the pod would go here
    console.log('Creating Pod:', { podName, selectedMembers });
    onClose(); // Close modal after creation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-md transition-all duration-300 font-jakarta">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-5 duration-500 border border-teal-50 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-950"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/10 rounded-full blur-3xl -z-0"></div>

        {/* Modal Header */}
        <div className="px-10 py-12 flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-950 p-2.5 rounded-xl text-teal-400 shadow-lg shadow-teal-100/50">
                <Plus size={18} />
              </div>
              <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                Protocol initialization
              </span>
            </div>
            <h2 className="text-5xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              New Study <span className="text-teal-500">Pod</span>
            </h2>
            <p className="text-blue-950/60 text-sm font-medium mt-4 leading-relaxed">
              Configure a new high-density learning module for collective mastery within the campus
              network.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-4 hover:bg-red-50 rounded-2xl text-blue-200 hover:text-red-500 transition-all active:scale-95 border border-transparent hover:border-red-100 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <form className="px-10 pb-10 space-y-8 relative z-10" onSubmit={handleCreate}>
          {/* Pod Name */}
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] ml-1">
              Pod Identity
            </label>
            <div className="relative group">
              <input
                type="text"
                required
                value={podName}
                onChange={(e) => setPodName(e.target.value)}
                placeholder="e.g. Advanced Calculus Collective"
                className="w-full px-8 py-5 bg-blue-50/50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all placeholder:text-blue-200 font-bold text-blue-950 shadow-inner"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-teal-400/30">
                <Waves size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Dropdown */}
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] ml-1">
                Core Subject
              </label>
              <div className="relative">
                <select className="w-full px-8 py-5 bg-blue-50/50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all cursor-pointer font-bold text-blue-950 appearance-none shadow-inner pr-12">
                  <option>Engineering Mathematics</option>
                  <option>Computer Science</option>
                  <option>Applied Physics</option>
                  <option>Medicine & Surgery</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-teal-500">
                  <Anchor size={16} />
                </div>
              </div>
            </div>

            {/* Data Limit / Security Toggle Mockup */}
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] ml-1">
                Module Security
              </label>
              <div className="w-full px-8 py-5 bg-blue-50/30 border border-teal-50 rounded-[24px] flex items-center justify-between shadow-inner">
                <span className="text-[10px] font-bold text-blue-950/60 uppercase tracking-widest leading-none">
                  Verified Only
                </span>
                <ShieldCheck size={20} className="text-teal-400" />
              </div>
            </div>
          </div>

          {/* Add Members Section */}
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] ml-1">
              Invite Members & Mentors
            </label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-teal-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search student or faculty identity..."
                className="w-full pl-16 pr-8 py-5 bg-blue-50/50 border border-teal-50 rounded-[24px] focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none transition-all placeholder:text-blue-200 font-bold text-blue-950 shadow-inner"
              />

              {/* Dynamic Suggestions List */}
              {searchMember && (
                <div className="absolute bottom-full left-0 right-0 mb-4 bg-white border border-teal-50 rounded-[30px] shadow-2xl z-[70] overflow-hidden p-2 animate-in fade-in slide-in-from-bottom-2">
                  {suggestions
                    .filter((p) => p.name.toLowerCase().includes(searchMember.toLowerCase()))
                    .map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => addMember(person)}
                        className="w-full p-4 text-left hover:bg-blue-50/50 rounded-2xl flex justify-between items-center transition-all group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-950 border-2 border-teal-400/20 group-hover/item:border-teal-400 group-hover/item:bg-blue-950 group-hover/item:text-teal-400 transition-all">
                            {person.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-blue-950 uppercase tracking-tight">
                            {person.name}
                          </span>
                        </div>
                        <span
                          className={`text-[8px] px-3 py-1.5 rounded-full font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${
                            person.role === 'Faculty'
                              ? 'bg-blue-950 text-teal-400'
                              : 'bg-blue-50 text-blue-950/40'
                          }`}
                        >
                          <Radio
                            size={10}
                            className={person.role === 'Faculty' ? 'animate-pulse' : ''}
                          />{' '}
                          {person.role}
                        </span>
                      </button>
                    ))}
                  {suggestions.filter((p) =>
                    p.name.toLowerCase().includes(searchMember.toLowerCase())
                  ).length === 0 && (
                    <div className="p-6 text-center text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em]">
                      No matching identities found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Members Grid */}
            <div className="flex flex-wrap gap-3 mt-4">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="group/tag flex items-center gap-3 bg-white text-blue-950 pl-4 pr-2 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-teal-50 shadow-sm hover:border-teal-300 hover:bg-blue-50 transition-all"
                >
                  <div
                    className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)] ${member.role === 'Faculty' ? 'bg-teal-400 animate-pulse' : 'bg-blue-300'}`}
                  ></div>
                  <span>{member.name}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="p-1.5 hover:bg-red-50 text-blue-200 hover:text-red-500 rounded-lg transition-all group-hover/tag:scale-110"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 pt-10 border-t border-teal-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] text-blue-950/30 hover:bg-red-50 hover:text-red-500 transition-all active:scale-[0.98]"
            >
              Cancel initialization
            </button>
            <button
              type="submit"
              className="flex-[2] px-8 py-5 bg-blue-950 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] text-white shadow-2xl shadow-teal-100/50 hover:bg-teal-600 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
              <span>Initialize Pod Launch</span>
              <UserPlus
                size={18}
                className="text-teal-400 group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyPodCreate;
