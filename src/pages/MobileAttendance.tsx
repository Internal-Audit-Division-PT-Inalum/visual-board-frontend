import {
	CheckCircle2,
	Loader2,
	QrCode,
	ScanLine,
	UserCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function MobileAttendance() {
	const [namecode, setNamecode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!namecode.trim()) {
			toast.error("Silakan masukkan Kode Pegawai / NIK Anda");
			return;
		}

		setIsLoading(true);

		try {
			// Menggunakan endpoint kiosk yang baru kita buat
			await api.post("/hr/kiosk/attendances/scan", {
				namecode: namecode.trim(),
			});

			setIsSuccess(true);
			toast.success("Presensi berhasil dicatat!", {
				description: "Data kehadiran Anda sudah masuk ke sistem.",
			});
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message ||
				"Gagal mencatat presensi. Silakan coba lagi.";
			toast.error("Presensi Gagal", {
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
				<div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
					<div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle2 className="w-10 h-10" />
					</div>
					<h2 className="text-2xl font-black text-slate-800 mb-2">
						Terima Kasih!
					</h2>
					<p className="text-slate-500 mb-8 font-medium">
						Kehadiran Anda hari ini telah berhasil dicatat oleh sistem.
					</p>

					<button
						type="button"
						onClick={() => {
							setIsSuccess(false);
							setNamecode("");
						}}
						className="w-full bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
					>
						Kembali
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col font-sans">
			{/* Mobile Header */}
			<div className="bg-[#0A2F66] text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
				<div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
				<div className="relative z-10 flex items-center gap-4">
					<div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
						<ScanLine className="w-6 h-6 text-blue-200" />
					</div>
					<div>
						<h1 className="text-xl font-black tracking-wide">
							Presensi Digital
						</h1>
						<p className="text-blue-200 text-sm font-medium mt-0.5">
							PT Inalum (Persero)
						</p>
					</div>
				</div>
			</div>

			{/* Form Container */}
			<div className="flex-1 p-6 flex flex-col justify-center max-w-md w-full mx-auto">
				<div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-6 sm:p-8">
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<QrCode className="w-8 h-8" />
						</div>
						<h2 className="text-xl font-extrabold text-slate-800">
							Catat Kehadiran
						</h2>
						<p className="text-slate-500 text-sm mt-2 font-medium">
							Masukkan Kode Pegawai atau NIK Anda untuk merekam kehadiran hari
							ini.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label
								htmlFor="namecode"
								className="text-sm font-bold text-slate-700 block"
							>
								Kode Pegawai (Namecode)
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<UserCircle2 className="h-5 w-5 text-slate-400" />
								</div>
								<input
									id="namecode"
									type="text"
									value={namecode}
									onChange={(e) => setNamecode(e.target.value)}
									placeholder="Contoh: K-12345"
									className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 font-bold placeholder:font-medium placeholder:text-slate-400"
									autoComplete="off"
									autoFocus
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-[#0A2F66] text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Memproses...
								</>
							) : (
								"Konfirmasi Kehadiran"
							)}
						</button>
					</form>
				</div>

				<p className="text-center text-slate-400 text-xs font-medium mt-8">
					&copy; {new Date().getFullYear()} Visual Board & Inventory System
				</p>
			</div>
		</div>
	);
}
