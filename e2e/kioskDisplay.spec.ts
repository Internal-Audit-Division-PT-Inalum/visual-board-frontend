import { expect, test } from "@playwright/test";
import {
	attachRuntimeErrorTracker,
	setupVisualBoardMocks,
} from "./helpers/setupMocks";

test.describe("E2E Kiosk Auto-Play & Resilience", () => {
	test("menjalankan mode ?kiosk=true, merotasi tab otomatis, dan bebas error runtime", async ({
		page,
	}) => {
		const runtimeErrors = await attachRuntimeErrorTracker(page);
		await setupVisualBoardMocks(page);
		await page.clock.install();

		await page.goto("/?kiosk=true&tab=general");

		await expect(
			page.getByRole("heading", { name: "IIA 5R ACTIVITY BOARD" }),
		).toBeVisible();
		await expect(page.getByText("Auto-Play: ON")).toBeVisible();
		await expect(page.getByText("Ahmad Evaluator").first()).toBeVisible();
		await expect(page.getByText("10/12 Hadir")).toBeVisible();

		// Simulasi interaksi pengguna membuat Auto-Play jeda sementara (PAUSED IDLE)
		await page.mouse.move(120, 120);
		await expect(page.getByText("Auto-Play: PAUSED (IDLE)")).toBeVisible();

		// Setelah 15 detik tanpa aktivitas, Auto-Play kembali ON
		await page.clock.runFor(15_500);
		await expect(page.getByText("Auto-Play: ON")).toBeVisible();

		// Majukan waktu agar useKioskAutoPlay merotasi ke scene berikutnya (schedule_5r)
		for (let step = 0; step < 30; step++) {
			if (page.url().includes("tab=schedule_5r")) {
				break;
			}
			await page.clock.runFor(2_000);
		}

		await expect(page).toHaveURL(/kiosk=true/);
		await expect(page).toHaveURL(/tab=schedule_5r/);
		await expect(page.getByText("Zona Lobby Audit").first()).toBeVisible();

		expect(runtimeErrors.pageErrors).toEqual([]);
		expect(await runtimeErrors.getUnhandledRejections()).toEqual([]);
	});
});
