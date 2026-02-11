import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Download,
  Shield,
  HardDrive,
  Info,
  Check,
  ChevronLeft,
  Search,
  Waves,
  Anchor,
  Box,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudyMaterials = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Calculus_CheatSheet.pdf',
      size: '1.2 MB',
      type: 'PDF',
      uploader: 'Dr. Aris',
      date: 'Jan 24',
    },
    {
      id: 2,
      name: 'Organic_Chemistry_Notes.docx',
      size: '850 KB',
      type: 'DOCX',
      uploader: 'Sarah Miller',
      date: 'Jan 22',
    },
    {
      id: 3,
      name: 'Physics_Formulas_Final.pdf',
      size: '2.1 MB',
      type: 'PDF',
      uploader: 'Prof. Fox',
      date: 'Jan 20',
    },
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    // Simulating a network upload delay
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        type: file.name.split('.').pop().toUpperCase(),
        uploader: 'You',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
      setMaterials([newFile, ...materials]);
      setIsUploading(false);
    }, 1500);
  };

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

        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-950 p-2.5 rounded-xl shadow-lg shadow-teal-100">
                <FileText size={20} className="text-teal-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-900/30 uppercase tracking-[0.2em]">
                Institutional Knowledge Base
              </span>
            </div>
            <h1 className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Study <span className="text-teal-500">Materials</span>
            </h1>
            <p className="text-blue-950/60 text-lg font-medium mt-6 max-w-lg leading-relaxed">
              Access verified academic assets and shared intelligence from throughout the
              institutional network.
            </p>
          </div>

          <label className="cursor-pointer group">
            <div className="flex items-center gap-4 bg-blue-950 text-white px-10 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all shadow-2xl shadow-teal-100/50 active:scale-[0.98]">
              <Upload
                size={18}
                className="text-teal-400 group-hover:-translate-y-1 transition-transform"
              />
              <span>Initialize Asset Upload</span>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-sm font-bold text-blue-950/40 uppercase tracking-[0.2em] flex items-center gap-3">
                <Box size={14} className="text-teal-500" /> Institutional Repository
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100 px-5 py-2.5 rounded-full shadow-sm">
                <Check size={12} /> {materials.length} Verified Assets
              </div>
            </div>

            {isUploading && (
              <div className="bg-white p-8 rounded-[32px] border-2 border-dashed border-teal-100 flex items-center justify-between animate-pulse shadow-inner">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center border border-teal-50 shadow-inner">
                    <Upload className="text-blue-950" size={24} />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-blue-50/50 rounded-full"></div>
                    <div className="h-3 w-32 bg-blue-50/20 rounded-full"></div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-950/30 uppercase tracking-widest animate-bounce">
                  Encrypting Upload...
                </span>
              </div>
            )}

            {materials.map((file) => (
              <div
                key={file.id}
                className="group bg-white p-8 rounded-[40px] border border-teal-50 shadow-2xl shadow-teal-100/50 hover:shadow-teal-200/30 hover:border-teal-300 transition-all duration-500 flex items-center justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/30 rounded-full blur-3xl -z-0"></div>

                <div className="flex items-center space-x-6 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-500 group-hover:rotate-6 shadow-inner ${
                      file.type === 'PDF'
                        ? 'bg-blue-950 border-blue-900 text-teal-400'
                        : 'bg-blue-50 border-teal-50 text-blue-950'
                    }`}
                  >
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 group-hover:text-teal-600 transition-colors tracking-tight">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 shadow-sm">
                        {file.size}
                      </span>
                      <div className="w-1 h-1 bg-teal-200 rounded-full"></div>
                      <p className="text-[10px] font-bold text-blue-950/40 uppercase tracking-widest">
                        By <span className="text-blue-950 font-bold">{file.uploader}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                  <span className="text-[10px] font-bold text-blue-950/20 uppercase tracking-[0.2em] hidden md:block">
                    {file.date}
                  </span>
                  <button className="p-4 bg-blue-50/50 text-blue-950 rounded-2xl border border-teal-50 hover:bg-teal-600 hover:text-white transition-all shadow-inner group/dl">
                    <Download
                      size={20}
                      className="group-hover/dl:translate-y-0.5 transition-transform"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Quick Stats & Info */}
          <div className="space-y-10">
            <div className="bg-blue-950 rounded-[40px] p-10 text-white shadow-2xl shadow-teal-900/10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-outfit font-bold tracking-tight">Core Quota</h3>
                  <HardDrive className="text-teal-400" size={24} />
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4 text-[12px]">
                      <span className="font-bold text-blue-200 uppercase tracking-widest">
                        Storage Utilization
                      </span>
                      <span className="font-bold text-teal-400 uppercase tracking-widest italic">
                        45% Used
                      </span>
                    </div>
                    <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden p-0.5 border border-blue-800">
                      <div
                        className="h-full bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-blue-100/40 text-[11px] font-medium leading-relaxed italic">
                    Institutional allocation resets every semester. Please compress large assets to
                    optimize shared storage.
                  </p>
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-400/5 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-teal-50 shadow-xl shadow-teal-100/10 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-blue-50 rounded-xl shadow-inner">
                  <Info className="text-teal-600" size={20} />
                </div>
                <h4 className="font-outfit text-3xl font-bold text-blue-950 tracking-tight">
                  Directives
                </h4>
              </div>
              <ul className="space-y-8">
                {[
                  {
                    label: 'Authorized Extensions',
                    desc: 'PDF, DOCX, XLSX are supported within the repository.',
                    icon: <FileText size={14} />,
                  },
                  {
                    label: 'Sync Protocol',
                    desc: 'Connect assets with active learning modules.',
                    icon: <Waves size={14} />,
                  },
                  {
                    label: 'Security Check',
                    desc: 'All assets are indexed and verified for security.',
                    icon: <Shield size={14} />,
                  },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 bg-blue-50 text-blue-950 rounded-xl border border-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner transition-colors group-hover:bg-teal-400 group-hover:text-white">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-blue-950 uppercase tracking-[0.1em] mb-1.5">
                        {item.label}
                      </p>
                      <p className="text-xs text-blue-950/40 font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-12 pt-10 border-t border-teal-50 flex justify-center">
                <Anchor className="text-teal-100/50 rotate-45" size={48} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
