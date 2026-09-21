import { Link as LinkIcon, Megaphone } from "lucide-react";
import { useState } from "react";
import { BulletinBoard } from "@/features/bulletin/components/BulletinBoard";
import { QrCodeGrid } from "@/features/bulletin/components/QrCodeGrid";

type HubTab = "informasi_umum" | "cog_sor";

export default function DepartmentHub() {
	const [activeTab, setActiveTab] = useState<HubTab>("informasi_umum");

	return (
		<div className="bg-white min-h-full">
			<div className="max-w-[1920px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 font-sans relative">
				{}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-slate-200 shrink-0">
					<div>
						<div className="flex items-center gap-2 text-[#0A2F66] font-bold text-xs tracking-widest mb-1 uppercase">
							<span className="w-1.5 h-1.5 rounded-full bg-[#0A2F66]"></span>
							DIVISI IIA • PUSAT INFORMASI
						</div>
						<h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
							Mading Divisi
						</h2>
					</div>

					<div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
						<button
							onClick={() => setActiveTab("informasi_umum")}
							className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
								activeTab === "informasi_umum"
									? "bg-white text-blue-700 shadow-sm"
									: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
							}`}
						>
							<Megaphone className="w-4 h-4" /> Informasi Umum
						</button>
						<button
							onClick={() => setActiveTab("cog_sor")}
							className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
								activeTab === "cog_sor"
									? "bg-white text-indigo-600 shadow-sm"
									: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
							}`}
						>
							<LinkIcon className="w-4 h-4" /> COG & SOR
						</button>
					</div>
				</div>

				{}
				<div className="">
					{activeTab === "informasi_umum" && (
						<div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
							<BulletinBoard />
						</div>
					)}
					{activeTab === "cog_sor" && (
						<div className="pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
							<QrCodeGrid />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
