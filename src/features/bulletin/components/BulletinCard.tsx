import { useState } from 'react';
import { ShieldAlert, FileText, Calendar, Clock, User, Megaphone, X } from 'lucide-react';
import type { Bulletin } from '@/types/api';
import { PdfViewerModal } from './PdfViewerModal';

interface BulletinCardProps {
  bulletin: Bulletin;
}

export function BulletinCard({ bulletin }: BulletinCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  
  const themeConfig = {
    health_safety: {
      color: 'text-rose-600',
      bgLight: 'bg-rose-50',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600',
      badgeText: 'text-white',
      gradient: 'from-rose-400 to-rose-600',
      icon: <ShieldAlert className="w-4 h-4" />,
      largeIcon: <ShieldAlert className="w-16 h-16 text-white opacity-20" />,
      label: 'K3 & Keselamatan',
    },
    policy: {
      color: 'text-blue-700',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-700',
      badgeText: 'text-white',
      gradient: 'from-blue-500 to-blue-700',
      icon: <FileText className="w-4 h-4" />,
      largeIcon: <FileText className="w-16 h-16 text-white opacity-20" />,
      label: 'Kebijakan',
    },
    event: {
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      gradient: 'from-emerald-400 to-emerald-600',
      icon: <Calendar className="w-4 h-4" />,
      largeIcon: <Calendar className="w-16 h-16 text-white opacity-20" />,
      label: 'Acara Divisi',
    },
    general: {
      color: 'text-slate-600',
      bgLight: 'bg-slate-50',
      border: 'border-slate-200',
      badgeBg: 'bg-slate-700',
      badgeText: 'text-white',
      gradient: 'from-slate-500 to-slate-700',
      icon: <Megaphone className="w-4 h-4" />,
      largeIcon: <Megaphone className="w-16 h-16 text-white opacity-20" />,
      label: 'Informasi Umum',
    },
  };

  const theme = themeConfig[bulletin.type] || themeConfig.general;

  const formattedDate = new Date(bulletin.published_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Backend might return http://localhost/storage/... instead of http://localhost:8000/storage/...
  const imageUrl = bulletin.image_url 
    ? bulletin.image_url.replace('http://localhost/', 'http://localhost:8000/') 
    : null;

  const docUrl = bulletin.document_url
    ? bulletin.document_url.replace('http://localhost/', 'http://localhost:8000/')
    : null;

  return (
    <div className="relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group h-full">
      
      {/* Visual Header (Image or Gradient Fallback) */}
      <div className="w-full h-48 sm:h-52 overflow-hidden shrink-0 relative bg-slate-100">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={bulletin.title} 
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
            {theme.largeIcon}
          </div>
        )}
        
        {/* Overlay Gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${theme.badgeBg} ${theme.badgeText} shadow-md backdrop-blur-sm bg-opacity-90`}>
            {theme.icon}
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              {theme.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 bg-white">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
          {bulletin.title}
        </h3>
        <div 
          className="text-slate-600 text-sm leading-relaxed prose prose-sm prose-slate max-w-none line-clamp-4 overflow-hidden mb-4"
          dangerouslySetInnerHTML={{ __html: bulletin.content }}
        />

        {/* Action Button to open Modal */}
        <div className="mt-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-bold transition-colors w-full justify-center group/btn"
          >
            Baca Selengkapnya
          </button>
        </div>
      </div>

      {/* Footer / Metadata */}
      <div className="bg-slate-50 border-t border-slate-100 px-5 py-3.5 mt-auto flex items-center justify-between text-xs font-bold text-slate-500 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="truncate max-w-[100px] sm:max-w-[150px]">{bulletin.author}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm shrink-0">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>{formattedDate.split(' ')[0]} {formattedDate.split(' ')[1]} {formattedDate.split(' ')[2]}</span>
        </div>
      </div>
      
      {/* PDF Modal / Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col my-auto max-h-[90vh]">
            <button
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full p-2 transition-colors z-[110]"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Modal Banner */}
              <div className="w-full h-48 sm:h-72 overflow-hidden shrink-0 relative bg-slate-100">
                {imageUrl && !imageError ? (
                  <img 
                    src={imageUrl} 
                    alt={bulletin.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                    {theme.largeIcon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText} shadow-md mb-3`}>
                    {theme.icon}
                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                      {theme.label}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
                    {bulletin.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 bg-white">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500 mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{bulletin.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
                
                <div 
                  className="text-slate-700 text-base sm:text-lg leading-relaxed prose prose-slate max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: bulletin.content }}
                />

                {docUrl && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Lampiran Dokumen</h4>
                    <button 
                      onClick={() => setIsPdfViewerOpen(true)}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold transition-all w-full sm:w-auto group/pdf"
                    >
                      <FileText className="w-5 h-5 text-red-500 group-hover/pdf:scale-110 transition-transform" />
                      Tampilkan Dokumen PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Native Canvas PDF Viewer Modal */}
      {isPdfViewerOpen && docUrl && (
        <PdfViewerModal 
          url={docUrl} 
          onClose={() => setIsPdfViewerOpen(false)} 
        />
      )}

    </div>
  );
}

