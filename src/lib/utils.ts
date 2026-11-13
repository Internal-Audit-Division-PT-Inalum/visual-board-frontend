import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sanitizeUrl } from "./security";

export {
	sanitizeRichHtml,
	sanitizeRichHtmlToFragment,
	sanitizeUrl,
} from "./security";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Resolves a backend asset URL (documents, images, avatars) into a clean,
 * environment-aware URL.
 *
 * Supports:
 * - Dynamic Vite reverse proxy in development (relative paths '/storage/...')
 * - Absolute production backend URLs
 * - Sanitizing stale backend localhost/IP prefixes from database fields
 * - External CDN / third-party URLs
 */
export function getBackendUrl(path: string | null | undefined): string {
	const safePath = sanitizeUrl(path);
	if (!safePath) return "";

	const trimmed = safePath;

	// Resolve configured base from env (default to relative '/api/v1')
	const apiBase = (import.meta.env.VITE_API_BASE_URL || "/api/v1").trim();
	const isAbsoluteBase =
		apiBase.startsWith("http://") || apiBase.startsWith("https://");
	const backendOrigin = isAbsoluteBase
		? apiBase.replace(/\/api\/v1\/?$/, "")
		: "";

	// Handle absolute URLs (http:// or https://)
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		try {
			const parsed = new URL(trimmed);
			const isStorageOrApi =
				parsed.pathname.startsWith("/storage") ||
				parsed.pathname.startsWith("/api");

			// If it's a backend asset (e.g. from local server or database with host embedded)
			if (isStorageOrApi) {
				return backendOrigin
					? `${backendOrigin}${parsed.pathname}${parsed.search}`
					: `${parsed.pathname}${parsed.search}`;
			}

			// External URL (e.g. CDN, inalum.id, Unsplash)
			return trimmed;
		} catch {
			return trimmed;
		}
	}

	// Handle relative paths (e.g. "storage/docs/a.pdf" or "/storage/docs/a.pdf")
	const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return backendOrigin ? `${backendOrigin}${cleanPath}` : cleanPath;
}
