import { Image as ImageIcon, Maximize2, X } from "lucide-react";
import { useState } from "react";
import { getBackendUrl } from "@/lib/utils";
import type { ZoneDetail } from "@/types/api";

interface ZoneStandardImageProps {
	zone: ZoneDetail;
}

export function ZoneStandardImage({ zone }: ZoneStandardImageProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const imageUrl = zone.standard_image_url
		? getBackendUrl(zone.standard_image_url)
		: null;
	const isPdf = imageUrl?.toLowerCase().includes(".pdf");

	return (
		<div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
			<div className="bg-[#E2E8F0] px-4 py-3 border-b border-slate-300">
				<h4 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase text-center">
					Standard Image
				</h4>
			</div>

			<div className="relative group bg-[#F8FAFC] flex items-center justify-center p-4">
				{imageUrl ? (
					isPdf ? (
						<div className="w-full h-full relative group/pdf">
							<iframe
								src={`${imageUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
								className="w-full h-full border-0 pointer-events-none rounded-md"
								title={`Standar Zona ${zone.name}`}
							/>
							<div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/pdf:opacity-100 transition-all duration-200 flex items-center justify-center rounded-md">
								<button
									onClick={() => setIsModalOpen(true)}
									className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all text-xs shadow-lg"
								>
									<Maximize2 className="w-4 h-4" /> Buka PDF
								</button>
							</div>
						</div>
					) : (
						<>
							<img
								src={imageUrl}
								alt={`Standar Zona ${zone.name}`}
								className="w-full max-h-[500px] object-contain rounded-lg border border-slate-200 shadow-sm"
							/>
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-b-xl backdrop-blur-[2px]">
								<button
									onClick={() => setIsModalOpen(true)}
									className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white/30 hover:scale-105 transition-all text-sm shadow-xl"
								>
									<Maximize2 className="w-4 h-4" /> Perbesar Gambar
								</button>
							</div>
						</>
					)
				) : (
					<div className="flex flex-col items-center justify-center text-slate-400">
						<ImageIcon className="w-10 h-10 mb-2 opacity-40" />
						<p className="text-xs font-medium">Gambar standar belum diatur</p>
					</div>
				)}
			</div>

			{isModalOpen && imageUrl && (
				<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8">
					<button
						onClick={() => setIsModalOpen(false)}
						className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
					>
						<X className="w-7 h-7" />
					</button>
					{isPdf ? (
						<iframe
							src={`${imageUrl}#view=FitH`}
							className="w-full h-full border-0 rounded-lg bg-white"
							title={`Standar Zona ${zone.name}`}
						/>
					) : (
						<img
							src={imageUrl}
							alt={`Standar Zona ${zone.name}`}
							className="w-full h-full object-contain rounded-lg"
						/>
					)}
				</div>
			)}
		</div>
	);
}
