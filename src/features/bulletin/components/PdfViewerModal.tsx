import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerModalProps {
  url: string;
  onClose: () => void;
}

export function PdfViewerModal({ url, onClose }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/98 flex flex-col p-4 sm:p-6 backdrop-blur-lg">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between mb-4 max-w-6xl w-full mx-auto bg-slate-800/50 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 px-2 text-white/90">
          <button 
            onClick={zoomOut}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Perkecil"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={zoomIn}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Perbesar"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        {numPages ? (
          <div className="flex items-center gap-4 text-white/90">
            <button 
              onClick={prevPage}
              disabled={pageNumber <= 1}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold bg-black/30 px-3 py-1 rounded-full">
              Halaman {pageNumber} dari {numPages}
            </span>
            <button 
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={onClose}
          className="text-white/70 hover:text-white bg-red-500/20 hover:bg-red-500/40 rounded-xl px-4 py-2 transition-all flex items-center gap-2 text-sm font-bold border border-red-500/20"
        >
          <X className="w-4 h-4" /> Tutup
        </button>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto rounded-2xl overflow-y-auto overflow-x-hidden shadow-2xl border border-white/10 bg-slate-900/50 flex flex-col relative custom-scrollbar">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-slate-900/50 z-10">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p className="font-medium animate-pulse">Menyiapkan Dokumen PDF...</p>
          </div>
        )}
        
        <div className="flex-1 flex justify-center py-8 min-h-max">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            className="flex flex-col items-center shadow-2xl ring-1 ring-black/5"
            error={
              <div className="p-8 text-red-400 bg-red-950/30 rounded-xl border border-red-500/20 text-center">
                <p className="font-bold mb-1">Gagal memuat dokumen PDF.</p>
                <p className="text-sm opacity-80">Format tidak didukung atau file korup.</p>
              </div>
            }
          >
            {numPages && (
              <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white rounded-sm overflow-hidden"
              />
            )}
          </Document>
        </div>
      </div>
    </div>
  );
}
