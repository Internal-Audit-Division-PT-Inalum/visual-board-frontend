import {
	AlertTriangle,
	Archive,
	Boxes,
	CheckCircle2,
	Clock,
	Layers,
	MapPin,
	RefreshCw,
	WifiOff,
} from "lucide-react";
import type { KioskLocationWithItems } from "@/types/api";
import { LocationSection } from "./LocationSection";

interface InventoryBoardProps {
	locations?: KioskLocationWithItems[];
	isLoading?: boolean;
	isError?: boolean;
	dataUpdatedAt?: number;
	refetch?: () => void;
}

export function InventoryBoard({
	locations = [],
	isLoading = false,
	isError = false,
	dataUpdatedAt,
	refetch,
}: InventoryBoardProps) {
	// Format timestamp terakhir diperbarui
	const formattedLastUpdated = dataUpdatedAt
		? new Date(dataUpdatedAt).toLocaleTimeString("id-ID", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			})
		: null;

	// Hitung metrik agregasi seluruh lokasi
	const totalLocations = locations.length;
	const allItems = locations.flatMap((loc) => loc.items);
	const totalItems = allItems.length;
	const safeCount = allItems.filter((i) => i.stock_status === "ok").length;
	const lowOrEmptyCount = allItems.filter(
		(i) => i.stock_status === "low" || i.stock_status === "empty",
	).length;
	const totalBorrowedAssets = allItems.reduce(
		(sum, item) => sum + (item.borrowed_quantity ?? 0),
		0,
	);

	// State 1: Loading Skeleton saat pemuatan pertama kali
	if (isLoading && locations.length === 0) {
		return (
			<div className="w-full flex flex-col gap-8 animate-in fade-in duration-300">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					{["kpi-1", "kpi-2", "kpi-3", "kpi-4", "kpi-5"].map((kpiKey) => (
						<div
							key={kpiKey}
							className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm animate-pulse flex flex-col gap-2"
						>
							<div className="h-3 w-1/2 bg-slate-200 rounded"></div>
							<div className="h-8 w-2/3 bg-slate-300 rounded"></div>
						</div>
					))}
				</div>

				<div className="flex flex-col gap-6">
					{["loc-1", "loc-2"].map((locKey) => (
						<div key={locKey} className="flex flex-col gap-4">
							<div className="h-14 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
								{["card-1", "card-2", "card-3", "card-4"].map((cardKey) => (
									<div
										key={cardKey}
										className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse"
									></div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// State 2: Error total tanpa data tersimpan
	if (isError && locations.length === 0) {
		return (
			<div className="w-full flex items-center justify-center min-h-[50vh]">
				<div className="bg-red-50 p-8 sm:p-12 rounded-3xl border border-red-200 flex flex-col items-center max-w-lg text-center shadow-sm">
					<WifiOff className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
					<h3 className="text-2xl font-black text-rose-700 mb-2">
						Koneksi Inventaris Terputus
					</h3>
					<p className="text-rose-600 text-sm mb-6 leading-relaxed">
						Gagal menghubungkan ke server inventaris pusat. Sistem Kiosk akan
						mencoba menghubungkan kembali secara otomatis.
					</p>
					{refetch && (
						<button
							type="button"
							onClick={() => refetch()}
							className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
						>
							<RefreshCw className="w-4 h-4" /> Coba Sinkronisasi Ulang
						</button>
					)}
				</div>
			</div>
		);
	}

	// State 3: Data Kosong
	if (locations.length === 0) {
		return (
			<div className="w-full flex items-center justify-center min-h-[50vh]">
				<div className="bg-slate-50 p-12 rounded-3xl border border-slate-200 flex flex-col items-center max-w-md text-center shadow-inner">
					<Boxes className="w-16 h-16 text-slate-300 mb-4" />
					<h3 className="text-2xl font-black text-slate-700 mb-2">
						Belum Ada Lokasi Inventaris
					</h3>
					<p className="text-slate-500 text-sm leading-relaxed">
						Data lokasi atau barang inventaris belum dikonfigurasikan di sistem
						backend.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 pb-12 font-sans animate-in fade-in duration-500">
			{isError && locations.length > 0 && (
				<div className="bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 px-5 py-3 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
					<div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
						<WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
						<span>
							Koneksi server sempat terganggu. Menampilkan data inventaris
							terakhir yang tersimpan.
						</span>
					</div>
					{formattedLastUpdated && (
						<span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full shrink-0">
							Terakhir Sinkron: {formattedLastUpdated} WIB
						</span>
					)}
				</div>
			)}

			<div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
				<div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
							Total Lokasi
						</span>
						<MapPin className="w-4 h-4 text-blue-500" />
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl sm:text-4xl font-black text-slate-800 font-mono">
							{totalLocations}
						</span>
						<span className="text-xs font-semibold text-slate-400">
							Titik Rak
						</span>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
							Total Katalog
						</span>
						<Boxes className="w-4 h-4 text-indigo-500" />
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl sm:text-4xl font-black text-[#0A2F66] font-mono">
							{totalItems}
						</span>
						<span className="text-xs font-semibold text-slate-400">
							Item Aktif
						</span>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
							Stok Aman
						</span>
						<CheckCircle2 className="w-4 h-4 text-emerald-500" />
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">
							{safeCount}
						</span>
						<span className="text-xs font-semibold text-slate-400">Item</span>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
							Perlu Restock
						</span>
						<AlertTriangle className="w-4 h-4 text-amber-500" />
					</div>
					<div className="flex items-baseline gap-2">
						<span
							className={`text-3xl sm:text-4xl font-black font-mono ${lowOrEmptyCount > 0 ? "text-amber-600" : "text-slate-400"}`}
						>
							{lowOrEmptyCount}
						</span>
						<span className="text-xs font-semibold text-slate-400">
							Item Rendah/Habis
						</span>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all col-span-2 md:col-span-1">
					<div className="flex items-center justify-between text-slate-400 mb-2">
						<span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
							Aset Dipinjam
						</span>
						<Archive className="w-4 h-4 text-blue-600" />
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl sm:text-4xl font-black text-blue-700 font-mono">
							{totalBorrowedAssets}
						</span>
						<span className="text-xs font-semibold text-slate-400">
							Unit di Lapangan
						</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-slate-200 pb-3">
				<div className="flex items-center gap-2">
					<Layers className="w-5 h-5 text-[#0A2F66]" />
					<h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
						Daftar Inventaris Berdasarkan Lokasi Rak
					</h2>
				</div>

				{formattedLastUpdated && (
					<div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						<Clock className="w-3.5 h-3.5 text-slate-400" />
						<span>Terakhir Diperbarui: {formattedLastUpdated} WIB</span>
						<span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
							Auto-Sync 60s
						</span>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-10">
				{locations.map((location) => (
					<LocationSection key={location.id} location={location} />
				))}
			</div>
		</div>
	);
}
