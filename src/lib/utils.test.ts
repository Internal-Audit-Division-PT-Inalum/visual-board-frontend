import { describe, expect, it } from "vitest";
import { getBackendUrl } from "./utils";

describe("Visual Board Utilities (utils.ts)", () => {
	describe("getBackendUrl", () => {
		it("returns empty string for null, undefined, or empty values", () => {
			expect(getBackendUrl(null)).toBe("");
			expect(getBackendUrl(undefined)).toBe("");
			expect(getBackendUrl("")).toBe("");
			expect(getBackendUrl("   ")).toBe("");
		});

		it("formats relative storage paths with leading slash for Vite proxy", () => {
			expect(getBackendUrl("storage/documents/audit-plan.pdf")).toBe(
				"/storage/documents/audit-plan.pdf",
			);
			expect(getBackendUrl("/storage/avatars/user.jpg")).toBe(
				"/storage/avatars/user.jpg",
			);
		});

		it("sanitizes absolute backend localhost URLs to relative proxy paths", () => {
			expect(
				getBackendUrl("http://localhost:8000/storage/documents/report.pdf"),
			).toBe("/storage/documents/report.pdf");
			expect(
				getBackendUrl("http://192.168.1.100:8000/storage/media/chart.png"),
			).toBe("/storage/media/chart.png");
		});

		it("preserves external third-party CDN and public URLs", () => {
			expect(getBackendUrl("https://images.unsplash.com/photo-123")).toBe(
				"https://images.unsplash.com/photo-123",
			);
			expect(getBackendUrl("https://cdn.inalum.id/logo.png")).toBe(
				"https://cdn.inalum.id/logo.png",
			);
		});
	});
});
