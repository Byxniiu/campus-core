import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Overview');
  const [activeTab, setActiveTab] = useState('Default');
  const [activeChat, setActiveChat] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // New state for filtering registered students
  const [regFilterEventId, setRegFilterEventId] = useState('');

  const [replyText, setReplyText] = useState('');

  /* ---------------- DATA ---------------- */

  const students = [
    { id: 'STU-1', name: 'Arjun Mehta', course: 'BSc CS', year: '2nd Year', roll: 'CS2041' },
    { id: 'STU-2', name: 'Neha Verma', course: 'BCA', year: '3rd Year', roll: 'BCA3012' },
    { id: 'STU-3', name: 'Rahul Singh', course: 'BTech IT', year: '1st Year', roll: 'IT1055' },
  ];

  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Math Olympiad Prep',
      type: 'Workshop',
      venue: 'Hall A',
      dateTime: '2026-02-10T10:00',
      status: 'Upcoming',
      description: 'Advanced problem-solving.',
      registeredStudents: ['STU-1', 'STU-3'], // Tracks student IDs
    },
    {
      id: 2,
      name: 'Tech Symposium',
      type: 'Conference',
      venue: 'Auditorium',
      dateTime: '2026-03-15T09:00',
      status: 'Upcoming',
      description: 'Annual tech meet.',
      registeredStudents: ['STU-2'],
    },
  ]);

  const counselors = [
    { id: 'C1', name: 'Dr. Sarah Jenkins', specialty: 'Psychology', availability: 'Mon–Fri' },
  ];

  const nonTeachingStaff = [
    { id: 'N1', name: 'Ramesh Kumar', role: 'Lab Assistant', availability: 'Mon–Fri' },
  ];

  const podcasts = [{ id: 'POD-101', title: 'Advanced Calculus Theory' }];

  const [chatHistory, setChatHistory] = useState({
    'POD-101': [{ id: 1, msg: 'Will this be on exam?', isFaculty: false }],
  });

  const [eventForm, setEventForm] = useState({
    name: '',
    type: '',
    venue: '',
    dateTime: '',
    status: 'Upcoming',
    description: '',
  });

  /* ---------------- HANDLERS ---------------- */

  const handleCreateEvent = (e) => {
    e.preventDefault();
    setEvents([{ ...eventForm, id: Date.now(), registeredStudents: [] }, ...events]);
    setEventForm({
      name: '',
      type: '',
      venue: '',
      dateTime: '',
      status: 'Upcoming',
      description: '',
    });
    setActiveTab('EventList');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText || !activeChat) return;
    setChatHistory({
      ...chatHistory,
      [activeChat.id]: [
        ...(chatHistory[activeChat.id] || []),
        { id: Date.now(), msg: replyText, isFaculty: true },
      ],
    });
    setReplyText('');
  };

  // Helper to get students for a specific event
  const getStudentsForEvent = (eventId) => {
    const event = events.find((e) => e.id === parseInt(eventId));
    if (!event) return [];
    return students.filter((s) => event.registeredStudents.includes(s.id));
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('faculty_refresh_token');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('faculty_token');
      localStorage.removeItem('faculty_refresh_token');
      localStorage.removeItem('faculty_user');
      toast.success('Session terminated successfully');
      navigate('/faculty-login');
    }
  };

  /* ================== UI ================== */

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-72 bg-slate-800 p-4 flex flex-col gap-1 overflow-y-auto">
        <div className="mb-6 px-4">
          <h1 className="text-xl font-black text-indigo-400">FACULTY PORTAL</h1>
        </div>

        <SidebarButton
          icon="📊"
          label="Dashboard"
          active={activePage === 'Overview' && activeTab === 'Default'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('Default');
          }}
        />

        <div className="my-2 border-t border-slate-700" />

        <SidebarButton
          icon="🎓"
          label="Students"
          active={activeTab === 'Students'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('Students');
          }}
        />

        <SidebarButton
          icon="🧠"
          label="Counselors"
          active={activeTab === 'Counselors'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('Counselors');
          }}
        />

        <SidebarButton
          icon="🧑‍💼"
          label="Staff"
          active={activeTab === 'NonTeachingStaff'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('NonTeachingStaff');
          }}
        />

        <div className="my-2 border-t border-slate-700" />
        <p className="px-4 text-[10px] uppercase font-bold text-slate-500 mb-2">
          Events Management
        </p>

        <SidebarButton
          icon="📅"
          label="Create Event"
          active={activeTab === 'EventCreating'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('EventCreating');
          }}
        />

        <SidebarButton
          icon="📋"
          label="Event List"
          active={activeTab === 'EventList'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('EventList');
          }}
        />

        {/* NEW FEATURE BUTTON */}
        <SidebarButton
          icon="👥"
          label="Registered Students"
          active={activeTab === 'RegisteredStudents'}
          onClick={() => {
            setActivePage('Overview');
            setActiveTab('RegisteredStudents');
          }}
        />

        <div className="mt-6">
          <p className="px-4 text-[10px] uppercase font-bold text-slate-500 mb-2">Messages</p>
          {podcasts.map((p) => (
            <SidebarButton
              key={p.id}
              icon="🎙"
              label={p.title}
              small
              active={activePage === 'Messages' && activeChat?.id === p.id}
              onClick={() => {
                setActivePage('Messages');
                setActiveChat(p);
              }}
            />
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-slate-700">
          <SidebarButton icon="🚪" label="Logout Session" onClick={handleLogout} danger />
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activePage === 'Overview' && (
          <>
            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <StatCard
                title="Total Students"
                val={students.length}
                icon="🎓"
                onClick={() => setActiveTab('Students')}
              />
              <StatCard
                title="Active Events"
                val={events.length}
                icon="📅"
                onClick={() => setActiveTab('EventList')}
              />
              <StatCard
                title="Event Registry"
                val="View"
                icon="👥"
                onClick={() => setActiveTab('RegisteredStudents')}
              />
            </div>

            {/* Existing Tabs Logic... */}
            {activeTab === 'Students' && (
              <Grid>
                {students.map((s) => (
                  <Card
                    key={s.id}
                    title={s.name}
                    sub={s.course}
                    onClick={() => setSelectedStudent(s)}
                  />
                ))}
              </Grid>
            )}

            {/* ----------- REGISTERED STUDENTS SCREEN ----------- */}
            {activeTab === 'RegisteredStudents' && (
              <div className="space-y-6">
                <div className="bg-slate-800 p-6 rounded-3xl border border-indigo-500/30">
                  <h3 className="text-xl font-black mb-4">Event Attendance & Registry</h3>
                  <select
                    className="w-full max-w-md p-3 rounded-xl bg-slate-700 border-none outline-none focus:ring-2 ring-indigo-500"
                    value={regFilterEventId}
                    onChange={(e) => setRegFilterEventId(e.target.value)}
                  >
                    <option value="">Select an Event to View Participants</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.status})
                      </option>
                    ))}
                  </select>
                </div>

                {regFilterEventId ? (
                  <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
                    <table className="w-full text-left">
                      <thead className="bg-slate-700/50 text-indigo-400 text-xs uppercase">
                        <tr>
                          <th className="p-4">Roll No</th>
                          <th className="p-4">Student Name</th>
                          <th className="p-4">Course</th>
                          <th className="p-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {getStudentsForEvent(regFilterEventId).map((student) => (
                          <tr key={student.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-4 font-mono">{student.roll}</td>
                            <td className="p-4 font-bold">{student.name}</td>
                            <td className="p-4 text-slate-400">{student.course}</td>
                            <td className="p-4">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {getStudentsForEvent(regFilterEventId).length === 0 && (
                      <div className="p-10 text-center text-slate-500 italic">
                        No students registered for this event yet.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
                    <p className="text-slate-500">
                      Please select an event from the dropdown above to view registered students.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Rest of the Tabs (Counselors, Staff, EventList, EventCreating)... */}
            {activeTab === 'Counselors' && (
              <Grid>
                {counselors.map((c) => (
                  <Card
                    key={c.id}
                    title={c.name}
                    sub={c.specialty}
                    onClick={() => setSelectedCounselor(c)}
                  />
                ))}
              </Grid>
            )}
            {activeTab === 'NonTeachingStaff' && (
              <Grid>
                {nonTeachingStaff.map((s) => (
                  <Card
                    key={s.id}
                    title={s.name}
                    sub={s.role}
                    onClick={() => setSelectedStaff(s)}
                  />
                ))}
              </Grid>
            )}
            {activeTab === 'EventList' && (
              <Grid>
                {events.map((e) => (
                  <Card
                    key={e.id}
                    title={e.name}
                    sub={e.status}
                    onClick={() => setSelectedEvent(e)}
                  />
                ))}
              </Grid>
            )}
            {activeTab === 'EventCreating' && (
              <form
                onSubmit={handleCreateEvent}
                className="max-w-2xl bg-slate-800 p-8 rounded-3xl space-y-4"
              >
                <h3 className="text-xl font-black uppercase mb-4">Create New Event</h3>
                <input
                  required
                  placeholder="Event Name"
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                />
                <select
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={eventForm.type || ''}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  required
                >
                  <option value="">Select Event Type</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Competition">Competition</option>
                  <option value="Conference">Conference</option>
                </select>
                <input
                  placeholder="Venue / Location"
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  required
                />
                <input
                  type="datetime-local"
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={eventForm.dateTime}
                  onChange={(e) => setEventForm({ ...eventForm, dateTime: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Event Description"
                  className="w-full p-3 rounded-xl bg-slate-700 min-h-[100px]"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
                <button className="bg-indigo-600 w-full py-3 rounded-xl font-black uppercase tracking-wide">
                  Publish Event
                </button>
              </form>
            )}
          </>
        )}

        {/* CHAT SCREEN (Remains Unchanged) */}
        {activePage === 'Messages' && activeChat && (
          <div className="flex flex-col h-full max-w-3xl mx-auto">
            <h2 className="font-black text-xl mb-4">{activeChat.title}</h2>
            <div className="flex-1 bg-slate-800 p-4 rounded-xl overflow-y-auto space-y-2">
              {(chatHistory[activeChat.id] || []).map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl max-w-[70%] ${m.isFaculty ? 'ml-auto bg-indigo-600' : 'bg-slate-700'}`}
                >
                  {m.msg}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-slate-700 p-3 rounded-xl"
                placeholder="Type reply…"
              />
              <button className="bg-indigo-600 px-6 rounded-xl font-black">Send</button>
            </form>
          </div>
        )}
      </main>

      {/* MODALS (Remaining same) */}
      {selectedStudent && (
        <ProfileModal
          title={selectedStudent.name}
          onClose={() => setSelectedStudent(null)}
          lines={[
            ['Roll', selectedStudent.roll],
            ['Course', selectedStudent.course],
            ['Year', selectedStudent.year],
          ]}
        />
      )}
      {selectedCounselor && (
        <ProfileModal
          title={selectedCounselor.name}
          onClose={() => setSelectedCounselor(null)}
          lines={[
            ['Specialty', selectedCounselor.specialty],
            ['Availability', selectedCounselor.availability],
          ]}
        />
      )}
      {selectedStaff && (
        <ProfileModal
          title={selectedStaff.name}
          onClose={() => setSelectedStaff(null)}
          lines={[
            ['Role', selectedStaff.role],
            ['Availability', selectedStaff.availability],
          ]}
        />
      )}
      {selectedEvent && (
        <ProfileModal
          title={selectedEvent.name}
          onClose={() => setSelectedEvent(null)}
          lines={[
            ['Type', selectedEvent.type],
            ['Venue', selectedEvent.venue],
            ['Date & Time', selectedEvent.dateTime],
            ['Status', selectedEvent.status],
            ['Description', selectedEvent.description],
          ]}
        />
      )}
    </div>
  );
};

/* --- REUSABLE COMPONENTS REMAIN THE SAME --- */
const Grid = ({ children }) => <div className="grid md:grid-cols-3 gap-4">{children}</div>;
const Card = ({ title, sub, onClick }) => (
  <div
    onClick={onClick}
    className="bg-slate-800 p-6 rounded-3xl cursor-pointer hover:border-indigo-500 border border-slate-700 transition-all"
  >
    <h4 className="font-black">{title}</h4>
    <p className="text-xs text-indigo-400 uppercase">{sub}</p>
  </div>
);
const StatCard = ({ title, val, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-slate-800 p-6 rounded-3xl cursor-pointer border border-slate-700 hover:border-indigo-500 transition-all group"
  >
    <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-xs uppercase text-slate-400">{title}</p>
    <p className="text-2xl font-black">{val}</p>
  </div>
);
const ProfileModal = ({ title, lines, onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-slate-800 p-8 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl"
    >
      <h3 className="text-xl font-black mb-4 text-indigo-400 uppercase tracking-tight">{title}</h3>
      <div className="space-y-2">
        {lines.map(([k, v]) => (
          <p key={k} className="text-sm">
            <b className="text-slate-400 mr-2">{k}:</b> {v}
          </p>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);
const SidebarButton = ({ icon, label, active, onClick, small, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
    ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        : danger
          ? 'text-rose-400 hover:bg-rose-500/10'
          : 'text-slate-400 hover:bg-slate-700'
    }
    ${small ? 'text-xs' : 'text-sm font-medium'}`}
  >
    <span className="text-lg">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

export default FacultyDashboard;
