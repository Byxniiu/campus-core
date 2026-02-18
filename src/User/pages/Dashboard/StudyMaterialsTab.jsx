import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  Search,
  Video,
  ExternalLink,
  BookOpen,
  LayoutDashboard,
  Clock,
  Layers,
  X,
  Play,
} from 'lucide-react';
import { useStudentAuthStore } from '../../../stores/useStudentAuthStore';
import { studyMaterialAPI } from '../../../api/studyMaterial';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const StudyMaterialsTab = () => {
  const { user } = useStudentAuthStore();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    subject: '',
    search: '',
  });

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        department: user?.department,
        semester: user?.semester,
        category: filters.category || undefined,
        subject: filters.subject || undefined,
      };

      const response = await studyMaterialAPI.getAll(params);
      if (response.success) {
        let data = response.data.materials;

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

  const handleDownload = async (material, fileIndex = 0) => {
    try {
      setDownloadingId(material._id);
      const response = await studyMaterialAPI.download(material._id, fileIndex);

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;

      // Try to determine filename from material or generic
      const fileName =
        material.attachments?.[fileIndex]?.filename ||
        material.filename ||
        `document_${material._id.slice(-6)}.pdf`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download initialized successfully');
    } catch (error) {
      console.error('Secure download failed:', error);
      toast.error('Access Denied: Authentication required for downloads.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Synchronizing Academic Repository...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search & Filter Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, subject or tags..."
            className="w-full pl-14 pr-8 py-4 bg-white border border-teal-50 rounded-2xl text-sm font-bold text-blue-950 outline-none focus:ring-4 ring-teal-500/5 focus:border-teal-400 transition-all shadow-sm"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="w-full px-6 py-4 bg-white border border-teal-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-950 outline-none focus:border-teal-400 appearance-none shadow-sm"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="notes">Academic Notes</option>
          <option value="video-lesson">Video Lessons</option>
          <option value="assignment">Assignments</option>
          <option value="previous-papers">Previous Papers</option>
          <option value="reference">Reference Materials</option>
        </select>
      </div>

      {/* Info Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-950 rounded-2xl shadow-xl shadow-blue-900/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[8px] font-black text-teal-400 uppercase tracking-widest">
              Active Department
            </p>
            <p className="text-[10px] font-black text-white uppercase tracking-tight">
              {user?.department || 'General'}
            </p>
          </div>
        </div>
        <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Clock size={16} className="text-teal-400" />
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phase</p>
            <p className="text-[10px] font-black text-white uppercase tracking-tight">
              Semester {user?.semester || 'X'}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 ml-auto">
          <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">
            Repository Status: Synchronized
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <motion.div
            key={m._id}
            whileHover={{ y: -5 }}
            className="group bg-white p-6 rounded-[2.5rem] border border-teal-50 shadow-sm hover:shadow-2xl hover:shadow-teal-100/30 transition-all duration-500 relative flex flex-col"
          >
            <div className="flex justify-between items-start mb-6 w-full">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                  m.resourceType === 'video'
                    ? 'bg-rose-50 text-rose-500'
                    : m.resourceType === 'document'
                      ? 'bg-blue-50 text-blue-500'
                      : 'bg-emerald-50 text-emerald-500'
                }`}
              >
                {m.resourceType === 'video' ? (
                  <Video size={20} />
                ) : m.resourceType === 'document' ? (
                  <FileText size={20} />
                ) : (
                  <ExternalLink size={20} />
                )}
              </div>
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Ref: {m._id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[8px] font-black px-2 py-0.5 bg-blue-950 text-white rounded-md uppercase tracking-tight">
                  SEM_{m.semester}
                </span>
                <span className="text-[8px] font-black px-2 py-0.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-md uppercase tracking-tight italic">
                  {m.category}
                </span>
              </div>
              <h4 className="text-lg font-black text-blue-950 italic uppercase tracking-tighter mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                {m.title}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <LayoutDashboard size={10} className="text-teal-400" /> {m.subject}
              </p>
            </div>

            <div className="pt-6 border-t border-teal-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                  <BookOpen size={12} />
                </div>
                <div className="text-left">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                    Resource
                  </p>
                  <p className="text-[10px] font-black text-blue-950 uppercase tracking-tight">
                    {m.resourceType}
                  </p>
                </div>
              </div>

              <button
                disabled={downloadingId === m._id}
                onClick={() => {
                  if (m.resourceType === 'video') setSelectedVideo(m);
                  else if (m.resourceType === 'link' && m.externalLinks?.[0])
                    window.open(m.externalLinks[0].url, '_blank');
                  else handleDownload(m);
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                  downloadingId === m._id
                    ? 'bg-slate-200 text-slate-400 animate-pulse'
                    : 'bg-teal-500 hover:bg-blue-950 text-white shadow-teal-500/20'
                }`}
              >
                {m.resourceType === 'video' ? (
                  <Play size={16} />
                ) : downloadingId === m._id ? (
                  <Clock size={16} />
                ) : (
                  <Download size={16} />
                )}
              </button>
            </div>
          </motion.div>
        ))}

        {materials.length === 0 && (
          <div className="col-span-full py-20 bg-white/50 border-2 border-dashed border-teal-100 rounded-[3rem] text-center flex flex-col items-center justify-center space-y-4">
            <BookOpen size={48} className="text-teal-100" />
            <div className="space-y-1">
              <p className="text-sm font-black text-blue-950/40 uppercase tracking-widest italic">
                Inventory Depleted
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                No resources currently assigned to your node
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-blue-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-5xl bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-rose-500 text-white rounded-2xl transition-all shadow-xl backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoUrl.split('v=')[1]?.split('&')[0] || selectedVideo.videoUrl.split('/').pop().split('?')[0]}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-8 md:p-10 bg-gradient-to-b from-slate-900 to-black border-t border-white/5">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-[10px] font-black px-4 py-1.5 bg-teal-500 text-white rounded-full uppercase tracking-widest italic">
                  {selectedVideo.category}
                </span>
                <span className="text-[10px] font-black px-4 py-1.5 bg-white/5 text-slate-400 border border-white/10 rounded-full uppercase tracking-widest italic">
                  {selectedVideo.subject}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                {selectedVideo.title}
              </h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic max-w-3xl">
                "{selectedVideo.description}"
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsTab;
