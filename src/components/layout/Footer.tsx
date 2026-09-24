import { Globe, Mail, MapPin } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-[#0f172a] text-slate-300 w-full shrink-0 border-t-4 border-blue-600 z-10 relative">
			<div className="w-full px-6 lg:px-12 py-4 lg:py-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
					{/* Brand & Description */}
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl w-fit border border-white/10">
							<div className="font-black text-xl tracking-tighter text-white flex items-center gap-3">
								<img
									src="/inalum-logo-2.png"
									alt="PT Inalum"
									className="h-10 sm:h-12 w-auto object-contain brightness-0 invert drop-shadow-sm"
								/>
								<div className="w-px h-5 bg-slate-700"></div>
								<span className="text-slate-300 font-bold text-base">
									DIVISI IIA
								</span>
							</div>
						</div>

						<p className="text-slate-400 leading-relaxed text-sm max-w-md">
							Mewujudkan tata kelola operasional yang bersih, transparan,
							inovatif, dan berbudaya untuk kesejahteraan bersama di lingkungan
							Divisi IIA PT Indonesia Asahan Aluminium (Persero).
						</p>
					</div>

					{/* Contact Info */}
					<div className="flex flex-col gap-4 md:items-end md:text-right">
						<h3 className="text-white font-bold tracking-widest uppercase text-xs mb-1 border-b border-slate-700 pb-2 inline-block w-fit">
							Hubungi Kami
						</h3>
						<ul className="flex flex-col gap-3 text-sm md:items-end">
							<li className="flex items-start gap-3 md:flex-row-reverse">
								<MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
								<span className="text-slate-400 leading-relaxed max-w-xs">
									<strong className="block text-slate-300 font-semibold mb-1">
										Kantor Divisi IIA
									</strong>
									Gedung STO Tanjung Gading, Kec. Seisuka, Kabupaten Batu Bara,
									Sumatera Utara
								</span>
							</li>
							<li className="flex items-center gap-3 md:flex-row-reverse">
								<Mail className="w-4 h-4 text-blue-500 shrink-0" />
								<a
									href="mailto:sia@inalum.id"
									className="text-slate-400 hover:text-blue-400 transition-colors"
								>
									sia@inalum.id
								</a>
							</li>
							<li className="flex items-center gap-3 md:flex-row-reverse">
								<Globe className="w-4 h-4 text-blue-500 shrink-0" />
								<a
									href="https://inalum.id"
									target="_blank"
									rel="noreferrer"
									className="text-slate-400 hover:text-blue-400 transition-colors"
								>
									www.inalum.id
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Copyright Bar */}
			<div className="bg-[#0b1121] py-2.5 px-6 text-center text-xs text-slate-500 font-medium">
				<p>
					© {new Date().getFullYear()} PT Indonesia Asahan Aluminium (Persero) -
					Divisi IIA. Seluruh Hak Cipta Dilindungi.
				</p>
			</div>
		</footer>
	);
}
