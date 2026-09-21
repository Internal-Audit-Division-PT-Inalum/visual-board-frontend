import { Activity, ExternalLink, Link as LinkIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useQuickLinks } from "../api/useQuickLinks";

export function QrCodeGrid() {
	const { data: links, isLoading, isError } = useQuickLinks();

	if (isLoading) {
		return (
			<div className="h-64 flex items-center justify-center text-slate-400 gap-3">
				<Activity className="w-5 h-5 animate-spin" />
				Memuat data akses cepat...
			</div>
		);
	}

	if (isError || !links) {
		return (
			<div className="h-64 flex items-center justify-center text-slate-400">
				Gagal memuat data akses cepat.
			</div>
		);
	}

	if (links.length === 0) {
		return (
			<div className="h-64 flex items-center justify-center text-slate-400">
				Belum ada tautan akses cepat yang tersedia.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
			{links.map((link) => (
				<div
					key={link.id}
					className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center gap-4 hover:shadow-md transition-shadow"
				>
					<div className="w-full flex justify-between items-start text-slate-500 mb-2">
						<LinkIcon className="w-5 h-5" />
						<ExternalLink className="w-4 h-4 opacity-50" />
					</div>

					<div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
						<QRCodeSVG
							value={link.url}
							size={140}
							level="H"
							includeMargin={true}
							fgColor="#0A2F66"
						/>
					</div>

					<div className="text-center mt-2 w-full">
						<h3 className="font-bold text-[#0A2F66] text-sm line-clamp-1">
							{link.title}
						</h3>
						{link.description && (
							<p className="text-xs text-slate-500 mt-1 line-clamp-2">
								{link.description}
							</p>
						)}
					</div>

					<div className="mt-auto pt-4 w-full">
						<div className="bg-slate-50 text-slate-400 text-[10px] font-mono p-2 rounded truncate text-center border border-slate-100">
							{link.url}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
