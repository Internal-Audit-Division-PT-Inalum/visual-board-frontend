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
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					key={link.id}
					className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center gap-4 hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1"
				>
					<div className="w-full flex justify-between items-start text-slate-500 mb-2 group-hover:text-blue-600 transition-colors">
						<LinkIcon className="w-5 h-5" />
						<ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
					</div>

					<div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner group-hover:shadow-md transition-shadow">
						<QRCodeSVG
							value={link.url}
							size={140}
							level="H"
							includeMargin={true}
							fgColor="#0A2F66"
						/>
					</div>

					<div className="text-center mt-2 w-full">
						<h3 className="font-bold text-[#0A2F66] text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
							{link.title}
						</h3>
						{link.description && (
							<p className="text-xs text-slate-500 mt-1 line-clamp-2">
								{link.description}
							</p>
						)}
					</div>

					<div className="mt-auto pt-4 w-full">
						<div className="bg-slate-50 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors text-[10px] font-mono p-2 rounded truncate text-center border border-slate-100 group-hover:border-blue-100">
							{link.url}
						</div>
					</div>
				</a>
			))}
		</div>
	);
}
