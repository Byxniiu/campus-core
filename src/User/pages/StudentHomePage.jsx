import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

// --- MOCK DATA (Replace with API calls in a real application) ---

// Mock events based on "Event News & Perzonalised Class" module [cite: 28, 35]
const mockEvents = [
    { id: 1, title: 'Annual Sports Meet', date: 'Dec 15', type: 'Event' },
    { id: 2, title: 'Project Submission Deadline', date: 'Dec 20', type: 'Deadline' },
    { id: 3, title: 'Guest Lecture: AI Ethics', date: 'Dec 22', type: 'Lecture' },
];

// Mock timetable data based on synchronized class timetables [cite: 21, 35]
const mockTimetable = [
    { time: '10:00 AM', subject: 'Data Structures (BSc Computer Science)', location: 'Lab 4' },
    { time: '11:00 AM', subject: 'Web Development', location: 'Classroom 2A' },
    { time: '02:00 PM', subject: 'Free Slot (Study Pods)', location: 'Library' },
];

// --- QUICK ACTION CARD COMPONENT ---

// Component for the Quick Actions section, linking to core modules
const QuickActionCard = ({ title, icon, description, color, link }) => (
    <a 
        href={link} 
        className={`bg-white border-l-4 border-${color}-500 shadow-md p-4 rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] cursor-pointer`}
    >
        <div className="flex items-center">
            <div className={`text-2xl text-${color}-600 mr-4`}>{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </a>
);


// --- MAIN DASHBOARD COMPONENT ---

const StudentHomePage = () => {
    const primaryColor = 'indigo'; // Consistent primary color

    return (
        <div>
            <Header></Header>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            {/* Header / Navbar */}
            

            {/* Welcome Message and Current Date */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800">
                    Welcome back, Student!
                </h2>
                <p className="text-gray-500">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Main Content Grid (Three Columns on Large Screens) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* === COLUMN 1: Events & News (Event News & Perzonalised Class) === */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h3 className={`text-xl font-semibold text-${primaryColor}-600 mb-6 border-b pb-2`}>
                        Events & News 🗓️
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Calendar synchronized news and popups of events coming within the week[cite: 28, 35].
                    </p>
                    <div className="space-y-4">
                        {mockEvents.map(event => (
                            <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <span className={`flex-shrink-0 text-sm font-bold w-12 text-center py-1 rounded ${event.type === 'Event' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {event.date}
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">{event.title}</p>
                                    <p className="text-xs text-gray-500">{event.type}</p>
                                </div>
                            </div>
                        ))}
                        <button className={`w-full text-center text-sm text-${primaryColor}-600 font-medium py-2 rounded-lg hover:bg-${primaryColor}-50 transition`}>
                            View All Events
                        </button>
                    </div>
                </div>

                {/* === COLUMN 2: Personalised Class Timetable (Event News & Perzonalised Class) === */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h3 className={`text-xl font-semibold text-${primaryColor}-600 mb-6 border-b pb-2`}>
                        Today's Personalized Class Timetable 🕰️
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Optimized daily study pods and official class timetables[cite: 21, 35].
                    </p>
                    <div className="space-y-4">
                        {mockTimetable.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg">
                                <span className="font-bold text-gray-800 text-sm flex-shrink-0 w-16">{item.time}</span>
                                <div>
                                    <p className="font-medium text-gray-800">{item.subject}</p>
                                    <p className="text-xs text-gray-500">Location: {item.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={`mt-6 w-full py-2 bg-${primaryColor}-600 text-white font-semibold rounded-lg hover:bg-${primaryColor}-700 transition`}>
                        View Full Timetable
                    </button>
                </div>

                {/* === COLUMN 3: Quick Actions (Core Modules) === */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h3 className={`text-xl font-semibold text-${primaryColor}-600 mb-6 border-b pb-2`}>
                        Quick Actions 🚀
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Access key features for safety and support[cite: 56].
                    </p>

                    <div className="space-y-4">
                        <QuickActionCard
                            title="SOS: Report Disaster"
                            icon="🚨"
                            // [cite_start]description="Send push notifications to faculty/admins for bullying or disasters[cite: 32, 40]."
                            color="red"
                            link="/sos"
                        />
                        <QuickActionCard
                            title="Secure Counselling Request"
                            icon="🔒"
                            // [cite_start]description="Confidential request system with end-to-end encryption[cite: 24, 37]."
                            color="blue"
                            link="/counsel"
                        />
                        <QuickActionCard
                            title="Emergency Assist"
                            icon="🤝"
                            // [cite_start]description="Get assistance from non-teaching staff (for new comers)[cite: 23, 29, 36]."
                            color="orange"
                            link="/assist"
                        />
                        <QuickActionCard
                            title="Study Pods & Connect"
                            icon="💬"
                            // [cite_start]description="Real-time social clustering, chat, and access study materials[cite: 33, 38, 39]."
                            color="green"
                            link="/studypods"
                        />
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
        </div>
    );
};

export default StudentHomePage;