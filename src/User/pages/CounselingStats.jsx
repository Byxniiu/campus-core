import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  Heart,
  BarChart3,
  Download,
  Search,
  Waves,
  Anchor,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CounselingStats = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      label: 'Total Sessions',
      value: '12',
      icon: <Calendar className="text-blue-950" size={24} />,
      change: '+2 this month',
    },
    {
      label: 'Hours Logged',
      value: '18.5',
      icon: <Clock className="text-blue-950" size={24} />,
      change: 'Individual & Group',
    },
    {
      label: 'Wellness Index',
      value: '84%',
      icon: <Heart className="text-blue-950" size={24} />,
      change: 'Optimal Level',
    },
  ];

  const history = [
    {
      id: 1,
      date: 'Oct 24, 2025',
      type: 'Individual',
      counselor: 'Dr. Sarah Jenkins',
      status: 'Completed',
    },
    {
      id: 2,
      date: 'Oct 10, 2025',
      type: 'Group Workshop',
      counselor: 'Mike Ross',
      status: 'Completed',
    },
    {
      id: 3,
      date: 'Sep 28, 2025',
      type: 'Individual',
      counselor: 'Dr. Sarah Jenkins',
      status: 'Completed',
    },
    {
      id: 4,
      date: 'Nov 05, 2025',
      type: 'Mental Reset',
      counselor: 'Dr. Sarah Jenkins',
      status: 'Upcoming',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-8 md:p-16 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb / Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-900/40 hover:text-teal-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          to Dashboard
        </Link>

        {/* Header Section */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-950 p-2.5 rounded-xl shadow-lg shadow-teal-100/50">
                <BarChart3 size={20} className="text-teal-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                Institutional Wellness Analytics
              </span>
            </div>
            <h1 className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Wellness <span className="text-teal-500">Summary</span>
            </h1>
            <p className="text-blue-950/60 text-lg font-medium mt-6 max-w-lg leading-relaxed">
              Monitor your wellness journey and upcoming sessions within the campus support network.
            </p>
          </div>
          <button className="flex items-center gap-4 bg-white text-blue-950 px-10 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-teal-50 transition-all shadow-2xl shadow-teal-100/30 border border-teal-50 active:scale-[0.98] group">
            <Download
              size={20}
              className="text-teal-500 group-hover:translate-y-0.5 transition-transform"
            />{' '}
            Export Analytics
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white p-10 rounded-[40px] shadow-2xl shadow-teal-100/50 border border-teal-50 flex items-center gap-8 hover:shadow-teal-200/30 hover:border-teal-300 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl -z-0"></div>

              <div className="p-5 bg-blue-50/50 rounded-[28px] border border-teal-50 group-hover:scale-110 transition-transform relative z-10 shadow-inner">
                {stat.icon}
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mb-2">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-outfit font-bold text-blue-950 tracking-tight group-hover:text-teal-600 transition-colors">
                  {stat.value}
                </h3>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-3 bg-teal-50 px-3 py-1.5 rounded-lg inline-block">
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* History Area */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-teal-100/50 border border-teal-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-950"></div>

          <div className="p-10 border-b border-teal-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-4xl font-outfit font-bold tracking-tight text-blue-950 uppercase">
                Session <span className="text-teal-500">History</span>
              </h2>
              <p className="text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] mt-2">
                Verified clinical records
              </p>
            </div>

            <div className="relative group w-full md:w-auto">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-teal-600 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search records..."
                className="pl-14 pr-8 py-5 bg-blue-50/50 border border-teal-50 rounded-2xl focus:ring-4 focus:ring-teal-400/10 focus:border-teal-400 outline-none w-full md:w-72 text-sm font-bold transition-all placeholder:text-blue-200 text-blue-950 shadow-inner"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50/20">
                  <th className="px-10 py-7 text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                    Session Date
                  </th>
                  <th className="px-10 py-7 text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                    Type
                  </th>
                  <th className="px-10 py-7 text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em]">
                    Counselor
                  </th>
                  <th className="px-10 py-7 text-[10px] font-bold text-blue-950/30 uppercase tracking-[0.2em] text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-50">
                {history.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <Waves className="w-4 h-4 text-teal-400 group-hover:animate-pulse" />
                        <span className="text-sm font-bold text-blue-950">{session.date}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[11px] font-bold text-teal-600 uppercase tracking-tight bg-teal-50 px-4 py-1.5 rounded-lg border border-teal-100 group-hover:bg-white transition-colors">
                        {session.type}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-sm font-bold text-blue-950/40 uppercase tracking-tight">
                      {session.counselor}
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span
                        className={`px-6 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.1em] shadow-sm ${
                          session.status === 'Completed'
                            ? 'bg-blue-950 text-teal-400 border border-blue-950/10'
                            : 'bg-blue-50 text-blue-300 border border-teal-50'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-10 bg-blue-50/30 border-t border-teal-50 text-center">
            <button className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] hover:text-teal-600 transition-colors inline-flex items-center gap-3 group">
              <Anchor
                size={16}
                className="text-teal-400 group-hover:rotate-12 transition-transform"
              />{' '}
              Load Archive Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingStats;
