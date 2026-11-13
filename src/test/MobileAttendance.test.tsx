import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosError, AxiosHeaders } from "axios";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import MobileAttendance from "@/pages/MobileAttendance";

vi.mock("@/lib/api", () => ({
	api: {
		post: vi.fn(),
	},
}));

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("MobileAttendance Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows validation error when submitting empty employee code", async () => {
		render(<MobileAttendance />);

		fireEvent.click(
			screen.getByRole("button", { name: "Konfirmasi Kehadiran" }),
		);

		expect(toast.error).toHaveBeenCalledWith(
			"Silakan masukkan Kode Pegawai / NIK Anda",
		);
		expect(api.post).not.toHaveBeenCalled();
	});

	it("submits selected attendance status and transitions to confirmation state", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

		render(<MobileAttendance />);

		const input = screen.getByLabelText("Kode Pegawai (Namecode)");
		fireEvent.change(input, { target: { value: "K-1024" } });
		fireEvent.click(screen.getByRole("button", { name: "Dinas" }));
		fireEvent.click(
			screen.getByRole("button", { name: "Konfirmasi Kehadiran" }),
		);

		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith("/hr/kiosk/attendances/scan", {
				namecode: "K-1024",
				status: "business_trip",
			});
		});

		expect(await screen.findByText("Terima Kasih!")).toBeTruthy();
		expect(toast.success).toHaveBeenCalledWith(
			"Presensi berhasil dicatat!",
			expect.any(Object),
		);
	});

	it("displays backend error message when attendance API rejects", async () => {
		const error = new AxiosError(
			"Unprocessable Entity",
			"ERR_BAD_REQUEST",
			undefined,
			undefined,
			{
				status: 422,
				statusText: "Unprocessable Entity",
				headers: {},
				config: { headers: new AxiosHeaders() },
				data: { message: "Kode pegawai tidak ditemukan." },
			},
		);
		vi.mocked(api.post).mockRejectedValueOnce(error);

		render(<MobileAttendance />);

		fireEvent.change(screen.getByLabelText("Kode Pegawai (Namecode)"), {
			target: { value: "INVALID" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: "Konfirmasi Kehadiran" }),
		);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Presensi Gagal", {
				description: "Kode pegawai tidak ditemukan.",
			});
		});
	});
});
