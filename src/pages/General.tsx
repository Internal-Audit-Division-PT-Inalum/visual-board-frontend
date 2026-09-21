import { Maximize2, RefreshCw, ScanLine, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useKioskData } from "@/features/general/api/useKioskData";
import { AbnormalityFeed } from "@/features/general/components/AbnormalityFeed";
import { GeneralDocumentViewer } from "@/features/general/components/GeneralDocumentViewer";
import { KaizenLeaderboard } from "@/features/general/components/KaizenLeaderboard";
import { KpiRow } from "@/features/general/components/KpiRow";
import { TrendMatrix } from "@/features/general/components/TrendMatrix";

export default function General() {
	const { data, isLoading, isError, refetch } = useKioskData();
	const [isQrModalOpen, setIsQrModalOpen] = useState(false);

	// Mendapatkan URL saat ini (contoh: http://192.168.1.10:5173) untuk QR Code
	const getQrUrl = () => {
		return `${window.location.protocol}//${window.location.host}/presensi`;
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1920px] mx-auto font-sans relative">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
				<div>
					<div className="flex items-center gap-2 text-[#0A2F66] font-bold text-xs tracking-widest mb-1 uppercase">
						<span className="w-1.5 h-1.5 rounded-full bg-[#0A2F66]"></span>
						VISUAL BOARD DIVISI IIA
					</div>
					<h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
						Ringkasan Kinerja Eksekutif
					</h2>
				</div>
				<div className="flex items-center gap-4">
					{/* QR Code Widget */}
					<button
						onClick={() => setIsQrModalOpen(true)}
						className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all group text-left cursor-pointer"
					>
						<div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 transition-colors relative">
							<QRCodeSVG value={getQrUrl()} size={64} className="rounded" />
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
								<Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
							</div>
						</div>
						<div className="pr-2">
							<p className="text-xs font-black text-[#0A2F66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
								<ScanLine className="w-4 h-4 text-blue-500" /> Presensi
							</p>
							<p className="text-xs text-slate-500 font-medium leading-tight">
								Scan QR ini
								<br />
								untuk Hadir
							</p>
						</div>
					</button>

					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold tracking-wide">
							<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
							Rotasi: AKTIF
						</div>
						<button
							onClick={() => refetch()}
							className="flex items-center justify-center gap-1.5 bg-[#E6F0FD] text-[#0A2F66] px-3 py-1.5 rounded-full border border-[#B3D4FF] hover:bg-[#CCE0FF] transition-colors text-[10px] font-bold tracking-wide"
						>
							<RefreshCw className="w-3 h-3" />
							Sinkronisasi
						</button>
					</div>
				</div>
			</div>

			{/* QR Code Modal (Fullscreen Popup) */}
			{isQrModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-12 max-w-lg w-full flex flex-col items-center relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
						<button
							onClick={() => setIsQrModalOpen(false)}
							className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors"
						>
							<X className="w-5 h-5 sm:w-6 sm:h-6" />
						</button>

						<div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shrink-0">
							<ScanLine className="w-8 h-8 sm:w-10 sm:h-10" />
						</div>

						<h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 text-center">
							Presensi Digital
						</h3>
						<p className="text-sm sm:text-base text-slate-500 text-center font-medium mb-6 sm:mb-8">
							Buka kamera HP Anda dan scan QR Code di bawah ini untuk mencatat
							kehadiran hari ini.
						</p>

						<div className="w-full max-w-[200px] sm:max-w-[300px] aspect-square p-3 sm:p-4 bg-white border-4 border-slate-100 rounded-3xl shadow-inner flex items-center justify-center">
							<QRCodeSVG
								value={getQrUrl()}
								style={{ width: "100%", height: "100%" }}
								className="rounded-xl"
							/>
						</div>
					</div>
				</div>
			)}

			<KpiRow data={data} isLoading={isLoading} />

			<GeneralDocumentViewer />

			<TrendMatrix />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
				<div className="lg:col-span-2 min-h-[500px] flex flex-col">
					<AbnormalityFeed
						items={data?.abnormalities}
						isLoading={isLoading}
						isError={isError}
						onRetry={refetch}
					/>
				</div>

				<div className="min-h-[400px] flex flex-col">
					<KaizenLeaderboard
						champions={data?.kaizen_champions}
						isLoading={isLoading}
						isError={isError}
					/>
				</div>
			</div>
		</div>
	);
}
