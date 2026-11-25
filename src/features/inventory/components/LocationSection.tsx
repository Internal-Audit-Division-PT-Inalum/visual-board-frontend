import {
	AlertTriangle,
	CheckCircle2,
	Layers,
	MapPin,
	Package,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
	filterKioskItemsByStatus,
	getRackCompartmentLayout,
	groupKioskItemsByRack,
	type InventoryStockFilter,
	type InventoryViewMode,
} from "@/features/inventory/lib/rackGrouping";
import { cn } from "@/lib/utils";
import type { KioskLocationWithItems } from "@/types/api";
import { CompactItemRow } from "./CompactItemRow";
import { ItemCard } from "./ItemCard";

interface LocationSectionProps {
	location: KioskLocationWithItems;
	viewMode?: InventoryViewMode;
	stockFilter?: InventoryStockFilter;
}

export function LocationSection({
	location,
	viewMode = "compact",
	stockFilter = "all",
}: LocationSectionProps) {
	const [selectedRack, setSelectedRack] = useState<string>("all");

	const filteredItems = useMemo(
		() => filterKioskItemsByStatus(location.items, stockFilter),
		[location.items, stockFilter],
	);

	const rackGroups = useMemo(
		() => groupKioskItemsByRack(filteredItems),
		[filteredItems],
	);

	const namedRacks = useMemo(
		() => rackGroups.filter((group) => group.rackCode !== null),
		[rackGroups],
	);

	const activeRack = useMemo(() => {
		if (selectedRack === "all") return "all";
		const stillExists = namedRacks.some((r) => r.rackCode === selectedRack);
		return stillExists ? selectedRack : "all";
	}, [namedRacks, selectedRack]);

	const hasMultiRacks = namedRacks.length > 0;

	const visibleGroups = useMemo(() => {
		if (activeRack === "all") {
			return rackGroups;
		}

		return rackGroups.filter((group) => group.rackCode === activeRack);
	}, [rackGroups, activeRack]);

	const totalItems = filteredItems.length;
	const safeCount = filteredItems.filter((i) => i.stock_status === "ok").length;
	const attentionCount = filteredItems.filter(
		(i) => i.stock_status === "low" || i.stock_status === "empty",
	).length;

	return (
		<section className="flex flex-col gap-4 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
			<div className="flex flex-col gap-3 border-b border-slate-200/80 pb-3.5">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0A2F66] to-[#1E40AF] text-white flex items-center justify-center shrink-0 shadow-md">
							<MapPin className="w-5 h-5" />
						</div>
						<div>
							<div className="flex items-center gap-2 flex-wrap">
								<h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
									{location.name}
								</h2>
								<span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
									{location.code}
								</span>
							</div>
							<p className="text-xs text-slate-500 font-medium mt-0.5">
								{location.description ||
									"Lemari Penyimpanan Inventaris Internal"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						{hasMultiRacks && (
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0A2F66] border border-blue-200">
								<Layers className="w-3.5 h-3.5 text-blue-600" />
								{namedRacks.length} Rak
							</span>
						)}

						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
							<Package className="w-3.5 h-3.5 text-slate-500" />
							{totalItems} Barang
						</span>

						{safeCount > 0 && (
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
								<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
								{safeCount} Aman
							</span>
						)}

						{attentionCount > 0 && (
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
								<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
								{attentionCount} Perlu Perhatian
							</span>
						)}
					</div>
				</div>

				{namedRacks.length > 1 && (
					<div
						className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide"
						role="tablist"
						aria-label={`Filter rak di ${location.name}`}
					>
						<button
							type="button"
							role="tab"
							aria-selected={activeRack === "all"}
							onClick={() => setSelectedRack("all")}
							className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
								activeRack === "all"
									? "bg-[#0A2F66] text-white border-[#0A2F66] shadow-sm"
									: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
							}`}
						>
							Semua Rak ({totalItems})
						</button>

						{namedRacks.map((rack) => {
							const code = rack.rackCode ?? "";
							const isSelected = activeRack === code;
							return (
								<button
									key={code}
									type="button"
									role="tab"
									aria-selected={isSelected}
									onClick={() => setSelectedRack(code)}
									className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
										isSelected
											? "bg-[#0A2F66] text-white border-[#0A2F66] shadow-sm"
											: "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-[#0A2F66]"
									}`}
								>
									Rak {code}{" "}
									<span
										className={isSelected ? "text-blue-200" : "text-slate-400"}
									>
										({rack.items.length})
									</span>
								</button>
							);
						})}
					</div>
				)}
			</div>

			{totalItems === 0 ? (
				<div className="bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-1.5">
					<Package className="w-8 h-8 text-slate-300" />
					<p className="text-xs sm:text-sm font-bold text-slate-500">
						{stockFilter === "all"
							? "Belum ada barang aktif terdaftar di lemari ini."
							: "Tidak ada barang yang cocok dengan filter status pada lemari ini."}
					</p>
				</div>
			) : viewMode === "compact" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 items-start">
					{visibleGroups.map((rack) => {
						const layout = getRackCompartmentLayout(
							rack.items.length,
							activeRack !== "all" || !hasMultiRacks,
						);

						return (
							<div
								key={`${location.id}-${rack.rackCode ?? "umum"}`}
								data-testid={`rack-compartment-${rack.rackCode ?? "umum"}`}
								className={cn(
									"flex flex-col gap-2.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 p-3",
									layout.containerSpanClass,
								)}
							>
								<div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200/70">
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0A2F66] text-white font-mono text-[11px] font-black tracking-wide">
											{rack.label}
										</span>
										<span className="text-[11px] font-bold text-slate-500">
											{rack.items.length} Item
										</span>
									</div>

									<div className="flex items-center gap-1 text-[10px] font-bold">
										{rack.safeCount > 0 && (
											<span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
												{rack.safeCount} Aman
											</span>
										)}
										{rack.attentionCount > 0 && (
											<span className="text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
												{rack.attentionCount} Rendah
											</span>
										)}
									</div>
								</div>

								<div className={cn("grid gap-2", layout.innerGridClass)}>
									{rack.items.map((item) => (
										<CompactItemRow key={item.id} item={item} />
									))}
								</div>
							</div>
						);
					})}
				</div>
			) : hasMultiRacks ? (
				<div className="flex flex-col gap-6">
					{visibleGroups.map((rack) => (
						<div
							key={`${location.id}-${rack.rackCode ?? "umum"}`}
							className="flex flex-col gap-3.5"
						>
							<div className="flex items-center justify-between gap-3 px-1">
								<div className="flex items-center gap-2.5">
									<span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#0A2F66]/10 text-[#0A2F66] font-mono text-xs font-black tracking-wide border border-[#0A2F66]/15">
										{rack.label}
									</span>
									<span className="text-xs font-semibold text-slate-500">
										{rack.items.length} Item
									</span>
								</div>

								<div className="flex-1 border-t border-dashed border-slate-200 hidden sm:block"></div>

								<div className="flex items-center gap-1.5 text-[11px] font-bold">
									{rack.safeCount > 0 && (
										<span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
											{rack.safeCount} Aman
										</span>
									)}
									{rack.attentionCount > 0 && (
										<span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
											{rack.attentionCount} Rendah/Habis
										</span>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 items-stretch">
								{rack.items.map((item) => (
									<div key={item.id} className="min-h-[320px] flex flex-col">
										<ItemCard item={item} />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 items-stretch">
					{filteredItems.map((item) => (
						<div key={item.id} className="min-h-[320px] flex flex-col">
							<ItemCard item={item} />
						</div>
					))}
				</div>
			)}
		</section>
	);
}
