import axios, { AxiosError, AxiosHeaders } from "axios";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("API Client & Error Interceptor (api.ts)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("configures standard JSON headers and 10s timeout", () => {
		expect(api.defaults.timeout).toBe(10_000);
		expect(api.defaults.headers.Accept).toBe("application/json");
		expect(api.defaults.headers["Content-Type"]).toBe("application/json");
	});

	it("displays persistent network error toast on 503 or missing response", async () => {
		const handlers = (
			api.interceptors.response as unknown as {
				handlers: Array<{ rejected: (error: unknown) => Promise<never> }>;
			}
		).handlers;

		const networkError = new AxiosError(
			"Network Error",
			"ERR_NETWORK",
			undefined,
			undefined,
			undefined,
		);

		await expect(handlers[0].rejected(networkError)).rejects.toBe(networkError);
		expect(toast.error).toHaveBeenCalledWith(
			"Koneksi ke server terputus. Data akan diperbarui otomatis saat koneksi pulih.",
			expect.objectContaining({ id: "network-error" }),
		);
	});

	it("displays server error toast for HTTP >= 500 responses", async () => {
		const handlers = (
			api.interceptors.response as unknown as {
				handlers: Array<{ rejected: (error: unknown) => Promise<never> }>;
			}
		).handlers;

		const serverError = new AxiosError(
			"Internal Server Error",
			"ERR_BAD_RESPONSE",
			undefined,
			undefined,
			{
				status: 500,
				statusText: "Internal Server Error",
				headers: {},
				config: { headers: new AxiosHeaders() },
				data: {},
			},
		);

		await expect(handlers[0].rejected(serverError)).rejects.toBe(serverError);
		expect(toast.error).toHaveBeenCalledWith(
			"Terjadi kesalahan pada server (500). Silakan hubungi administrator.",
			expect.objectContaining({ id: "server-error" }),
		);
	});

	it("does not display error toast for cancelled requests", async () => {
		const handlers = (
			api.interceptors.response as unknown as {
				handlers: Array<{ rejected: (error: unknown) => Promise<never> }>;
			}
		).handlers;

		const cancelError = new axios.Cancel("Request aborted");
		await expect(handlers[0].rejected(cancelError)).rejects.toBe(cancelError);
		expect(toast.error).not.toHaveBeenCalled();
	});
});
