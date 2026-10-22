import {
	Calendar,
	Clock,
	ExternalLink,
	FileText,
	Maximize2,
	Megaphone,
	ShieldAlert,
	User,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getBackendUrl } from "@/lib/utils";
import type { Bulletin } from "@/types/api";

interface BulletinDetailModalProps {
	bulletin: Bulletin | null;
	onClose: () => void;
	onOpenViewer: (url: string, title: string, isPdf?: boolean) => void;
}

export function BulletinDetailModal({
	bulletin,
	onClose,
	onOpenViewer,
}: BulletinDetailModalProps) {
	const [imageError, setImageError] = useState(false);
	const [prevId, setPrevId] = useState(bulletin?.id);

	if (prevId !== bulletin?.id) {
		setPrevId(bulletin?.id);
		setImageError(false);
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (bulletin) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);

			return () => {
				document.body.style.overflow = originalOverflow;
				window.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [bulletin, onClose]);

	if (!bulletin || typeof document === "undefined") return null;

	const themeConfig = {
		health_safety: {
			color: "text-rose-600",
			bgLight: "bg-rose-50",
			border: "border-rose-200",
			badgeBg: "bg-rose-600",
			badgeText: "text-white",
			gradient: "from-rose-500 to-rose-700",
			icon: <ShieldAlert className="w-4 h-4" />,
			largeIcon: <ShieldAlert className="w-20 h-20 text-white/20" />,
			label: "K3 & Keselamatan",
		},
		policy: {
			color: "text-blue-700",
			bgLight: "bg-blue-50",
			border: "border-blue-200",
			badgeBg: "bg-blue-700",
			badgeText: "text-white",
			gradient: "from-blue-600 to-blue-800",
			icon: <FileText className="w-4 h-4" />,
			largeIcon: <FileText className="w-20 h-20 text-white/20" />,
			label: "Kebijakan",
		},
		event: {
			color: "text-emerald-600",
			bgLight: "bg-emerald-50",
			border: "border-emerald-200",
			badgeBg: "bg-emerald-600",
			badgeText: "text-white",
			gradient: "from-emerald-500 to-emerald-700",
			icon: <Calendar className="w-4 h-4" />,
			largeIcon: <Calendar className="w-20 h-20 text-white/20" />,
			label: "Acara Divisi",
		},
		general: {
			color: "text-slate-600",
			bgLight: "bg-slate-50",
			border: "border-slate-200",
			badgeBg: "bg-slate-700",
			badgeText: "text-white",
			gradient: "from-slate-600 to-slate-800",
			icon: <Megaphone className="w-4 h-4" />,
			largeIcon: <Megaphone className="w-20 h-20 text-white/20" />,
			label: "Informasi Umum",
		},
	};

	const theme = themeConfig[bulletin.type] || themeConfig.general;

	const formattedDate = new Date(bulletin.published_at).toLocaleDateString(
		"id-ID",
		{
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		},
	);

	const formattedExpiredDate = bulletin.expired_at
		? new Date(bulletin.expired_at).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: null;

	const imageUrl = bulletin.image_url ? getBackendUrl(bulletin.image_url) : "";
	const docUrl = bulletin.document_url
		? getBackendUrl(bulletin.document_url)
		: "";

	return createPortal(
		<div
			className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto animate-in fade-in duration-200"
			role="dialog"
			aria-modal="true"
			aria-labelledby="bulletin-modal-title"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col my-auto max-h-[92vh] border border-slate-200/80 animate-in zoom-in-95 duration-200">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full p-2.5 transition-all z-30 shadow-lg backdrop-blur-sm cursor-pointer hover:scale-105"
					title="Tutup (Esc)"
				>
					<X className="w-5 h-5 sm:w-6 sm:h-6" />
				</button>

				<div className="overflow-y-auto flex-1 custom-scrollbar">
					<div className="w-full h-56 sm:h-80 overflow-hidden shrink-0 relative bg-slate-900 group">
						{imageUrl && !imageError ? (
							<>
								<img
									src={imageUrl}
									alt={bulletin.title}
									onError={() => setImageError(true)}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-[2px] z-10">
									<button
										type="button"
										onClick={() =>
											onOpenViewer(imageUrl, bulletin.title, false)
										}
										className="bg-white/95 text-slate-900 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-xl text-xs sm:text-sm cursor-pointer"
									>
										<Maximize2 className="w-4 h-4 text-blue-600" /> Perbesar
										Gambar
									</button>
								</div>
							</>
						) : docUrl ? (
							<div className="w-full h-full relative bg-slate-800 flex items-center justify-center">
								<iframe
									src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
									className="w-full h-full border-0 pointer-events-none opacity-80"
									title={bulletin.title}
								/>
								<div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center gap-3 p-6 z-10">
									<FileText className="w-12 h-12 text-blue-400" />
									<button
										type="button"
										onClick={() => onOpenViewer(docUrl, bulletin.title, true)}
										className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-xl text-xs sm:text-sm"
									>
										<Maximize2 className="w-4 h-4" /> Buka Dokumen PDF (Layar
										Penuh)
									</button>
								</div>
							</div>
						) : (
							<div
								className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative overflow-hidden`}
							>
								{theme.largeIcon}
							</div>
						)}

						<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none z-0" />

						<div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
							<span
								className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-1.5 ${theme.badgeBg} ${theme.badgeText}`}
							>
								{theme.icon}
								{theme.label}
							</span>

							{formattedExpiredDate && (
								<span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white shadow-md backdrop-blur-md flex items-center gap-1 border border-amber-400/50">
									<Clock className="w-3.5 h-3.5" />
									Berlaku: {formattedExpiredDate}
								</span>
							)}
						</div>

						<div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-8 sm:right-8 z-10">
							<h2
								id="bulletin-modal-title"
								className="text-xl sm:text-3xl font-black text-white leading-snug drop-shadow-md"
							>
								{bulletin.title}
							</h2>
						</div>
					</div>

					<div className="p-6 sm:p-8 bg-white">
						<div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-500 pb-5 mb-6 border-b border-slate-100">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
									<User className="w-4 h-4" />
								</div>
								<div>
									<span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">
										Dipublikasikan Oleh
									</span>
									<span className="text-slate-800 font-bold">
										{bulletin.author}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
									<Calendar className="w-4 h-4" />
								</div>
								<div>
									<span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">
										Tanggal Rilis
									</span>
									<span className="text-slate-700 font-medium">
										{formattedDate}
									</span>
								</div>
							</div>
						</div>

						<div
							className="text-slate-700 text-sm sm:text-base leading-relaxed prose prose-slate max-w-none mb-8 font-sans"
							dangerouslySetInnerHTML={{ __html: bulletin.content }}
						/>

						{docUrl && (
							<div className="mt-8 pt-6 border-t border-slate-100">
								<h4 className="text-sm font-extrabold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
									<FileText className="w-4 h-4 text-rose-600" />
									Lampiran Dokumen Resmi
								</h4>
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
											<FileText className="w-6 h-6" />
										</div>
										<div>
											<p className="font-bold text-slate-800 text-sm">
												{bulletin.title}.pdf
											</p>
											<p className="text-xs text-slate-500 mt-0.5">
												Format PDF • Siap dilihat layar penuh atau diunduh
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2 w-full sm:w-auto">
										<button
											type="button"
											onClick={() => onOpenViewer(docUrl, bulletin.title, true)}
											className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105"
										>
											<Maximize2 className="w-4 h-4" /> Buka PDF
										</button>
										<a
											href={docUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-sm"
											title="Buka langsung di tab baru"
										>
											<ExternalLink className="w-4 h-4" />
										</a>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}
