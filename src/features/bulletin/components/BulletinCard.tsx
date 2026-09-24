import {
	Calendar,
	Clock,
	FileText,
	Maximize2,
	Megaphone,
	ShieldAlert,
	User,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DocumentViewerModal } from "@/components/shared/DocumentViewerModal";
import { getBackendUrl } from "@/lib/utils";
import type { Bulletin } from "@/types/api";

interface BulletinCardProps {
	bulletin: Bulletin;
}

export function BulletinCard({ bulletin }: BulletinCardProps) {
	const [imageError, setImageError] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewerUrl, setViewerUrl] = useState<string | null>(null);

	const themeConfig = {
		health_safety: {
			color: "text-rose-600",
			bgLight: "bg-rose-50",
			border: "border-rose-200",
			badgeBg: "bg-rose-600",
			badgeText: "text-white",
			gradient: "from-rose-400 to-rose-600",
			icon: <ShieldAlert className="w-4 h-4" />,
			largeIcon: <ShieldAlert className="w-16 h-16 text-white opacity-20" />,
			label: "K3 & Keselamatan",
		},
		policy: {
			color: "text-blue-700",
			bgLight: "bg-blue-50",
			border: "border-blue-200",
			badgeBg: "bg-blue-700",
			badgeText: "text-white",
			gradient: "from-blue-500 to-blue-700",
			icon: <FileText className="w-4 h-4" />,
			largeIcon: <FileText className="w-16 h-16 text-white opacity-20" />,
			label: "Kebijakan",
		},
		event: {
			color: "text-emerald-600",
			bgLight: "bg-emerald-50",
			border: "border-emerald-200",
			badgeBg: "bg-emerald-600",
			badgeText: "text-white",
			gradient: "from-emerald-400 to-emerald-600",
			icon: <Calendar className="w-4 h-4" />,
			largeIcon: <Calendar className="w-16 h-16 text-white opacity-20" />,
			label: "Acara Divisi",
		},
		general: {
			color: "text-slate-600",
			bgLight: "bg-slate-50",
			border: "border-slate-200",
			badgeBg: "bg-slate-700",
			badgeText: "text-white",
			gradient: "from-slate-500 to-slate-700",
			icon: <Megaphone className="w-4 h-4" />,
			largeIcon: <Megaphone className="w-16 h-16 text-white opacity-20" />,
			label: "Informasi Umum",
		},
	};

	const theme = themeConfig[bulletin.type] || themeConfig.general;

	const formattedDate = new Date(bulletin.published_at).toLocaleDateString(
		"id-ID",
		{
			weekday: "long",
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		},
	);

	const formattedExpiredDate = bulletin.expired_at
		? new Date(bulletin.expired_at).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: null;

	const imageUrl = getBackendUrl(bulletin.image_url);
	const docUrl = getBackendUrl(bulletin.document_url);

	return (
		<div className="relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group h-full">
			{}
			<div className="w-full h-48 sm:h-52 overflow-hidden shrink-0 relative bg-slate-100">
				{imageUrl && !imageError ? (
					<div className="w-full h-full relative group/imgcard bg-white">
						<img
							src={imageUrl}
							alt={bulletin.title}
							onError={() => setImageError(true)}
							className="w-full h-full object-cover transition-transform duration-700 group-hover/imgcard:scale-110"
						/>
						<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/imgcard:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px] z-10">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setViewerUrl(imageUrl);
								}}
								className="bg-white/90 text-slate-800 px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg text-xs"
							>
								<Maximize2 className="w-4 h-4" /> Perbesar Gambar
							</button>
						</div>
					</div>
				) : docUrl ? (
					<div className="w-full h-full relative group/pdfcard bg-white">
						<iframe
							src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
							className="w-full h-full border-0 pointer-events-none object-cover"
							title={bulletin.title}
						/>
						<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/pdfcard:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px] z-10">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setViewerUrl(docUrl);
								}}
								className="bg-white/90 text-slate-800 px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg text-xs"
							>
								<FileText className="w-4 h-4" /> Buka PDF
							</button>
						</div>
					</div>
				) : (
					<div
						className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
					>
						{theme.largeIcon}
					</div>
				)}

				{}
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

				{}
				<div className="absolute top-4 left-4 flex flex-col gap-2">
					{formattedExpiredDate && (
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/90 text-white shadow-sm backdrop-blur-md w-fit border border-red-400/50">
							<Clock className="w-3 h-3" />
							<span className="font-bold text-[9px] uppercase tracking-wider">
								Exp: {formattedExpiredDate}
							</span>
						</div>
					)}
				</div>
			</div>

			{}
			<div className="p-5 sm:p-6 flex flex-col flex-1 bg-white">
				<h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
					{bulletin.title}
				</h3>
				<div
					className="text-slate-600 text-sm leading-relaxed prose prose-sm prose-slate max-w-none line-clamp-4 overflow-hidden mb-4"
					dangerouslySetInnerHTML={{ __html: bulletin.content }}
				/>

				{}
				<div className="mt-auto">
					<button
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-bold transition-colors w-full justify-center group/btn"
					>
						Baca Selengkapnya
					</button>
				</div>
			</div>

			{}
			{}
			{isModalOpen && (
				<div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm overflow-y-auto">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col my-auto max-h-[90vh]">
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsModalOpen(false);
							}}
							className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full p-2 transition-colors z-[110]"
						>
							<X className="w-5 h-5 sm:w-6 sm:h-6" />
						</button>

						<div className="overflow-y-auto flex-1 custom-scrollbar">
							{}
							<div className="w-full h-48 sm:h-72 overflow-hidden shrink-0 relative bg-slate-100 group">
								{imageUrl && !imageError ? (
									<>
										<img
											src={imageUrl}
											alt={bulletin.title}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px] z-10">
											<button
												type="button"
												onClick={() => setViewerUrl(imageUrl)}
												className="bg-white/90 text-slate-800 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg text-sm cursor-pointer"
											>
												<Maximize2 className="w-4 h-4" /> Perbesar Gambar
											</button>
										</div>
									</>
								) : docUrl ? (
									<>
										<iframe
											src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
											className="w-full h-full border-0 pointer-events-none object-cover"
											title={bulletin.title}
										/>
										<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px] z-10">
											<button
												type="button"
												onClick={() => setViewerUrl(docUrl)}
												className="bg-white/90 text-slate-800 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg text-sm"
											>
												<FileText className="w-4 h-4" /> Perbesar PDF
											</button>
										</div>
									</>
								) : (
									<div
										className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
									>
										{theme.largeIcon}
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none z-0" />
								<div className="absolute bottom-6 left-6 right-6">
									<h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
										{bulletin.title}
									</h2>
								</div>
							</div>

							{}
							<div className="p-6 sm:p-8 bg-white">
								<div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500 mb-8 pb-4 border-b border-slate-100">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4 text-slate-400" />
										<span>{bulletin.author}</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-slate-400" />
										<span>{formattedDate}</span>
									</div>
									{formattedExpiredDate && (
										<div className="flex items-center gap-2 text-red-500 bg-red-50 px-2.5 py-1 rounded-md">
											<Clock className="w-4 h-4" />
											<span>Berlaku Hingga: {formattedExpiredDate}</span>
										</div>
									)}
								</div>

								<div
									className="text-slate-700 text-base sm:text-lg leading-relaxed prose prose-slate max-w-none mb-8"
									dangerouslySetInnerHTML={{ __html: bulletin.content }}
								/>

								{docUrl && (
									<div className="mt-8 pt-6 border-t border-slate-100">
										<h4 className="text-sm font-bold text-slate-800 mb-3">
											Lampiran Dokumen
										</h4>
										<button
											onClick={() => setViewerUrl(docUrl)}
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

			{}
			{viewerUrl && (
				<DocumentViewerModal
					url={viewerUrl}
					title={bulletin.title}
					onClose={() => setViewerUrl(null)}
				/>
			)}
		</div>
	);
}
