import React, { useState, useRef } from 'react';

const AdminCoreDashboard = () => {
  const [activePage, setActivePage] = useState('Overview');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dept: '',
    mobile: '',
    profilePic: null,
  });
  const fileInputRef = useRef(null);

  // --- CENTRAL STATE ---
  const [data, setData] = useState({
    students: [
      {
        id: 'STU-9001',
        name: 'Alex Rivera',
        category: 'CS Engineering',
        isBlocked: false,
        mobile: '9876543210',
        email: 'alex@edu.com',
        isPresent: true,
        profilePic: null,
      },
    ],
    faculties: [
      {
        id: 'FAC-7002',
        name: 'Dr. Aris',
        category: 'Mathematics',
        isBlocked: false,
        mobile: '9123456780',
        email: 'aris@edu.com',
        isPresent: true,
        profilePic: null,
      },
    ],
    counsellors: [
      {
        id: 'COUN-4003',
        name: 'Sarah Jenkins',
        category: 'Clinical',
        isBlocked: false,
        mobile: '9445566770',
        email: 'sarah@edu.com',
        isPresent: false,
        profilePic: null,
      },
    ],
    staff_details: [
      {
        id: 'STAFF-1004',
        name: 'Michael Scott',
        category: 'Administration',
        isBlocked: false,
        mobile: '9001122334',
        email: 'scott@edu.com',
        isPresent: true,
        profilePic: null,
      },
    ],
  });

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- FORM SUBMISSION ---
  const handleIssueID = (e) => {
    e.preventDefault();
    let targetListKey =
      activePage === 'create_faculty'
        ? 'faculties'
        : activePage === 'create_counsellor'
          ? 'counsellors'
          : 'staff_details';
    const idPrefix = activePage.split('_')[1].toUpperCase();

    const newEntry = {
      id: `${idPrefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      category: formData.dept || 'General',
      isBlocked: false,
      mobile: formData.mobile || 'Not Provided',
      email: formData.email,
      isPresent: true,
      profilePic: formData.profilePic, // Store the base64 image
    };

    setData((prev) => ({ ...prev, [targetListKey]: [newEntry, ...prev[targetListKey]] }));
    setFormData({ name: '', email: '', dept: '', mobile: '', profilePic: null });
    setActivePage(targetListKey);
  };

  const toggleBlock = (id, listKey) => {
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) =>
        item.id === id ? { ...item, isBlocked: !item.isBlocked } : item
      ),
    }));
  };

  const formatSidebarLabel = (key) =>
    key === 'staff_details' ? 'NON-TEACHING STAFF' : key.toUpperCase();

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-slate-700 text-center">
          <h1 className="text-xl font-black tracking-widest text-white italic">CAMPUS CORE</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 mt-4">
          <div>
            <h3 className="text-[10px] text-slate-500 uppercase font-black px-4 mb-2 tracking-widest">
              Directories
            </h3>
            {Object.keys(data).map((key) => (
              <button
                key={key}
                onClick={() => setActivePage(key)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all mb-1 ${activePage === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
              >
                {formatSidebarLabel(key)} LIST
              </button>
            ))}
            <button
              onClick={() => setActivePage('events')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all ${activePage === 'events' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
              EVENT LIST
            </button>
          </div>
          <div>
            <h3 className="text-[10px] text-slate-500 uppercase font-black px-4 mb-2 tracking-widest">
              ID Generation
            </h3>
            {['create_faculty', 'create_counsellor', 'create_staff'].map((id) => (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all mb-1 ${activePage === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
              >
                + {id.split('_')[1].toUpperCase()} ID
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10 bg-slate-900">
        <header className="mb-10 flex justify-between items-center">
          <h2 className="text-3xl font-black text-white capitalize tracking-tighter">
            {activePage.replace('_', ' ')}
          </h2>
        </header>

        {/* --- LIST VIEW WITH THUMBNAILS --- */}
        {Object.keys(data).includes(activePage) && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-700">
                <tr>
                  <th className="pb-4">Member</th>
                  <th className="pb-4">ID</th>
                  <th className="pb-4">Dept</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-700/50">
                {data[activePage].map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedPerson(item)}
                    className={`group hover:bg-slate-700/30 transition-all cursor-pointer ${item.isBlocked ? 'opacity-40' : ''}`}
                  >
                    <td className="py-4 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-indigo-400">
                        {item.profilePic ? (
                          <img
                            src={item.profilePic}
                            className="w-full h-full object-cover"
                            alt="pfp"
                          />
                        ) : (
                          item.name.charAt(0)
                        )}
                      </div>
                      <span className="font-bold text-white group-hover:text-indigo-400">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-slate-400 text-xs">{item.id}</td>
                    <td className="py-4 text-slate-400">{item.category}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBlock(item.id, activePage);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${item.isBlocked ? 'bg-emerald-600 text-white' : 'bg-red-600/10 text-red-500'}`}
                      >
                        {item.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- REGISTRATION FORM WITH UPLOAD --- */}
        {activePage.startsWith('create_') && (
          <div className="max-w-xl mx-auto bg-slate-800 border border-slate-700 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all overflow-hidden"
              >
                {formData.profilePic ? (
                  <img
                    src={formData.profilePic}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center p-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      Upload Photo
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <form onSubmit={handleIssueID} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Institutional Email"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Number"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white"
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
              >
                <option value="">Assign Dept</option>
                <option>IT Support</option>
                <option>Science</option>
                <option>Clinical</option>
              </select>
              <button className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white">
                Issue ID & Sync
              </button>
            </form>
          </div>
        )}
      </main>

      {/* --- PERSON DETAIL POPUP --- */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-48 bg-slate-700 relative overflow-hidden">
              {selectedPerson.profilePic ? (
                <img
                  src={selectedPerson.profilePic}
                  className="w-full h-full object-cover"
                  alt="Full Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-6xl font-black text-white">
                  {selectedPerson.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-10 pt-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedPerson.name}</h3>
                  <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    {selectedPerson.category}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${selectedPerson.isPresent ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-500 bg-slate-500/10'}`}
                >
                  {selectedPerson.isPresent ? 'Present' : 'Absent'}
                </div>
              </div>
              <div className="p-5 bg-slate-900/60 rounded-[2rem] border border-slate-700/50">
                <p className="text-[10px] text-slate-600 font-black uppercase mb-1">
                  Contact Details
                </p>
                <p className="text-sm font-bold text-white">{selectedPerson.mobile}</p>
                <p className="text-xs text-slate-400">{selectedPerson.email}</p>
              </div>
              <button
                onClick={() => setSelectedPerson(null)}
                className="w-full mt-6 py-5 bg-slate-700 rounded-2xl font-black text-[10px] uppercase text-slate-300"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoreDashboard;
