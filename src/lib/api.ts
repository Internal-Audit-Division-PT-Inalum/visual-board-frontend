import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	timeout: 10_000,
});

api.interceptors.request.use(
	(config) => config,
	(error) => Promise.reject(error),
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isCancel(error)) return Promise.reject(error);

		const status = error.response?.status;

		if (status === 503 || !error.response) {
			toast.error(
				"Koneksi ke server terputus. Data akan diperbarui otomatis saat koneksi pulih.",
				{
					id: "network-error",
					duration: Infinity,
				},
			);
		} else if (status >= 500) {
			toast.error(
				`Terjadi kesalahan pada server (${status}). Silakan hubungi administrator.`,
				{
					id: "server-error",
					duration: 8_000,
				},
			);
		}

		return Promise.reject(error);
	},
);
