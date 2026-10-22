export { cn } from "cn";

export function getBackendUrl(path: string | null | undefined): string {
	if (!path || typeof path !== "string" || path.trim() === "") return "";

	let apiBase =
		import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

	if (typeof window !== "undefined" && window.location?.hostname) {
		const currentHost = window.location.hostname;
		if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
			apiBase = apiBase
				.replace("://localhost", `://${currentHost}`)
				.replace("://127.0.0.1", `://${currentHost}`);
		}
	}

	const backendUrl = apiBase.replace(/\/api\/v1\/?$/, "");

	if (path.startsWith("http://") || path.startsWith("https://")) {
		try {
			const url = new URL(path);
			if (
				url.hostname === "localhost" ||
				url.hostname === "127.0.0.1" ||
				(typeof window !== "undefined" &&
					window.location?.hostname &&
					url.hostname !== window.location.hostname &&
					(backendUrl.includes(window.location.hostname) ||
						apiBase.includes(window.location.hostname)))
			) {
				return `${backendUrl}${url.pathname}${url.search}`;
			}
			return path;
		} catch {
			return path;
		}
	}

	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${backendUrl}${cleanPath}`;
}
