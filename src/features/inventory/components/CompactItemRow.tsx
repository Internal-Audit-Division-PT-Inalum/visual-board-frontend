import { Package, Wrench } from "lucide-react";
import { useState } from "react";
import { cn, getBackendUrl } from "@/lib/utils";
import type { KioskInventoryItem } from "@/types/api";

interface CompactItemRowProps {
	item: KioskInventoryItem;
}

export function CompactItemRow({ item }: CompactItemRowProps) {
	const [imageError, setImageError] = useState(false);

	const rawImageUrl = item.image_thumb_url || item.image_url;
	const imageUrl = rawImageUrl ? getBackendUrl(rawImageUrl) : "";

	const isAsset = item.type === "asset";
	const isEmpty = item.stock_status === "empty" || item.current_stock <= 0;
	const isLow = !isEmpty && item.stock_status === "low";
	const borrowedCount = isAsset ? (item.borrowed_quantity ?? 0) : 0;

	const statusStyles = isEmpty
		? {
				dot: "bg-rose-500",
				pill: "bg-rose-50 text-rose-700 border-rose-200",
				rowBorder: "border-rose-200/70 hover:border-rose-300",
			}
		: isLow
			? {
					dot: "bg-amber-500",
					pill: "bg-amber-50 text-amber-800 border-amber-200",
					rowBorder: "border-amber-200/70 hover:border-amber-300",
				}
			: {
					dot: "bg-emerald-500",
					pill: "bg-emerald-50 text-emerald-800 border-emerald-200",
					rowBorder: "border-slate-200/80 hover:border-blue-300",
				};

	return (
		<div
			data-testid="compact-item-row"
			className={cn(
				"flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-white border transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.03)] select-none",
				statusStyles.rowBorder,
			)}
		>
			<div className="flex items-center gap-2.5 min-w-0 flex-1">
				<span
					className={cn("w-2 h-2 rounded-full shrink-0", statusStyles.dot)}
					aria-hidden="true"
				/>

				{imageUrl && !imageError ? (
					<img
						src={imageUrl}
						alt={item.name}
						loading="lazy"
						onError={() => setImageError(true)}
						className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
					/>
				) : (
					<div
						className={cn(
							"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
							isAsset
								? "bg-indigo-50 text-indigo-600 border-indigo-100"
								: "bg-slate-100 text-slate-500 border-slate-200/80",
						)}
					>
						{isAsset ? (
							<Wrench className="w-4 h-4" />
						) : (
							<Package className="w-4 h-4" />
						)}
					</div>
				)}

				<div className="min-w-0 flex-1">
					<p
						className="text-xs sm:text-[13px] font-bold text-slate-800 leading-tight truncate"
						title={item.name}
					>
						{item.name}
					</p>
					<p className="text-[10px] font-medium text-slate-400 leading-tight mt-0.5 truncate">
						{isAsset
							? `Aset${borrowedCount > 0 ? ` • Dipinjam: ${borrowedCount}` : ""}`
							: `Consumable • Min: ${item.minimum_stock} ${item.unit}`}
					</p>
				</div>
			</div>

			<div
				className={cn(
					"shrink-0 px-2.5 py-1 rounded-lg border font-mono text-xs font-black tracking-tight whitespace-nowrap",
					statusStyles.pill,
				)}
			>
				{item.current_stock}{" "}
				<span className="font-sans text-[10px] font-bold uppercase opacity-80">
					{item.unit}
				</span>
			</div>
		</div>
	);
}
