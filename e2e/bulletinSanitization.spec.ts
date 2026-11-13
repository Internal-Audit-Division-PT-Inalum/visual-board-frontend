import { expect, test } from "@playwright/test";
import { XSS_BULLETIN_FIXTURE } from "./fixtures/mockData";
import {
	attachRuntimeErrorTracker,
	setupVisualBoardMocks,
} from "./helpers/setupMocks";

test.describe("E2E Bulletin XSS Defense", () => {
	test("mensanitasi payload <script>, onerror, dan javascript: href di modal mading tanpa mengeksekusi XSS", async ({
		page,
	}) => {
		const runtimeErrors = await attachRuntimeErrorTracker(page);
		await setupVisualBoardMocks(page, {
			bulletins: [XSS_BULLETIN_FIXTURE],
		});

		await page.goto("/?tab=department_hub");

		await expect(
			page.getByText("Pengumuman Keselamatan & Kebijakan 5R"),
		).toBeVisible();

		await page.getByRole("button", { name: /Baca Selengkapnya/i }).click();

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();
		await expect(
			dialog.getByText("Pengumuman resmi standar 5R triwulan berjalan."),
		).toBeVisible();

		// Pastikan seluruh vektor XSS terbuang atau ternetralisir di DOM nyata
		await expect(dialog.locator("script")).toHaveCount(0);
		await expect(dialog.locator("img[onerror]")).toHaveCount(0);
		await expect(dialog.locator('a[href^="javascript:"]')).toHaveCount(0);

		const safeLink = dialog.locator(
			'a[href="https://portal.inalum.id/panduan"]',
		);
		await expect(safeLink).toBeVisible();
		await expect(safeLink).toHaveAttribute("target", "_blank");
		await expect(safeLink).toHaveAttribute("rel", "noopener noreferrer");

		const xssExecuted = await page.evaluate(() => {
			return (window as Window & { __xssExecuted?: unknown }).__xssExecuted;
		});
		expect(xssExecuted).toBeUndefined();

		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();

		expect(runtimeErrors.pageErrors).toEqual([]);
		expect(await runtimeErrors.getUnhandledRejections()).toEqual([]);
	});
});
