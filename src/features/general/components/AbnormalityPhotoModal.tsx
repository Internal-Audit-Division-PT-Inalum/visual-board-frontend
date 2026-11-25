import {
	ChevronLeft,
	ChevronRight,
	Columns2,
	ExternalLink,
	ImageOff,
	Loader2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getBackendUrl } from "@/lib/utils";
import type { Abnormality, AbnormalityPhoto } from "@/types/api";
import { getZoneBadgeStyle, STATUS_CONFIG } from "./AbnormalityFeed";

export type PhotoViewerMode = "before" | "after" | "compare";

export interface AbnormalityPhotoModalProps {
	abnormality: Abnormality;
	initialMode?: PhotoViewerMode;
	onClose: () => void;
}

interface GalleryImageFrameProps {
	photo: AbnormalityPhoto;
	alt: string;
	badgeLabel?: string;
	badgeTone?: "before" | "after";
}

function GalleryImageFrame({
	photo,
	alt,
	badgeLabel,
	badgeTone,
}: GalleryImageFrameProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const resolvedUrl = getBackendUrl(photo.url);

	return (
		<div className="relative flex-1 w-full h-full min-h-[260px] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/70 border border-white/10">
			{badgeLabel && (
				<span
					className={`absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md border shadow-md ${
						badgeTone === "after"
							? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
							: "bg-rose-500/20 text-rose-200 border-rose-400/40"
					}`}
				>
					<span
						className={`w-1.5 h-1.5 rounded-full ${
							badgeTone === "after" ? "bg-emerald-400" : "bg-rose-400"
						}`}
						aria-hidden="true"
					/>
					{badgeLabel}
				</span>
			)}

			{isLoading && !hasError && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-slate-400 z-10 pointer-events-none">
					<Loader2 className="w-8 h-8 animate-spin text-blue-400" />
					<span className="text-xs font-medium animate-pulse">
						Memuat Foto...
					</span>
				</div>
			)}

			{hasError || !resolvedUrl ? (
				<div className="flex flex-col items-center justify-center text-center p-6 text-slate-400">
					<ImageOff className="w-12 h-12 text-slate-600 mb-3" />
					<p className="text-sm font-bold text-slate-200 mb-1">
						Foto Gagal Dimuat
					</p>
					<p className="text-xs text-slate-400 mb-3 max-w-xs">
						Berkas gambar tidak dapat diakses atau telah dipindahkan.
					</p>
					{resolvedUrl && (
						<a
							href={resolvedUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
						>
							<ExternalLink className="w-3.5 h-3.5" />
							Buka Tautan Langsung
						</a>
					)}
				</div>
			) : (
				<img
					src={resolvedUrl}
					alt={alt}
					decoding="async"
					className={`max-w-full max-h-full object-contain p-2 sm:p-3 transition-opacity duration-300 ${
						isLoading ? "opacity-0" : "opacity-100"
					}`}
					onLoad={() => setIsLoading(false)}
					onError={() => {
						setIsLoading(false);
						setHasError(true);
					}}
				/>
			)}
		</div>
	);
}

