import { useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight, FileText, Maximize2, X } from 'lucide-react';
import type { GeneralDocumentCategory } from '@/types/api';
import { useKioskData } from '@/features/general/api/useKioskData';

const CATEGORY_LABELS: Record<GeneralDocumentCategory, string> = {
  basic_rule:    'Basic Rule',
  flow_process:  'Flow Process',
  kaizen_report: 'Kaizen Report',
};

const CATEGORY_COLORS: Record<GeneralDocumentCategory, string> = {
  basic_rule:    'bg-blue-100 text-blue-700 border-blue-200',
  flow_process:  'bg-amber-100 text-amber-700 border-amber-200',
  kaizen_report: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const CATEGORIES: GeneralDocumentCategory[] = ['basic_rule', 'flow_process', 'kaizen_report'];

interface GeneralDocumentViewerProps {
  category: GeneralDocumentCategory;
}

function SingleViewer({ category }: GeneralDocumentViewerProps) {
  const { data, isLoading, error } = useKioskData();
  const documents = data?.reference_docs?.filter(d => d.category === category) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || documents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl min-h-[200px] text-slate-400">
        <FileText className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-xs font-medium">Belum ada dokumen</p>
      </div>
    );
  }

  const current = documents[currentIndex];
  const isPdf = current.mime_type === 'application/pdf';
  const url = `http://localhost:8000${current.document_url}`;

  return (
    <div className="flex-1 flex flex-col min-h-[220px]">
      <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
        {isPdf ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
            <FileText className="w-10 h-10 text-slate-400" />
            <p className="text-xs text-slate-500 font-medium text-center">{current.title}</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              Buka PDF
            </a>
          </div>
        ) : (
          <>
            <img src={url} alt={current.title} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white/30 text-xs"
              >
                <Maximize2 className="w-4 h-4" /> Perbesar
              </button>
            </div>
          </>
        )}

        
        {documents.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(p => p === 0 ? documents.length - 1 : p - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex(p => p === documents.length - 1 ? 0 : p + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-xs font-bold truncate">{current.title}</p>
        </div>
      </div>

      
      {documents.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {documents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-blue-600 w-3' : 'bg-slate-300'}`}
            />
          ))}
        </div>
      )}

      
      {isModalOpen && !isPdf && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
          <img src={url} alt={current.title} className="w-full h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

export function GeneralDocumentViewer() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 font-sans">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-base tracking-tight">Dokumen Referensi</h3>
          <p className="text-slate-500 text-xs mt-0.5">Basic Rule • Flow Process • Kaizen Report</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => (
          <div key={cat} className="flex flex-col gap-2">
            <span className={`self-start text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${CATEGORY_COLORS[cat]}`}>
              {CATEGORY_LABELS[cat]}
            </span>
            <SingleViewer category={cat} />
          </div>
        ))}
      </div>
    </div>
  );
}

