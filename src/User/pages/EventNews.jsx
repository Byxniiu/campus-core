import React from 'react';

// Mock Data for Events
const mockEvents = [
    { id: 1, title: 'BSc CS Project Defense', date: '2025-12-18', time: '10:00 AM', category: 'Academic', color: 'red' },
    { id: 2, title: 'Annual Sports Day', date: '2025-12-22', time: '9:00 AM', category: 'General', color: 'green' },
    { id: 3, title: 'Holiday Break Starts', date: '2025-12-24', time: 'All Day', category: 'Academic', color: 'yellow' },
    { id: 4, title: 'AI Ethics Guest Lecture', date: '2025-12-28', time: '2:00 PM', category: 'Lecture', color: 'blue' },
    { id: 5, title: 'Module Submission Deadline', date: '2026-01-05', time: '11:59 PM', category: 'Academic', color: 'red' },
];

// Helper to render the calendar day (simplified)
const CalendarDay = ({ day, hasEvent, color }) => (
    <div className="text-center p-2 border border-gray-100 cursor-pointer hover:bg-gray-100 transition relative">
        <div className={`text-sm ${hasEvent ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{day}</div>
        {hasEvent && (
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-${color}-500`}></div>
        )}
    </div>
);

const EventCalendarPage = () => {
    const primaryColor = 'indigo';
    
    // Function to determine if a specific date string has an event
    const getDateColor = (day) => {
        const dateString = `2025-12-${day.toString().padStart(2, '0')}`;
        const event = mockEvents.find(e => e.date === dateString);
        return event ? { hasEvent: true, color: event.color } : { hasEvent: false, color: '' };
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bebas tracking-wider text-gray-900">
                    Event Calendar & News
                </h1>
                <p className="text-gray-500">View college-wide events and time-sensitive routes to classes.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Column 1: Full Calendar View (Small on mobile, large on desktop) --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-xl font-semibold text-${primaryColor}-600`}>
                            December 2025
                        </h3>
                        <div className="space-x-2">
                            <button className="text-gray-500 hover:text-gray-700">{"<"}</button>
                            <button className="text-gray-500 hover:text-gray-700">{">"}</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-700 border-b pb-2 mb-2">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {/* Example empty cells for start of month */}
                        {[...Array(3).keys()].map(i => <div key={`empty-${i}`} className="p-2"></div>)}

                        {/* Days 1 to 31 */}
                        {[...Array(31).keys()].map(day => (
                            <CalendarDay key={day} day={day + 1} {...getDateColor(day + 1)} />
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3 text-sm">
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span><span>Academic</span></span>
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span><span>General</span></span>
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span><span>Lecture</span></span>
                    </div>
                </div>

                {/* --- Column 2: Upcoming Events List --- */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h3 className={`text-xl font-semibold text-${primaryColor}-600 mb-6 border-b pb-2`}>
                        Upcoming Events
                    </h3>
                    
                    <div className="space-y-4">
                        {mockEvents.slice(0, 3).map(event => (
                            <div key={event.id} className="p-4 rounded-lg bg-gray-50 border-l-4 border-l-4 border-${event.color}-500">
                                <p className={`text-xs font-semibold uppercase text-${event.color}-600`}>{event.category}</p>
                                <p className="font-medium text-gray-800 mt-1">{event.title}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{event.date} at {event.time}</p>
                            </div>
                        ))}
                    </div>

                    <button className={`mt-6 w-full py-2 bg-${primaryColor}-600 text-white font-semibold rounded-lg hover:bg-${primaryColor}-700 transition`}>
                        Add to Personal Calendar
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default EventCalendarPage;