export function AbnormalityPhotoModal({
	abnormality,
	initialMode,
	onClose,
}: AbnormalityPhotoModalProps) {
	const evidencePhotos = abnormality.evidence_photos ?? [];
	const resolutionPhotos = abnormality.resolution_photos ?? [];
	const hasBefore = evidencePhotos.length > 0;
	const hasAfter = resolutionPhotos.length > 0;
	const canCompare = hasBefore && hasAfter;

	const defaultMode: PhotoViewerMode =
		initialMode &&
		((initialMode === "compare" && canCompare) ||
			(initialMode === "before" && hasBefore) ||
			(initialMode === "after" && hasAfter))
			? initialMode
			: canCompare
				? "compare"
				: hasBefore
					? "before"
					: "after";

	const [mode, setMode] = useState<PhotoViewerMode>(defaultMode);
	const [beforeIndex, setBeforeIndex] = useState(0);
	const [afterIndex, setAfterIndex] = useState(0);

	const activePhotos = mode === "after" ? resolutionPhotos : evidencePhotos;
	const activeIndex = mode === "after" ? afterIndex : beforeIndex;

	const setActiveIndex = useCallback(
		(nextIndex: number) => {
			if (mode === "after") {
				setAfterIndex(nextIndex);
			} else {
				setBeforeIndex(nextIndex);
			}
		},
		[mode],
	);

	const goPrev = useCallback(() => {
		if (mode === "compare" || activePhotos.length <= 1) return;
		setActiveIndex(
			(activeIndex - 1 + activePhotos.length) % activePhotos.length,
		);
	}, [mode, activeIndex, activePhotos.length, setActiveIndex]);

	const goNext = useCallback(() => {
		if (mode === "compare" || activePhotos.length <= 1) return;
		setActiveIndex((activeIndex + 1) % activePhotos.length);
	}, [mode, activeIndex, activePhotos.length, setActiveIndex]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			} else if (e.key === "ArrowLeft") {
				goPrev();
			} else if (e.key === "ArrowRight") {
				goNext();
			}
		};

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose, goPrev, goNext]);

	if (typeof document === "undefined") return null;

	const statusCfg = STATUS_CONFIG[abnormality.status];
	const StatusIcon = statusCfg.icon;
	const zoneStyle = getZoneBadgeStyle(abnormality.zone_name);

	const currentPhoto =
		mode === "compare"
			? evidencePhotos[beforeIndex]
			: activePhotos[activeIndex];
	const externalHref = currentPhoto ? getBackendUrl(currentPhoto.url) : "";

	const formattedDate = abnormality.date_found
		? new Date(abnormality.date_found).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			})
		: "—";

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] bg-slate-950/92 backdrop-blur-md flex flex-col p-4 sm:p-6 gap-4 animate-in fade-in duration-200 font-sans"
			role="dialog"
			aria-modal="true"
			aria-label={`Dokumentasi Foto Temuan ${abnormality.zone_name}`}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					onClose();
				}
			}}
		>
			{/* Contextual Header */}
			<div className="flex flex-wrap items-start justify-between gap-3 shrink-0">
				<div className="min-w-0 flex-1 space-y-1.5">
					<div className="flex flex-wrap items-center gap-2">
						<span
							className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold text-[11px] leading-none whitespace-nowrap ${zoneStyle.pill}`}
						>
							<span
								className={`w-1.5 h-1.5 rounded-full shrink-0 ${zoneStyle.dot}`}
								aria-hidden="true"
							/>
							{abnormality.zone_name}
						</span>
						<span
							className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold leading-none ${statusCfg.cls}`}
						>
							<StatusIcon className="w-3 h-3" />
							{statusCfg.label}
						</span>
						<span className="text-xs font-medium text-slate-400">
							Ditemukan: {formattedDate}
						</span>
						{abnormality.finder_name && (
							<span className="text-xs text-slate-400 hidden sm:inline">
								• Penemu:{" "}
								<strong className="text-slate-200 font-semibold">
									{abnormality.finder_name}
								</strong>
							</span>
						)}
					</div>
					<h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2">
						{abnormality.description}
					</h3>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{externalHref && mode !== "compare" && (
						<a
							href={externalHref}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white text-xs font-semibold transition-all cursor-pointer"
							title="Buka foto resolusi penuh di tab baru"
						>
							<ExternalLink className="w-3.5 h-3.5" />
							<span className="hidden sm:inline">Resolusi Penuh</span>
						</a>
					)}
					<button
						type="button"
						onClick={onClose}
						aria-label="Tutup tampilan foto"
						className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer"
						title="Tutup (Esc)"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Mode Switcher Bar (Before / After / Compare) */}
			{(hasBefore || hasAfter) && (
				<div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
					<div
						className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10"
						role="tablist"
						aria-label="Mode tampilan foto temuan"
					>
						{canCompare && (
							<button
								type="button"
								role="tab"
								aria-selected={mode === "compare"}
								onClick={() => setMode("compare")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
									mode === "compare"
										? "bg-blue-600 text-white shadow-sm"
										: "text-slate-300 hover:text-white hover:bg-white/5"
								}`}
							>
								<Columns2 className="w-3.5 h-3.5" />
								Bandingkan (Before / After)
							</button>
						)}
						{hasBefore && (
							<button
								type="button"
								role="tab"
								aria-selected={mode === "before"}
								onClick={() => setMode("before")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
									mode === "before"
										? "bg-rose-600 text-white shadow-sm"
										: "text-slate-300 hover:text-white hover:bg-white/5"
								}`}
							>
								<span
									className="w-1.5 h-1.5 rounded-full bg-rose-300"
									aria-hidden="true"
								/>
								Bukti Temuan ({evidencePhotos.length})
							</button>
						)}
						{hasAfter && (
							<button
								type="button"
								role="tab"
								aria-selected={mode === "after"}
								onClick={() => setMode("after")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
									mode === "after"
										? "bg-emerald-600 text-white shadow-sm"
										: "text-slate-300 hover:text-white hover:bg-white/5"
								}`}
							>
								<span
									className="w-1.5 h-1.5 rounded-full bg-emerald-300"
									aria-hidden="true"
								/>
								Hasil Perbaikan ({resolutionPhotos.length})
							</button>
						)}
					</div>

					{mode !== "compare" && activePhotos.length > 1 && (
						<span className="text-xs font-semibold text-slate-400">
							Foto {activeIndex + 1} dari {activePhotos.length}
						</span>
					)}
				</div>
			)}

			{/* Main Viewport */}
			<div className="flex-1 min-h-0 w-full relative flex items-center justify-center">
				{mode === "compare" && canCompare ? (
					<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex flex-col gap-2 min-h-0">
							<GalleryImageFrame
								key={`before-${evidencePhotos[beforeIndex].id}`}
								photo={evidencePhotos[beforeIndex]}
								alt={`Foto sebelum perbaikan — ${abnormality.zone_name}`}
								badgeLabel={`Sebelum (${beforeIndex + 1}/${evidencePhotos.length})`}
								badgeTone="before"
							/>
							{evidencePhotos.length > 1 && (
								<div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
									{evidencePhotos.map((photo, idx) => (
										<button
											key={photo.id}
											type="button"
											onClick={() => setBeforeIndex(idx)}
											aria-label={`Pilih foto sebelum ${idx + 1}`}
											className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
												idx === beforeIndex
													? "border-rose-400 scale-105"
													: "border-white/15 opacity-60 hover:opacity-100"
											}`}
										>
											<img
												src={getBackendUrl(photo.thumb_url || photo.url)}
												alt={photo.name}
												className="w-full h-full object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						<div className="flex flex-col gap-2 min-h-0">
							<GalleryImageFrame
								key={`after-${resolutionPhotos[afterIndex].id}`}
								photo={resolutionPhotos[afterIndex]}
								alt={`Foto sesudah perbaikan — ${abnormality.zone_name}`}
								badgeLabel={`Sesudah (${afterIndex + 1}/${resolutionPhotos.length})`}
								badgeTone="after"
							/>
							{resolutionPhotos.length > 1 && (
								<div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
									{resolutionPhotos.map((photo, idx) => (
										<button
											key={photo.id}
											type="button"
											onClick={() => setAfterIndex(idx)}
											aria-label={`Pilih foto sesudah ${idx + 1}`}
											className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
												idx === afterIndex
													? "border-emerald-400 scale-105"
													: "border-white/15 opacity-60 hover:opacity-100"
											}`}
										>
											<img
												src={getBackendUrl(photo.thumb_url || photo.url)}
												alt={photo.name}
												className="w-full h-full object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				) : currentPhoto ? (
					<div className="w-full h-full relative flex items-center justify-center">
						{activePhotos.length > 1 && (
							<button
								type="button"
								onClick={goPrev}
								aria-label="Foto sebelumnya"
								className="absolute left-3 z-20 p-2.5 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-white/15 text-white shadow-lg transition-all cursor-pointer"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
						)}

						<GalleryImageFrame
							key={`${mode}-${currentPhoto.id}`}
							photo={currentPhoto}
							alt={`${mode === "after" ? "Hasil perbaikan" : "Bukti temuan"} ${abnormality.zone_name} — ${currentPhoto.name}`}
							badgeLabel={
								mode === "after"
									? "Hasil Perbaikan (After)"
									: "Bukti Temuan (Before)"
							}
							badgeTone={mode === "after" ? "after" : "before"}
						/>

						{activePhotos.length > 1 && (
							<button
								type="button"
								onClick={goNext}
								aria-label="Foto berikutnya"
								className="absolute right-3 z-20 p-2.5 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-white/15 text-white shadow-lg transition-all cursor-pointer"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						)}
					</div>
				) : null}
			</div>

			{/* Thumbnail Strip for Single Gallery Mode */}
			{mode !== "compare" && activePhotos.length > 1 && (
				<div className="flex items-center justify-center gap-2 overflow-x-auto py-1 shrink-0">
					{activePhotos.map((photo, idx) => (
						<button
							key={photo.id}
							type="button"
							onClick={() => setActiveIndex(idx)}
							aria-label={`Lihat foto ${idx + 1}`}
							className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
								idx === activeIndex
									? "border-blue-400 scale-105 shadow-md"
									: "border-white/15 opacity-55 hover:opacity-100"
							}`}
						>
							<img
								src={getBackendUrl(photo.thumb_url || photo.url)}
								alt={photo.name}
								className="w-full h-full object-cover"
							/>
						</button>
					))}
				</div>
			)}

			{/* Footer Countermeasure Context */}
			{(abnormality.countermeasure_plan ||
				abnormality.countermeasure_actual) && (
				<div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
					{abnormality.countermeasure_plan && (
						<div className="min-w-0">
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
								Rencana Penanggulangan
							</span>
							<p className="text-slate-200 line-clamp-2">
								{abnormality.countermeasure_plan}
							</p>
						</div>
					)}
					{abnormality.countermeasure_actual && (
						<div className="min-w-0">
							<span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
								Aktual Penanggulangan
							</span>
							<p className="text-emerald-200 line-clamp-2">
								{abnormality.countermeasure_actual}
							</p>
						</div>
					)}
				</div>
			)}
		</div>,
		document.body,
	);
}
