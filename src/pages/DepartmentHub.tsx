import { Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { BulletinBoard } from "@/features/bulletin/components/BulletinBoard";
import { QrCodeGrid } from "@/features/bulletin/components/QrCodeGrid";

type HubTab = "" | "general" | "health_safety" | "event" | "policy" | "cog_sor";

export default function DepartmentHub() {
	const [activeTab, setActiveTab] = useState<HubTab>("");

	const categories = [
		{ id: "", label: "Semua Kategori" },
		{ id: "general", label: "Umum" },
		{ id: "health_safety", label: "K3 & Safety" },
		{ id: "event", label: "Acara" },
		{ id: "policy", label: "Kebijakan" },
	] as const;

	return (
		<div className="bg-white flex-1 flex flex-col">
			<div className="w-full p-4 sm:p-6 lg:p-8 space-y-6 font-sans relative">
				{}
				<div className="flex flex-col sm:flex-row justify-end items-start sm:items-end gap-4 pb-2 border-b border-slate-200 shrink-0">
					<div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveTab(cat.id)}
								className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
									activeTab === cat.id
										? "bg-white text-blue-700 shadow-sm"
										: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
								}`}
							>
								{cat.label}
							</button>
						))}
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
					{activeTab !== "cog_sor" && (
						<div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
							<BulletinBoard selectedCategory={activeTab} />
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
