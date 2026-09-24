import { FileText, Loader2, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DocumentViewerModal } from "@/components/shared/DocumentViewerModal";
import { useKioskData } from "@/features/general/api/useKioskData";
import { getBackendUrl } from "@/lib/utils";
import type { GeneralDocumentCategory } from "@/types/api";

const CATEGORY_LABELS: Record<GeneralDocumentCategory, string> = {
	basic_rule: "Basic Rule",
	flow_process: "Flow Process",
	kaizen_report: "Kaizen Report",
	sor: "SOR",
	cog: "COG",
	berat_badan: "Challenge Weight Loss",
	self_assessment: "Self Assessment",
	asesor: "Assessment by Asesor",
};

const CATEGORY_COLORS: Record<GeneralDocumentCategory, string> = {
	basic_rule: "bg-blue-100 text-blue-700 border-blue-200",
	flow_process: "bg-amber-100 text-amber-700 border-amber-200",
	kaizen_report: "bg-emerald-100 text-emerald-700 border-emerald-200",
	sor: "bg-purple-100 text-purple-700 border-purple-200",
	cog: "bg-indigo-100 text-indigo-700 border-indigo-200",
	berat_badan: "bg-rose-100 text-rose-700 border-rose-200",
	self_assessment: "bg-teal-100 text-teal-700 border-teal-200",
	asesor: "bg-sky-100 text-sky-700 border-sky-200",
};

const CATEGORIES: GeneralDocumentCategory[] = [
	"basic_rule",
	"flow_process",
	"kaizen_report",
];

interface GeneralDocumentViewerProps {
	category: GeneralDocumentCategory;
}

function SingleViewer({ category }: GeneralDocumentViewerProps) {
	const { data, isLoading, error } = useKioskData();
	const allDocuments =
		data?.reference_docs?.filter((d) => d.category === category) || [];
	const documents = allDocuments.slice(0, 5); // Limit to 5 for rotation

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isModalOpen] = useState(false);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedDoc, setSelectedDoc] = useState<{
		url: string;
		title: string;
	} | null>(null);

	useEffect(() => {
		if (documents.length <= 1 || isModalOpen || isGalleryOpen) return;

		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev === documents.length - 1 ? 0 : prev + 1));
		}, 8000);

		return () => clearInterval(timer);
	}, [documents.length, isModalOpen, isGalleryOpen]);

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
	const isPdf = current.mime_type === "application/pdf";
	const url = getBackendUrl(current.document_url);

	return (
		<div className="flex-1 flex flex-col min-h-[220px]">
			<div className="relative flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
				{isPdf ? (
					<>
						<iframe
							src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
							className="w-full h-full border-0 pointer-events-none"
							title={current.title}
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
							<button
								type="button"
								onClick={() =>
									setSelectedDoc({ url: url, title: current.title })
								}
								className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 text-xs shadow-lg"
							>
								<FileText className="w-4 h-4" /> Buka PDF
							</button>
							<button
								onClick={() => setIsGalleryOpen(true)}
								className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white text-xs shadow-lg"
							>
								<Maximize2 className="w-4 h-4" /> Lihat Semua
							</button>
						</div>
					</>
				) : (
					<>
						<img
							src={url}
							alt={current.title}
							className="w-full h-full object-contain"
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
							<button
								type="button"
								onClick={() =>
									setSelectedDoc({ url: url, title: current.title })
								}
								className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 text-xs shadow-lg"
							>
								<FileText className="w-4 h-4" /> Buka Gambar
							</button>
							<button
								type="button"
								onClick={() => setIsGalleryOpen(true)}
								className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white text-xs shadow-lg"
							>
								<Maximize2 className="w-4 h-4" /> Lihat Semua
							</button>
						</div>
					</>
				)}

				<div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
					<p className="text-white text-xs font-bold truncate">
						{current.title}
					</p>
				</div>
			</div>

			{documents.length > 1 && (
				<div className="flex justify-center gap-1 mt-2">
					{documents.map((_, i) => (
						<button
							key={i}
							type="button"
							onClick={() => setCurrentIndex(i)}
							className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? "bg-blue-600 w-3" : "bg-slate-300"}`}
						/>
					))}
				</div>
			)}

			{isGalleryOpen && (
				<div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col p-6 sm:p-10 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
					<div className="flex justify-between items-center mb-6 shrink-0">
						<div>
							<h3 className="text-white font-bold text-2xl drop-shadow-md uppercase tracking-wider">
								Galeri {CATEGORY_LABELS[category]}
							</h3>
							<p className="text-blue-200 text-sm mt-1">
								Total {allDocuments.length} dokumen tersedia
							</p>
						</div>
						<button
							type="button"
							onClick={() => setIsGalleryOpen(false)}
							className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all shadow-lg"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
							{allDocuments.map((doc, idx) => {
								const docUrl = getBackendUrl(doc.document_url);
								const docIsPdf = doc.mime_type === "application/pdf";

								return (
									<div
										key={doc.id || idx}
										className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col group h-full"
									>
										<div className="h-48 shrink-0 bg-slate-900 relative flex items-center justify-center p-4">
											{docIsPdf ? (
												<iframe
													src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
													className="w-full h-full border-0 pointer-events-none"
													title={doc.title}
												/>
											) : (
												<img
													src={docUrl}
													alt={doc.title}
													className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
												/>
											)}
											<button
												type="button"
												onClick={() =>
													setSelectedDoc({ url: docUrl, title: doc.title })
												}
												className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity w-full h-full cursor-pointer"
											>
												<span className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
													Buka Dokumen
												</span>
											</button>
										</div>
										<div className="p-4 flex-1 flex flex-col">
											<p className="text-white text-sm font-bold line-clamp-2">
												{doc.title}
											</p>
											{doc.description && (
												<p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
													{doc.description}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{selectedDoc && (
				<DocumentViewerModal
					url={selectedDoc.url}
					title={selectedDoc.title}
					onClose={() => setSelectedDoc(null)}
				/>
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
					<h3 className="font-extrabold text-slate-800 text-base tracking-tight">
						Dokumen Referensi
					</h3>
					<p className="text-slate-500 text-xs mt-0.5">
						Basic Rule • Flow Process • Kaizen Report
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{CATEGORIES.map((cat) => (
					<div key={cat} className="flex flex-col gap-2">
						<span
							className={`self-start text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${CATEGORY_COLORS[cat]}`}
						>
							{CATEGORY_LABELS[cat]}
						</span>
						<SingleViewer category={cat} />
					</div>
				))}
			</div>
		</div>
	);
}
