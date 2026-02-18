import React, { useState, useEffect, useCallback } from 'react';
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
  Video,
  ExternalLink,
  Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudentAuthStore } from '../../stores/useStudentAuthStore';
import { studyMaterialAPI } from '../../api/studyMaterial';
import toast from 'react-hot-toast';

const StudyMaterials = () => {
  const { user } = useStudentAuthStore();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    subject: '',
    search: '',
  });

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch materials for current student's department and semester
      const params = {
        department: user?.department,
        semester: user?.semester,
        category: filters.category || undefined,
        subject: filters.subject || undefined,
      };

      const response = await studyMaterialAPI.getAll(params);
      if (response.success) {
        let data = response.data.materials;

        // Manual search filter if needed
        if (filters.search) {
          data = data.filter(
            (m) =>
              m.title.toLowerCase().includes(filters.search.toLowerCase()) ||
              m.subject.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setMaterials(data);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  }, [user, filters.category, filters.subject, filters.search]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDownload = (id, fileIndex = 0) => {
    const url = studyMaterialAPI.getDownloadUrl(id, fileIndex);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
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
                {user?.department} Sector Base • Semester {user?.semester}
              </span>
            </div>
            <h1 className="text-7xl font-outfit font-bold tracking-tight text-blue-950 leading-none">
              Scholarship <span className="text-teal-500">Assets</span>
            </h1>
            <p className="text-blue-950/60 text-lg font-medium mt-6 max-w-lg leading-relaxed">
              Synthesized knowledge assets and verified academic intelligence from your department.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative group">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-900/40 group-focus-within:text-teal-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-16 pr-8 py-5 rounded-[24px] bg-white border border-blue-900/5 outline-none focus:ring-2 ring-teal-500 text-sm font-bold text-blue-950 placeholder:text-blue-900/20 shadow-xl shadow-teal-100/20 w-full md:w-[300px]"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-10">
            <div className="bg-white p-8 rounded-[40px] border border-blue-900/5 shadow-2xl shadow-teal-100/30">
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] mb-8 border-b border-blue-50 pb-6">
                Asset Classification
              </h3>
              <div className="space-y-3">
                {[
                  { id: '', label: 'All Resources', icon: <Box size={14} /> },
                  { id: 'notes', label: 'Academic Notes', icon: <FileText size={14} /> },
                  { id: 'video-lesson', label: 'Video Lessons', icon: <Video size={14} /> },
                  { id: 'assignment', label: 'Assignments', icon: <Play size={14} /> },
                  { id: 'reference', label: 'Reference Mat', icon: <Anchor size={14} /> },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters({ ...filters, category: cat.id })}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${filters.category === cat.id ? 'bg-blue-950 text-white shadow-xl shadow-blue-900/40' : 'hover:bg-blue-50 text-blue-900/60'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`${filters.category === cat.id ? 'text-teal-400' : 'text-blue-950'} transition-colors`}
                      >
                        {cat.icon}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {cat.label}
                      </span>
                    </div>
                    {filters.category === cat.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-950 to-blue-900 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
              <HardDrive className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
              <div className="relative z-10">
                <Shield className="text-teal-400 mb-6" size={32} />
                <h4 className="text-xl font-bold tracking-tight mb-3">Institutional Integrity</h4>
                <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-widest italic">
                  All assets are verified by the department faculty and encrypted for academic
                  security.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Repository Section */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-sm font-bold text-blue-950/40 uppercase tracking-[0.2em] flex items-center gap-3">
                <Waves size={14} className="text-teal-500" /> Department Stream
              </h2>
              <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100 px-5 py-2.5 rounded-full">
                {materials.length} ASSETS_SYNCED
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-[40px] animate-pulse h-[250px] border border-blue-50"
                  ></div>
                ))}
              </div>
            ) : materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {materials.map((asset) => (
                  <div
                    key={asset._id}
                    className="group bg-white p-10 rounded-[40px] border border-blue-900/5 hover:border-teal-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl relative flex flex-col"
                  >
                    <div className="absolute top-8 right-8">
                      <span className="text-[8px] font-black px-3 py-1 bg-blue-50 text-blue-950 rounded-full uppercase tracking-widest italic border border-blue-100">
                        {asset.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                      <div
                        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${
                          asset.resourceType === 'video'
                            ? 'bg-rose-50 text-rose-500'
                            : asset.resourceType === 'document'
                              ? 'bg-blue-50 text-blue-500'
                              : 'bg-emerald-50 text-emerald-500'
                        }`}
                      >
                        {asset.resourceType === 'video' ? (
                          <Video size={28} />
                        ) : asset.resourceType === 'document' ? (
                          <FileText size={28} />
                        ) : (
                          <ExternalLink size={28} />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-1 italic font-mono">
                          {asset.subject}
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight text-blue-950 line-clamp-1 group-hover:text-teal-600 transition-colors">
                          {asset.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-blue-950/50 text-xs font-medium leading-relaxed italic mb-8 flex-1">
                      "{asset.description}"
                    </p>

                    <div className="space-y-4">
                      {asset.resourceType === 'video' && asset.videoUrl && (
                        <a
                          href={asset.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-between p-5 bg-rose-50 text-rose-600 rounded-3xl hover:bg-rose-100 transition-all group/link"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 group-hover/link:scale-110 transition-transform">
                              <Play size={18} fill="currentColor" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">
                              Access Video Lecture
                            </span>
                          </div>
                          <ExternalLink size={16} className="opacity-40" />
                        </a>
                      )}

                      {(asset.attachments?.length > 0 || asset.filePath) && (
                        <div className="space-y-2">
                          {(asset.attachments && asset.attachments.length > 0
                            ? asset.attachments
                            : [
                                {
                                  filename: asset.filename,
                                  path: asset.filePath,
                                  size: asset.fileSize,
                                },
                              ]
                          ).map((file, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDownload(asset._id, idx)}
                              className="w-full flex items-center justify-between p-5 bg-blue-50 text-blue-900 rounded-3xl hover:bg-teal-600 hover:text-white transition-all group/btn shadow-sm"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-900 group-hover/btn:bg-white/20 rounded-2xl flex items-center justify-center text-white group-hover/btn:text-white transition-all">
                                  <Download size={18} />
                                </div>
                                <div className="text-left">
                                  <span className="text-[10px] font-black uppercase tracking-widest block">
                                    {file.filename || 'Academic_Asset'}
                                  </span>
                                  <span className="text-[8px] font-bold opacity-40 uppercase">
                                    {file.size ? (file.size / 1024 / 1024).toFixed(2) : '0.00'} MB •{' '}
                                    {file.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
                                  </span>
                                </div>
                              </div>
                              <HardDrive size={16} className="opacity-20" />
                            </button>
                          ))}
                        </div>
                      )}

                      {asset.externalLinks?.length > 0 && (
                        <div className="space-y-2">
                          {asset.externalLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-between p-5 bg-emerald-50 text-emerald-700 rounded-3xl hover:bg-emerald-100 transition-all group/link"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover/link:scale-110 transition-transform">
                                  <ExternalLink size={18} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest">
                                  {link.title || 'Intel Link'}
                                </span>
                              </div>
                              <ChevronLeft size={16} className="rotate-180 opacity-40" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-blue-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center text-[10px] font-black text-teal-400 italic">
                          {asset.uploadedBy?.firstName?.charAt(0) || 'F'}
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-blue-950 uppercase tracking-widest">
                            Uploader
                          </p>
                          <p className="text-[10px] font-bold text-blue-950/40 uppercase">
                            {asset.uploadedBy?.firstName} {asset.uploadedBy?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-blue-950 uppercase tracking-widest">
                          Transmitted
                        </p>
                        <p className="text-[10px] font-bold text-blue-950/40 uppercase">
                          {new Date(asset.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 bg-white rounded-[40px] border border-blue-900/5 text-center shadow-xl shadow-teal-100/20">
                <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                  <Box size={40} className="text-blue-900/20" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-2">Repository Empty</h3>
                <p className="text-blue-950/40 text-sm font-medium uppercase tracking-[0.2em] italic">
                  No scholarship assets detected in current stream
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
