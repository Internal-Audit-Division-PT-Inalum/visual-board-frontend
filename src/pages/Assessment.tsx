import { BarChart2, FileText, Maximize2 } from "lucide-react";
import { useState } from "react";
import { DocumentViewerModal } from "@/components/shared/DocumentViewerModal";
import { useKioskData } from "@/features/general/api/useKioskData";
import { getBackendUrl } from "@/lib/utils";
import type { GeneralDocument } from "@/types/api";

type AssessmentType = "self_assessment" | "asesor";

interface AssessmentSection {
	type: AssessmentType;
	title: string;
	subtitle: string;
	accentColor: string;
	badgeColor: string;
	iconBg: string;
}

const SECTIONS: AssessmentSection[] = [
	{
		type: "self_assessment",
		title: "Self Assessment",
		subtitle: "Penilaian oleh tim internal Divisi IIA",
		accentColor: "border-blue-500",
		badgeColor: "bg-blue-50 text-blue-700 border border-blue-100",
		iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
	},
	{
		type: "asesor",
		title: "Assessment by Asesor",
		subtitle: "Penilaian oleh asesor",
		accentColor: "border-amber-500",
		badgeColor: "bg-amber-50 text-amber-700 border border-amber-100",
		iconBg: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
	},
];

interface AssessmentViewerProps {
	evaluations: GeneralDocument[];
	section: AssessmentSection;
}

function AssessmentDocumentCard({
	evaluation,
	onClick,
}: {
	evaluation: GeneralDocument;
	onClick: () => void;
}) {
	const isPdf =
		evaluation.mime_type === "application/pdf" ||
		evaluation.document_url?.endsWith(".pdf");
	const url = evaluation.document_url
		? getBackendUrl(evaluation.document_url)
		: "";

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden group">
			{/* Card Header */}
			<div className="p-4 border-b border-slate-100 bg-slate-50/50">
				<p className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
					{evaluation.title}
				</p>
				{evaluation.description && (
					<p className="text-xs text-slate-500 mt-1 line-clamp-1">
						{evaluation.description}
					</p>
				)}
			</div>

			{/* Document Preview */}
			<div className="relative h-48 bg-slate-100 flex-1 border-b border-slate-100 overflow-hidden">
				{url ? (
					isPdf ? (
						<iframe
							src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
							className="w-full h-full border-0 pointer-events-none object-cover"
							title={evaluation.title}
						/>
					) : (
						<img
							src={url}
							alt={evaluation.title}
							className="w-full h-full object-cover"
						/>
					)
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
						<FileText className="w-8 h-8 opacity-50 mb-2" />
						<span className="text-xs">Preview tidak tersedia</span>
					</div>
				)}

				<div
					className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm cursor-pointer"
					onClick={onClick}
				>
					<button
						type="button"
						className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 text-xs shadow-lg"
					>
						<Maximize2 className="w-4 h-4" /> Buka Dokumen
					</button>
				</div>
			</div>
		</div>
	);
}

function AssessmentViewer({ evaluations, section }: AssessmentViewerProps) {
	const [selectedEval, setSelectedEval] = useState<GeneralDocument | null>(
		null,
	);

	const filtered = evaluations.filter((e) => e.category === section.type);

	return (
		<div
			className={`bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden relative`}
		>
			<div
				className={`absolute top-0 left-0 w-full h-1.5 ${section.iconBg.split(" ")[0]}`}
			/>

			{/* Header */}
			<div className="p-6 pb-5 border-b border-slate-100 bg-slate-50/50">
				<div className="flex items-center gap-4 relative z-10">
					<div
						className={`w-12 h-12 rounded-2xl ${section.iconBg} flex items-center justify-center shadow-sm transform -rotate-3`}
					>
						<BarChart2 className="w-6 h-6" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-slate-800 tracking-tight">
							{section.title}
						</h2>
						<p className="text-slate-500 text-sm mt-1 font-medium">
							{section.subtitle}
						</p>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="p-6 flex-1 bg-slate-50/30 relative">
				<div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
				<div className="relative z-10">
					{filtered.length === 0 ? (
						<div className="h-48 flex flex-col items-center justify-center text-slate-500 gap-4 bg-white rounded-2xl border-2 border-slate-100 border-dashed">
							<div
								className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300`}
							>
								<FileText className="w-8 h-8" />
							</div>
							<div className="text-center px-4">
								<p className="text-base font-semibold text-slate-700">
									Belum ada data {section.title}
								</p>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{filtered.map((evaluation) => (
								<AssessmentDocumentCard
									key={evaluation.id}
									evaluation={evaluation}
									onClick={() => setSelectedEval(evaluation)}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Viewer Modal */}
			{selectedEval && selectedEval.document_url && (
				<DocumentViewerModal
					url={getBackendUrl(selectedEval.document_url)}
					title={selectedEval.title}
					description={selectedEval.description}
					onClose={() => setSelectedEval(null)}
				/>
			)}
		</div>
	);
}

export default function Assessment() {
	const { data, isLoading } = useKioskData();

	const evaluations: GeneralDocument[] = data?.assessment_docs ?? [];

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 w-full font-sans">
			{isLoading ? (
				<div className="space-y-6">
					{SECTIONS.map((section) => (
						<div
							key={section.type}
							className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden"
						>
							<div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
								<div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
								<div className="space-y-2">
									<div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
									<div className="h-4 bg-slate-100 rounded w-64 animate-pulse" />
								</div>
							</div>
							<div className="p-6 bg-slate-50/30">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="h-32 bg-slate-100 rounded-2xl animate-pulse"
										/>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="space-y-6">
					{SECTIONS.map((section) => (
						<AssessmentViewer
							key={section.type}
							evaluations={evaluations}
							section={section}
						/>
					))}
				</div>
			)}
		</div>
	);
}
