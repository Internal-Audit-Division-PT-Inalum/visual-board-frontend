import { FileText, Loader2, Maximize2, X } from "lucide-react";
import { useState } from "react";
import { DocumentViewerModal } from "@/components/shared/DocumentViewerModal";
import type { OrganizationDocument } from "@/types/api";
import { useOrganizationDocuments } from "../../../hooks/useOrganizationDocuments";

interface DocumentViewerProps {
	category?: "structure" | "map_area";
}

export function DocumentViewer({
	category = "structure",
}: DocumentViewerProps = {}) {
	const { documents, isLoading, error } = useOrganizationDocuments(category);
	const [selectedDoc, setSelectedDoc] = useState<OrganizationDocument | null>(
		null,
	);

	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex items-center justify-center min-h-[300px]">
				<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
			</div>
		);
	}

	if (error || !documents || documents.length === 0) {
		return (
			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-12 flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
				<FileText className="w-12 h-12 mb-3 opacity-20" />
				<p className="font-medium">
					{category === "structure"
						? "Belum ada dokumen struktur organisasi yang aktif."
						: "Belum ada peta area yang aktif."}
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 font-sans flex-1 flex flex-col min-h-[500px]">
			<div className="mb-6 border-b border-slate-100 pb-4">
				<h3 className="font-extrabold text-slate-800 text-xl tracking-tight flex items-center gap-2">
					{category === "structure"
						? "Bagan Struktur Organisasi"
						: "Peta Area 5R"}
				</h3>
				<p className="text-slate-500 text-sm font-medium mt-1">
					{category === "structure"
						? "Dokumen resmi susunan kepegawaian & operasional 5R"
						: "Visualisasi denah dan tata letak zona 5R"}
				</p>
			</div>

			<div
				className={`grid gap-6 flex-1 grid-cols-1 ${documents.length === 2 ? "xl:grid-cols-2" : documents.length >= 3 ? "lg:grid-cols-2 xl:grid-cols-3" : ""}`}
			>
				{documents.map((doc) => {
					const isPdf = doc.image_url?.toLowerCase().endsWith(".pdf");
					const fileUrl = doc.image_url?.startsWith("http")
						? doc.image_url
						: `http://localhost:8000${doc.image_url}`;

					return (
						<div
							key={doc.id}
							className="relative flex flex-col rounded-xl overflow-hidden bg-slate-50 border border-slate-200 group shadow-sm"
						>
							<div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between z-10">
								<div>
									<h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide line-clamp-1">
										{doc.title}
									</h4>
									{doc.description && (
										<p className="text-slate-500 text-xs mt-0.5 line-clamp-2">
											{doc.description}
										</p>
									)}
								</div>
							</div>

							<div className="relative flex-1 min-h-[400px] flex items-center justify-center p-4 bg-white">
								{doc.image_url ? (
									isPdf ? (
										<>
											<iframe
												src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
												className="w-full h-full border-0 pointer-events-none"
												title={doc.title}
											/>
											<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px]">
												<button
													type="button"
													onClick={() => setSelectedDoc(doc)}
													className="bg-white/90 text-slate-800 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg text-sm"
												>
													<Maximize2 className="w-4 h-4" /> Perbesar PDF
												</button>
											</div>
										</>
									) : (
										<>
											<img
												src={fileUrl}
												alt={doc.title}
												className="w-full h-full object-contain drop-shadow-sm rounded"
											/>

											<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px]">
												<button
													type="button"
													onClick={() => setSelectedDoc(doc)}
													className="bg-white/90 text-slate-800 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg text-sm"
												>
													<Maximize2 className="w-4 h-4" />
													Perbesar Dokumen
												</button>
											</div>
										</>
									)
								) : (
									<div className="flex flex-col items-center text-slate-400">
										<FileText className="w-10 h-10 mb-2 opacity-30" />
										<span className="text-sm font-medium">
											File tidak tersedia
										</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{selectedDoc && selectedDoc.image_url && (
				<DocumentViewerModal
					url={
						selectedDoc.image_url.startsWith("http")
							? selectedDoc.image_url
							: `http://localhost:8000${selectedDoc.image_url}`
					}
					title={selectedDoc.title}
					description={selectedDoc.description}
					onClose={() => setSelectedDoc(null)}
				/>
			)}
		</div>
	);
}
