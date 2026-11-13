import { describe, expect, it } from "vitest";
import {
	sanitizeRichHtml,
	sanitizeRichHtmlToFragment,
	sanitizeUrl,
} from "@/lib/security";

describe("Security Sanitization Utilities (security.ts)", () => {
	describe("sanitizeUrl", () => {
		it("allows safe protocols and relative application paths", () => {
			expect(sanitizeUrl("https://inalum.id/docs/report.pdf")).toBe(
				"https://inalum.id/docs/report.pdf",
			);
			expect(sanitizeUrl("http://localhost:8000/storage/a.png")).toBe(
				"http://localhost:8000/storage/a.png",
			);
			expect(sanitizeUrl("/storage/media/banner.jpg")).toBe(
				"/storage/media/banner.jpg",
			);
			expect(sanitizeUrl("mailto:audit@inalum.id")).toBe(
				"mailto:audit@inalum.id",
			);
		});

		it("blocks javascript, vbscript, data URIs, protocol-relative URLs, and control chars", () => {
			expect(sanitizeUrl("javascript:alert(1)")).toBe("");
			expect(sanitizeUrl("  JaVaScRiPt:alert(document.cookie)")).toBe("");
			expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("");
			expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
			expect(sanitizeUrl("//evil.example.com/phish")).toBe("");
			expect(sanitizeUrl("https://inalum.id/\nSet-Cookie:a=b")).toBe("");
			expect(sanitizeUrl(null)).toBe("");
			expect(sanitizeUrl(undefined)).toBe("");
		});
	});

	describe("sanitizeRichHtml", () => {
		it("strips script, iframe, svg, style, and event handler XSS vectors", () => {
			const malicious = [
				"<p>Pengumuman Resmi</p>",
				"<script>window.hacked = true;</script>",
				'<iframe src="https://evil.example.com"></iframe>',
				'<svg onload="alert(1)"><circle /></svg>',
				'<img src="https://cdn.inalum.id/ok.png" onerror="alert(1)" />',
				'<div onclick="alert(1)" style="background:url(javascript:alert(1))">Konten</div>',
				'<a href="javascript:alert(1)">Klik</a>',
			].join("");

			const sanitized = sanitizeRichHtml(malicious);

			expect(sanitized).toContain("<p>Pengumuman Resmi</p>");
			expect(sanitized).toContain("<div>Konten</div>");
			expect(sanitized).not.toContain("<script");
			expect(sanitized).not.toContain("<iframe");
			expect(sanitized).not.toContain("<svg");
			expect(sanitized).not.toContain("onerror");
			expect(sanitized).not.toContain("onclick");
			expect(sanitized).not.toContain("onload");
			expect(sanitized).not.toContain("style=");
			expect(sanitized).not.toContain("javascript:");
		});

		it("preserves safe formatting tags and enforces rel=noopener noreferrer on external links", () => {
			const validHtml =
				'<h3>Jadwal Audit</h3><ul><li><strong>Unit A</strong></li></ul><a href="https://inalum.id">Portal</a>';
			const sanitized = sanitizeRichHtml(validHtml);

			expect(sanitized).toContain("<h3>Jadwal Audit</h3>");
			expect(sanitized).toContain("<strong>Unit A</strong>");
			expect(sanitized).toContain('href="https://inalum.id"');
			expect(sanitized).toContain('target="_blank"');
			expect(sanitized).toContain('rel="noopener noreferrer"');
		});

		it("builds a clean DocumentFragment without executable script nodes", () => {
			const fragment = sanitizeRichHtmlToFragment(
				"<p>Aman</p><script>alert(1)</script>",
				document,
			);
			const wrapper = document.createElement("div");
			wrapper.appendChild(fragment);

			expect(wrapper.querySelector("script")).toBeNull();
			expect(wrapper.querySelector("p")?.textContent).toBe("Aman");
		});
	});
});
