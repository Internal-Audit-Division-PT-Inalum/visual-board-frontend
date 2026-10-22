import {
	ArrowRight,
	Calendar,
	Clock,
	FileText,
	Maximize2,
	Megaphone,
	ShieldAlert,
	User,
} from "lucide-react";
import { useState } from "react";
import { getBackendUrl } from "@/lib/utils";
import type { Bulletin } from "@/types/api";

interface BulletinCardProps {
	bulletin: Bulletin;
	onSelect: (bulletin: Bulletin) => void;
	onOpenViewer: (url: string, title: string, isPdf?: boolean) => void;
}

export function BulletinCard({
	bulletin,
	onSelect,
	onOpenViewer,
}: BulletinCardProps) {
	const [imageError, setImageError] = useState(false);

	const themeConfig = {
		health_safety: {
			color: "text-rose-600",
			bgLight: "bg-rose-50",
			border: "border-rose-200",
			badgeBg: "bg-rose-600",
			badgeText: "text-white",
			gradient: "from-rose-500 to-rose-700",
			icon: <ShieldAlert className="w-3.5 h-3.5" />,
			largeIcon: <ShieldAlert className="w-16 h-16 text-white/20" />,
			label: "K3 & Safety",
		},
		policy: {
			color: "text-blue-700",
			bgLight: "bg-blue-50",
			border: "border-blue-200",
			badgeBg: "bg-blue-700",
			badgeText: "text-white",
			gradient: "from-blue-600 to-blue-800",
			icon: <FileText className="w-3.5 h-3.5" />,
			largeIcon: <FileText className="w-16 h-16 text-white/20" />,
			label: "Kebijakan",
		},
		event: {
			color: "text-emerald-600",
			bgLight: "bg-emerald-50",
			border: "border-emerald-200",
			badgeBg: "bg-emerald-600",
			badgeText: "text-white",
			gradient: "from-emerald-500 to-emerald-700",
			icon: <Calendar className="w-3.5 h-3.5" />,
			largeIcon: <Calendar className="w-16 h-16 text-white/20" />,
			label: "Acara",
		},
		general: {
			color: "text-slate-600",
			bgLight: "bg-slate-50",
			border: "border-slate-200",
			badgeBg: "bg-slate-700",
			badgeText: "text-white",
			gradient: "from-slate-600 to-slate-800",
			icon: <Megaphone className="w-3.5 h-3.5" />,
			largeIcon: <Megaphone className="w-16 h-16 text-white/20" />,
			label: "Umum",
		},
	};

	const theme = themeConfig[bulletin.type] || themeConfig.general;

	const formattedDate = new Date(bulletin.published_at).toLocaleDateString(
		"id-ID",
		{
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	);

	const formattedExpiredDate = bulletin.expired_at
		? new Date(bulletin.expired_at).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: null;

	const imageUrl = bulletin.image_url ? getBackendUrl(bulletin.image_url) : "";
	const docUrl = bulletin.document_url
		? getBackendUrl(bulletin.document_url)
		: "";

	const plainText = bulletin.content
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	return (
		<div
			className="relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:border-blue-400 hover:shadow-[0_12px_32px_rgb(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group h-full cursor-pointer select-none"
			onClick={() => onSelect(bulletin)}
		>
			<div className="w-full h-48 overflow-hidden shrink-0 relative bg-slate-900">
				{imageUrl && !imageError ? (
					<div className="w-full h-full relative group/img bg-slate-900">
						<img
							src={imageUrl}
							alt={bulletin.title}
							onError={() => setImageError(true)}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onOpenViewer(imageUrl, bulletin.title, false);
								}}
								className="bg-white/95 hover:bg-white text-slate-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg text-xs cursor-pointer"
							>
								<Maximize2 className="w-3.5 h-3.5 text-blue-600" /> Perbesar
							</button>
						</div>
					</div>
				) : docUrl ? (
					<div className="w-full h-full relative group/pdf bg-slate-800">
						<iframe
							src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
							className="w-full h-full border-0 pointer-events-none opacity-80"
							title={bulletin.title}
						/>
						<div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/pdf:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onOpenViewer(docUrl, bulletin.title, true);
								}}
								className="bg-white/95 hover:bg-white text-slate-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg text-xs cursor-pointer"
							>
								<FileText className="w-3.5 h-3.5 text-rose-600" /> Buka PDF
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

				<div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
					<span
						className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md flex items-center gap-1 w-fit ${theme.badgeBg} ${theme.badgeText}`}
					>
						{theme.icon}
						{theme.label}
					</span>

					{formattedExpiredDate && (
						<span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1 w-fit border border-amber-400/50">
							<Clock className="w-2.5 h-2.5" />
							Exp: {formattedExpiredDate}
						</span>
					)}
				</div>
			</div>

			<div className="p-5 flex flex-col flex-1 bg-white">
				<h3 className="text-base font-extrabold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
					{bulletin.title}
				</h3>

				<p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
					{plainText || "Tidak ada deskripsi teks untuk pengumuman ini."}
				</p>

				<div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-3">
					<div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
						<span className="flex items-center gap-1.5 truncate max-w-[150px]">
							<User className="w-3 h-3 text-slate-400 shrink-0" />
							{bulletin.author}
						</span>
						<span className="flex items-center gap-1 shrink-0">
							<Calendar className="w-3 h-3 text-slate-400" />
							{formattedDate}
						</span>
					</div>

					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onSelect(bulletin);
						}}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/80 rounded-xl text-xs font-bold transition-all w-full cursor-pointer group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 shadow-sm"
					>
						Baca Selengkapnya
						<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
					</button>
				</div>
			</div>
		</div>
	);
}
