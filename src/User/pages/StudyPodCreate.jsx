import React, { useState } from 'react';

const StudyPodCreate = ({ isOpen, onClose }) => {
  const [podName, setPodName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([
    { id: 101, name: 'Dr. Aris (Faculty)', role: 'Faculty' }
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
    if (!selectedMembers.find(m => m.id === person.id)) {
      setSelectedMembers([...selectedMembers, person]);
    }
    setSearchMember('');
  };

  const removeMember = (id) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== id));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    // Logic to save the pod would go here
    console.log("Creating Pod:", { podName, selectedMembers });
    alert(`Study Pod "${podName}" has been created!`);
    onClose(); // Close modal after creation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create Study Pod</h2>
            <p className="text-sm text-slate-500 font-medium">Setup a new collaborative learning space.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 shadow-sm transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="p-8 space-y-5" onSubmit={handleCreate}>
          {/* Pod Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pod Name</label>
            <input 
              type="text" 
              required
              value={podName}
              onChange={(e) => setPodName(e.target.value)}
              placeholder="e.g. Data Structures Workshop" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Category</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer">
              <option>Engineering Mathematics</option>
              <option>Computer Science</option>
              <option>Applied Physics</option>
              <option>Medicine & Surgery</option>
            </select>
          </div>

          {/* Add Members/Faculty Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Invite Students & Faculty</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Type a name..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
              
              {/* Dynamic Suggestions List */}
              {searchMember && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                  {suggestions
                    .filter(p => p.name.toLowerCase().includes(searchMember.toLowerCase()))
                    .map(person => (
                    <button 
                      key={person.id}
                      type="button"
                      onClick={() => addMember(person)}
                      className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex justify-between items-center border-b border-slate-50 last:border-0 transition"
                    >
                      <span className="text-sm font-medium text-slate-700">{person.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        person.role === 'Faculty' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {person.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Members Grid */}
            <div className="flex flex-wrap gap-2 mt-4 max-h-24 overflow-y-auto p-1">
              {selectedMembers.map(member => (
                <div key={member.id} className="flex items-center bg-white text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-200 shadow-sm">
                  <span className={`w-2 h-2 rounded-full mr-2 ${member.role === 'Faculty' ? 'bg-purple-400' : 'bg-indigo-400'}`}></span>
                  {member.name}
                  <button type="button" onClick={() => removeMember(member.id)} className="ml-2 text-slate-400 hover:text-red-500 transition">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 pt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition active:scale-95"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
            >
              Launch Pod
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyPodCreate;