import { Loader2, Megaphone, WifiOff } from "lucide-react";
import { useBulletins } from "../api/useBulletins";
import { BulletinCard } from "./BulletinCard";

interface BulletinBoardProps {
	selectedCategory: string;
}

export function BulletinBoard({ selectedCategory }: BulletinBoardProps) {
	const {
		data: bulletins,
		isLoading,
		isError,
	} = useBulletins(12, selectedCategory || undefined);

	if (isLoading) {
		return (
			<div className="w-full h-full font-sans animate-in fade-in duration-500 pb-12 flex flex-col mt-4">
				<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
					<Loader2 className="w-12 h-12 animate-spin text-blue-500" />
					<p className="text-slate-500 font-bold animate-pulse text-lg">
						Memuat Pengumuman...
					</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full h-full font-sans animate-in fade-in duration-500 pb-12 flex flex-col mt-4">
				<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
					<div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex flex-col items-center max-w-md text-center">
						<WifiOff className="w-16 h-16 text-red-400 mb-4" />
						<h3 className="text-xl font-extrabold text-red-700 mb-2">
							Koneksi Terputus
						</h3>
						<p className="text-red-600">
							Gagal menarik data mading dari server pusat. Sistem akan mencoba
							kembali secara otomatis.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!bulletins || bulletins.length === 0) {
		return (
			<div className="w-full h-full font-sans animate-in fade-in duration-500 pb-12 flex flex-col mt-4">
				<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
					<div className="bg-slate-50 p-12 rounded-3xl border border-slate-200 flex flex-col items-center max-w-lg text-center shadow-inner">
						<Megaphone className="w-20 h-20 text-slate-300 mb-6" />
						<h3 className="text-2xl font-black text-slate-700 mb-2">
							Mading Kosong
						</h3>
						<p className="text-slate-500 font-medium">
							Belum ada pengumuman aktif saat ini untuk kategori tersebut.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full font-sans animate-in fade-in duration-500 pb-12 flex flex-col mt-4">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8 items-stretch auto-rows-fr">
				{bulletins.map((bulletin) => (
					<div key={bulletin.id} className="h-[450px]">
						<BulletinCard bulletin={bulletin} />
					</div>
				))}
			</div>
		</div>
	);
}
