import { act, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useKioskAutoPlay } from "@/hooks/useKioskAutoPlay";

function createWrapper(initialEntry: string) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return createElement(
			MemoryRouter,
			{ initialEntries: [initialEntry] },
			children,
		);
	};
}

describe("useKioskAutoPlay Hook", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns isKioskMode=false when kiosk query param is absent", () => {
		const { result } = renderHook(() => useKioskAutoPlay(), {
			wrapper: createWrapper("/?tab=general"),
		});

		expect(result.current.isKioskMode).toBe(false);
		expect(result.current.isIdle).toBe(true);
	});

	it("detects kiosk mode and resets idle state on user interaction", () => {
		const { result } = renderHook(() => useKioskAutoPlay(), {
			wrapper: createWrapper("/?kiosk=true&tab=general"),
		});

		expect(result.current.isKioskMode).toBe(true);
		expect(result.current.isIdle).toBe(true);

		act(() => {
			window.dispatchEvent(new Event("mousemove"));
		});

		expect(result.current.isIdle).toBe(false);

		act(() => {
			vi.advanceTimersByTime(15_000);
		});

		expect(result.current.isIdle).toBe(true);
	});
});
