import { X } from "lucide-react";

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
	const computedIsPdf =
		isPdf !== undefined
			? isPdf
			: url.toLowerCase().endsWith(".pdf") ||
				url.includes("application/pdf") ||
				url.includes("/document");

	return (
		<div className="fixed inset-0 z-[120] bg-slate-900/95 flex items-center justify-center p-4 lg:p-8 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

			<div className="absolute top-6 left-6 right-20 z-10">
				<h3 className="text-white font-bold text-xl drop-shadow-md truncate">
					{title}
				</h3>
				{description && (
					<p className="text-white/80 text-sm mt-1 line-clamp-1">
						{description}
					</p>
				)}
			</div>

			<button
				type="button"
				onClick={onClose}
				className="absolute top-6 right-6 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-all shadow-lg backdrop-blur-md"
			>
				<X className="w-7 h-7" />
			</button>

			{computedIsPdf ? (
				<iframe
					src={`${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
					className="w-full h-full rounded-xl drop-shadow-2xl bg-white"
					title={title}
				/>
			) : (
				<img
					src={url}
					alt={title}
					className="max-w-full max-h-full object-contain rounded-xl drop-shadow-2xl"
				/>
			)}
		</div>
	);
}
