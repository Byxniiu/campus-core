import React from 'react';
import { Calendar, Clock, CheckCircle, MessageSquare } from 'lucide-react';

const CounselingStats = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    { label: 'Total Sessions', value: '12', icon: <Calendar className="text-indigo-600" />, change: '+2 this month' },
    { label: 'Hours Spent', value: '18.5', icon: <Clock className="text-indigo-600" />, change: 'Individual & Group' },
    { label: 'Completed Goals', value: '4', icon: <CheckCircle className="text-indigo-600" />, change: '75% of target' },
  ];

  const history = [
    { id: 1, date: 'Oct 24, 2025', type: 'Individual', counselor: 'Dr. Sarah Jenkins', status: 'Completed' },
    { id: 2, date: 'Oct 10, 2025', type: 'Group Workshop', counselor: 'Mike Ross', status: 'Completed' },
    { id: 3, date: 'Sep 28, 2025', type: 'Individual', counselor: 'Dr. Sarah Jenkins', status: 'Completed' },
    { id: 4, date: 'Nov 05, 2025', type: 'Couples Therapy', counselor: 'Dr. Sarah Jenkins', status: 'Upcoming' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Your Wellness Journey</h1>
          <p className="text-slate-500">Track your progress and upcoming appointments.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-xs text-indigo-600 mt-1">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800">Session History</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Download Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Session Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Counselor</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{session.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{session.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{session.counselor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingStats;