import { Image as ImageIcon, Maximize2, X } from "lucide-react";
import { useState } from "react";
import type { ZoneDetail } from "@/types/api";

interface ZoneStandardImageProps {
	zone: ZoneDetail;
}

export function ZoneStandardImage({ zone }: ZoneStandardImageProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const imageUrl = zone.standard_image_url
		? `http://localhost:8000${zone.standard_image_url}`
		: null;

	return (
		<div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
			<div className="bg-[#E2E8F0] px-4 py-3 border-b border-slate-300">
				<h4 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase text-center">
					Standard Image
				</h4>
			</div>

			<div className="flex-1 relative group bg-slate-50 min-h-[200px] flex items-center justify-center p-2">
				{imageUrl ? (
					<>
						<img
							src={imageUrl}
							alt={`Standar Zona ${zone.name}`}
							className="max-w-full max-h-[300px] object-contain rounded-md"
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-b-xl">
							<button
								onClick={() => setIsModalOpen(true)}
								className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white/30 text-xs"
							>
								<Maximize2 className="w-4 h-4" /> Perbesar
							</button>
						</div>
					</>
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
					<img
						src={imageUrl}
						alt={`Standar Zona ${zone.name}`}
						className="w-full h-full object-contain rounded-lg"
					/>
				</div>
			)}
		</div>
	);
}
