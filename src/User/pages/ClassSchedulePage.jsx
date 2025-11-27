import React, { useState } from 'react';

// Mock Timetable Data for a specific student (BSc Computer Science)
const mockWeeklySchedule = {
    Monday: [
        { time: '09:00 AM', subject: 'Calculus I', code: 'MA101', room: 'A-201', type: 'Lecture' },
        { time: '10:00 AM', subject: 'Data Structures', code: 'CS205', room: 'Lab 4', type: 'Practical' },
        { time: '11:00 AM', subject: 'Web Development', code: 'CS210', room: 'B-305', type: 'Lecture' },
    ],
    Tuesday: [
        { time: '10:00 AM', subject: 'Operating Systems', code: 'CS301', room: 'A-101', type: 'Lecture' },
        { time: '01:00 PM', subject: 'Study Pod Session', code: 'SP-CS', room: 'Library Pod', type: 'Pod' },
        { time: '03:00 PM', subject: 'Linear Algebra', code: 'MA102', room: 'A-201', type: 'Tutorial' },
    ],
    Wednesday: [], // Example of a light day
    Thursday: [
        { time: '09:00 AM', subject: 'Database Management', code: 'CS305', room: 'Lab 5', type: 'Practical' },
        { time: '12:00 PM', subject: 'Technical Seminar', code: 'CS400', room: 'Auditorium', type: 'Seminar' },
    ],
    Friday: [
        { time: '10:00 AM', subject: 'Ethics & Law', code: 'HU101', room: 'C-100', type: 'Lecture' },
    ],
};

const ClassSchedulePage = () => {
    const primaryColor = 'indigo';
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const [selectedDay, setSelectedDay] = useState('Monday'); // Default to Monday
    
    const scheduleForDay = mockWeeklySchedule[selectedDay] || [];
    const hasClasses = scheduleForDay.length > 0;

    // Helper function to determine card color based on class type
    const getTypeColor = (type) => {
        switch (type) {
            case 'Lecture': return 'border-l-4 border-blue-500 bg-blue-50';
            case 'Practical': return 'border-l-4 border-green-500 bg-green-50';
            case 'Pod': return 'border-l-4 border-yellow-500 bg-yellow-50';
            default: return 'border-l-4 border-gray-300 bg-white';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bebas tracking-wider text-gray-900">
                    Personalized Class Timetable
                </h1>
                <p className="text-gray-500">Your optimized daily study pods and time-sensitive class routes[cite: 21, 35].</p>
            </header>

            {/* Day Selector Tabs */}
            <div className={`bg-white p-4 rounded-xl shadow-lg mb-8`}>
                <div className="flex overflow-x-auto space-x-2 pb-2">
                    {daysOfWeek.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex-shrink-0 transition ${
                                selectedDay === day
                                    ? `bg-${primaryColor}-600 text-white shadow-md`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schedule Cards */}
            <div className="max-w-4xl mx-auto">
                <h2 className={`text-2xl font-bold text-gray-800 mb-6`}>
                    Schedule for {selectedDay}
                </h2>

                <div className="space-y-6">
                    {hasClasses ? (
                        scheduleForDay.map((item, index) => (
                            <div key={index} className={`flex items-center p-5 rounded-xl shadow-md transition ${getTypeColor(item.type)}`}>
                                <div className="flex-shrink-0 w-20 text-center">
                                    <p className="text-lg font-bold text-gray-800">{item.time}</p>
                                    <p className="text-xs text-gray-500">{item.type}</p>
                                </div>
                                <div className="ml-6 flex-grow">
                                    <p className="font-semibold text-gray-900 text-lg">{item.subject}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium mr-2">{item.code}</span> | 
                                        <span className="ml-2 text-red-600 font-medium">Room: {item.room}</span>
                                    </p>
                                </div>
                                <button className={`ml-4 text-sm font-semibold text-${primaryColor}-600 hover:text-${primaryColor}-800`}>
                                    Details
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-white rounded-xl shadow-lg">
                            <p className="text-lg font-semibold text-gray-600">No scheduled classes for {selectedDay}.</p>
                            <p className="text-gray-500 mt-2">Use this time for a Study Pod or self-study!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassSchedulePage;