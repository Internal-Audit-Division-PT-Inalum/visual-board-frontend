import {
	AlertTriangle,
	Archive,
	CheckCircle2,
	Package,
	Wrench,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { cn, getBackendUrl } from "@/lib/utils";
import type { KioskInventoryItem } from "@/types/api";

interface ItemCardProps {
	item: KioskInventoryItem;
}

export function ItemCard({ item }: ItemCardProps) {
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	// Prioritaskan thumbnail WebP yang ringan, fallback ke image_url asli
	const rawImageUrl = item.image_thumb_url || item.image_url;
	const imageUrl = rawImageUrl ? getBackendUrl(rawImageUrl) : "";

	const isAsset = item.type === "asset";
	const isLow = item.stock_status === "low";
	const isEmpty = item.stock_status === "empty" || item.current_stock <= 0;

	// Konfigurasi visual badge status stok
	const statusBadge = isEmpty
		? {
				label: "Habis",
				bg: "bg-rose-500/90 text-white border-rose-400",
				icon: <XCircle className="w-3.5 h-3.5" />,
				stockColor: "text-rose-600",
			}
		: isLow
			? {
					label: "Stok Rendah",
					bg: "bg-amber-500/90 text-white border-amber-400",
					icon: <AlertTriangle className="w-3.5 h-3.5" />,
					stockColor: "text-amber-600",
				}
			: {
					label: "Aman",
					bg: "bg-emerald-600/90 text-white border-emerald-400",
					icon: <CheckCircle2 className="w-3.5 h-3.5" />,
					stockColor: "text-[#0A2F66]",
				};

	const borrowedCount = isAsset ? (item.borrowed_quantity ?? 0) : 0;
	const totalAssetCount = isAsset
		? item.current_stock + borrowedCount
		: item.current_stock;

	return (
		<div className="relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:border-blue-400 hover:shadow-[0_12px_32px_rgb(59,130,246,0.12)] transition-all duration-300 overflow-hidden group h-full select-none">
			<div className="w-full h-40 sm:h-44 bg-slate-900 relative overflow-hidden shrink-0 flex items-center justify-center">
				{imageUrl && !imageError ? (
					<>
						{!imageLoaded && (
							<div className="absolute inset-0 bg-slate-800 animate-pulse" />
						)}
						<img
							src={imageUrl}
							alt={item.name}
							loading="lazy"
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageError(true)}
							className={cn(
								"w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
								imageLoaded ? "opacity-100" : "opacity-0",
							)}
						/>
					</>
				) : (
					<div
						className={cn(
							"w-full h-full flex flex-col items-center justify-center gap-2",
							isAsset
								? "bg-gradient-to-br from-[#0A2F66] to-[#1E40AF] text-white/40"
								: "bg-gradient-to-br from-slate-700 to-slate-900 text-white/30",
						)}
					>
						{isAsset ? (
							<Wrench className="w-14 h-14 transition-transform duration-500 group-hover:scale-110 text-blue-200/60" />
						) : (
							<Package className="w-14 h-14 transition-transform duration-500 group-hover:scale-110 text-amber-200/50" />
						)}
						<span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
							{isAsset ? "Barang Aset" : "Barang Habis Pakai"}
						</span>
					</div>
				)}

				<div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
					<span
						className={cn(
							"px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-1 border",
							statusBadge.bg,
						)}
					>
						{statusBadge.icon}
						{statusBadge.label}
					</span>
				</div>

				<div className="absolute top-3 right-3 z-10 pointer-events-none">
					<span
						className={cn(
							"px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-1 border",
							isAsset
								? "bg-indigo-600/90 text-white border-indigo-400"
								: "bg-slate-800/90 text-white border-slate-600",
						)}
					>
						{isAsset ? (
							<>
								<Archive className="w-3 h-3" /> Aset
							</>
						) : (
							<>
								<Package className="w-3 h-3" /> Consumable
							</>
						)}
					</span>
				</div>
			</div>

			<div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
				<div>
					<h3
						className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
						title={item.name}
					>
						{item.name}
					</h3>
				</div>

				<div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
							{isAsset ? "Tersedia di Rak" : "Stok Saat Ini"}
						</span>
						<div className="flex items-baseline gap-1.5">
							<span
								className={cn(
									"text-2xl sm:text-3xl font-black font-mono leading-none tracking-tight",
									statusBadge.stockColor,
								)}
							>
								{item.current_stock}
							</span>
							<span className="text-xs font-bold text-slate-500 uppercase">
								{item.unit}
							</span>
						</div>
					</div>

					{isAsset ? (
						<div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 flex items-center justify-between text-xs font-semibold">
							<div className="flex items-center gap-1.5 text-emerald-700">
								<span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
								<span>Tersedia: {item.current_stock}</span>
							</div>
							<div className="h-3 w-px bg-slate-200"></div>
							<div className="flex items-center gap-1.5 text-blue-700">
								<span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
								<span>Dipinjam: {borrowedCount}</span>
							</div>
							{totalAssetCount > 0 && (
								<>
									<div className="h-3 w-px bg-slate-200"></div>
									<div className="text-slate-500 text-[11px]">
										Total: {totalAssetCount}
									</div>
								</>
							)}
						</div>
					) : (
						<div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
							<span>Ambang Batas Minimum:</span>
							<span className="font-bold text-slate-600">
								{item.minimum_stock} {item.unit}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
