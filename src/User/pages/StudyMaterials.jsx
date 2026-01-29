import React, { useState } from 'react';

const StudyMaterials = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Calculus_CheatSheet.pdf', size: '1.2 MB', type: 'PDF', uploader: 'Dr. Aris', date: 'Jan 24' },
    { id: 2, name: 'Organic_Chemistry_Notes.docx', size: '850 KB', type: 'DOCX', uploader: 'Sarah Miller', date: 'Jan 22' },
    { id: 3, name: 'Physics_Formulas_Final.pdf', size: '2.1 MB', type: 'PDF', uploader: 'Prof. Fox', date: 'Jan 20' },
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
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      setMaterials([newFile, ...materials]);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Study Materials</h1>
            <p className="text-slate-500 font-medium">Shared resources for your active Study Pods.</p>
          </div>
          
          {/* Action Area: Simple Upload Button */}
          <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload New Material</span>
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Documents</h2>
            
            {isUploading && (
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg"></div>
                  <div className="h-4 w-32 bg-slate-100 rounded"></div>
                </div>
                <span className="text-xs font-bold text-indigo-500">Uploading...</span>
              </div>
            )}

            {materials.map((file) => (
              <div key={file.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition group">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${file.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.293l4.414 4.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">{file.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {file.size} • Uploaded by <span className="text-slate-600">{file.uploader}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-300 mr-4">{file.date}</span>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Quick Stats & Info */}
          <div className="space-y-6">
            <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Academic Storage</h3>
                <p className="text-indigo-200 text-sm">You are using 45% of your institute storage quota.</p>
                <div className="mt-6 h-2 bg-indigo-800 rounded-full">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4">Guidelines</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                  <p className="text-xs text-slate-500">Only upload PDF, DOCX, or Image files.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                  <p className="text-xs text-slate-500">Ensure materials are relevant to the Pod subject.</p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;