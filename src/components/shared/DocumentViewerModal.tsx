import { ExternalLink, FileText, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getBackendUrl } from "@/lib/utils";

export interface DocumentViewerModalProps {
	url: string;
	title: string;
	description?: string | null;
	isPdf?: boolean;
	onClose: () => void;
}

export function DocumentViewerModal({
	url,
	title,
	description,
	isPdf,
	onClose,
}: DocumentViewerModalProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const resolvedUrl = getBackendUrl(url);

	const computedIsPdf =
		isPdf !== undefined
			? isPdf
			: resolvedUrl.toLowerCase().endsWith(".pdf") ||
				resolvedUrl.includes("application/pdf") ||
				resolvedUrl.includes("/document");

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] bg-slate-950/95 flex flex-col p-4 sm:p-6 lg:p-8 pt-20 backdrop-blur-md animate-in fade-in duration-200 select-none"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />

			<div className="absolute top-5 left-6 right-36 z-10">
				<h3 className="text-white font-extrabold text-lg sm:text-xl drop-shadow-md truncate">
					{title}
				</h3>
				{description && (
					<p className="text-slate-300 text-xs sm:text-sm mt-0.5 line-clamp-1 drop-shadow">
						{description}
					</p>
				)}
			</div>

			<div className="absolute top-5 right-6 z-10 flex items-center gap-2">
				{resolvedUrl && (
					<a
						href={resolvedUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-2.5 transition-all shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold px-3.5"
						title="Buka di tab baru"
					>
						<ExternalLink className="w-4 h-4" />
						<span className="hidden sm:inline">Tab Baru</span>
					</a>
				)}

				<button
					type="button"
					onClick={onClose}
					className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-2.5 transition-all shadow-lg backdrop-blur-md cursor-pointer"
					title="Tutup (Esc)"
				>
					<X className="w-6 h-6" />
				</button>
			</div>

			<div className="flex-1 w-full relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800">
				{isLoading && !hasError && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-10 pointer-events-none">
						<Loader2 className="w-10 h-10 animate-spin text-blue-500" />
						<p className="text-xs sm:text-sm font-medium animate-pulse">
							Memuat Dokumen...
						</p>
					</div>
				)}

				{hasError ? (
					<div className="flex flex-col items-center justify-center text-center p-8 max-w-md bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-400">
						<FileText className="w-16 h-16 text-slate-600 mb-4" />
						<h4 className="text-lg font-bold text-slate-200 mb-2">
							Gagal Memuat Berkas
						</h4>
						<p className="text-sm text-slate-400 mb-4">
							Berkas mungkin sedang tidak tersedia atau format tidak didukung
							oleh peramban Anda.
						</p>
						{resolvedUrl && (
							<a
								href={resolvedUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg inline-flex items-center gap-2"
							>
								<ExternalLink className="w-4 h-4" /> Buka Tautan Langsung
							</a>
						)}
					</div>
				) : computedIsPdf ? (
					<iframe
						src={`${resolvedUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
						className="w-full h-full rounded-xl drop-shadow-2xl bg-white border-0"
						title={title}
						onLoad={() => setIsLoading(false)}
						onError={() => {
							setIsLoading(false);
							setHasError(true);
						}}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
						<img
							src={resolvedUrl}
							alt={title}
							className={`max-w-full max-h-full object-contain rounded-xl drop-shadow-2xl transition-opacity duration-300 ${
								isLoading ? "opacity-0" : "opacity-100"
							}`}
							onLoad={() => setIsLoading(false)}
							onError={() => {
								setIsLoading(false);
								setHasError(true);
							}}
						/>
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
