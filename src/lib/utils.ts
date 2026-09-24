export { cn } from "cn";

export function getBackendUrl(path: string | null | undefined): string {
	if (!path) return "";
	if (path.startsWith("http")) {
		// Handle the case where backend returns localhost but frontend is accessed via IP
		if (path.includes("localhost") || path.includes("127.0.0.1")) {
			const apiBase =
				import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
			const backendUrl = apiBase.replace("/api/v1", "");
			const url = new URL(path);
			return `${backendUrl}${url.pathname}${url.search}`;
		}
		return path;
	}

	const apiBase =
		import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
	const backendUrl = apiBase.replace("/api/v1", "");
	return `${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}
