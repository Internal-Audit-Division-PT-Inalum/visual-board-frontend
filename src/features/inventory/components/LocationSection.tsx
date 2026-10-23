import { AlertTriangle, CheckCircle2, MapPin, Package } from "lucide-react";
import type { KioskLocationWithItems } from "@/types/api";
import { ItemCard } from "./ItemCard";

interface LocationSectionProps {
	location: KioskLocationWithItems;
}

export function LocationSection({ location }: LocationSectionProps) {
	const totalItems = location.items.length;
	const safeCount = location.items.filter(
		(i) => i.stock_status === "ok",
	).length;
	const attentionCount = location.items.filter(
		(i) => i.stock_status === "low" || i.stock_status === "empty",
	).length;

	return (
		<section className="flex flex-col gap-4">
			{/* Location Header Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0A2F66] to-[#1E40AF] text-white flex items-center justify-center shrink-0 shadow-md">
						<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
								{location.name}
							</h2>
							<span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
								{location.code}
							</span>
						</div>
						<p className="text-xs text-slate-500 font-medium">
							Titik Penyimpanan Inventaris Internal
						</p>
					</div>
				</div>

				{/* Location Quick Stats */}
				<div className="flex items-center gap-2 flex-wrap">
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
						<Package className="w-3.5 h-3.5 text-slate-500" />
						{totalItems} Total Barang
					</span>

					{safeCount > 0 && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
							<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
							{safeCount} Aman
						</span>
					)}

					{attentionCount > 0 && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
							<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
							{attentionCount} Perlu Perhatian
						</span>
					)}
				</div>
			</div>

			{/* Grid Barang */}
			{totalItems === 0 ? (
				<div className="bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
					<Package className="w-10 h-10 text-slate-300" />
					<p className="text-sm font-bold text-slate-500">
						Belum ada barang aktif terdaftar di lokasi ini.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 items-stretch">
					{location.items.map((item) => (
						<div key={item.id} className="min-h-[320px] flex flex-col">
							<ItemCard item={item} />
						</div>
					))}
				</div>
			)}
		</section>
	);
}
