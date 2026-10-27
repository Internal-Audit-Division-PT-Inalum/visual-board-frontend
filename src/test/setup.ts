import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatic DOM cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock ResizeObserver for Recharts & dynamic containers in JSDOM
class MockResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock window.matchMedia for responsive UI logic in JSDOM
Object.defineProperty(window, "matchMedia", {
	writable: true,
	configurable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
});
