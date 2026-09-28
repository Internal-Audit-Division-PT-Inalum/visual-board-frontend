import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { TabSlug } from "@/components/layout/AppHeader";

interface Scene {
	tab: TabSlug;
	subTab?: string;
	durationMs: number;
}

const TV_PLAYLIST: Scene[] = [
	{ tab: "general", durationMs: 20000 },
	{ tab: "schedule_5r", durationMs: 20000 },
	{ tab: "organization", subTab: "structure", durationMs: 15000 },
	{ tab: "organization", subTab: "map_area", durationMs: 15000 },
	{ tab: "organization", subTab: "attendance", durationMs: 15000 },
	{ tab: "department_hub", subTab: "", durationMs: 15000 },
	{ tab: "department_hub", subTab: "general", durationMs: 10000 },
	{ tab: "department_hub", subTab: "health_safety", durationMs: 10000 },
	{ tab: "department_hub", subTab: "event", durationMs: 10000 },
	{ tab: "department_hub", subTab: "policy", durationMs: 10000 },
	{ tab: "department_hub", subTab: "cog_sor", durationMs: 10000 },
	{ tab: "self_assessment", durationMs: 15000 },
];

const IDLE_TIMEOUT_MS = 15000; // 15 seconds wait before resuming auto-play if interacted

export function useKioskAutoPlay() {
	const [searchParams, setSearchParams] = useSearchParams();
	const isKioskMode = searchParams.get("kiosk") === "true";
	const [isIdle, setIsIdle] = useState(true);

	// Idle Detection
	useEffect(() => {
		if (!isKioskMode) return;

		let idleTimer: ReturnType<typeof setTimeout>;

		const resetIdleTimer = () => {
			setIsIdle(false);
			clearTimeout(idleTimer);
			idleTimer = setTimeout(() => {
				setIsIdle(true);
			}, IDLE_TIMEOUT_MS);
		};

		// Initial start
		idleTimer = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT_MS);

		window.addEventListener("mousemove", resetIdleTimer);
		window.addEventListener("mousedown", resetIdleTimer);
		window.addEventListener("touchstart", resetIdleTimer);
		window.addEventListener("keydown", resetIdleTimer);

		return () => {
			clearTimeout(idleTimer);
			window.removeEventListener("mousemove", resetIdleTimer);
			window.removeEventListener("mousedown", resetIdleTimer);
			window.removeEventListener("touchstart", resetIdleTimer);
			window.removeEventListener("keydown", resetIdleTimer);
		};
	}, [isKioskMode]);

	// Screen Wake Lock (Mencegah layar mati otomatis)
	useEffect(() => {
		if (!isKioskMode) return;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let wakeLock: any = null;

		const requestWakeLock = async () => {
			try {
				if ("wakeLock" in navigator) {
					// @ts-expect-error WakeLock is standard but might miss in older TS DOM libs
					wakeLock = await navigator.wakeLock.request("screen");
				}
			} catch (err) {
				console.warn("Wake Lock gagal, layar mungkin mati otomatis:", err);
			}
		};

		const handleVisibilityChange = () => {
			if (wakeLock !== null && document.visibilityState === "visible") {
				requestWakeLock();
			}
		};

		requestWakeLock();
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			if (wakeLock !== null) {
				wakeLock.release().catch(() => {});
				wakeLock = null;
			}
		};
	}, [isKioskMode]);

	// Auto Player
	useEffect(() => {
		if (!isKioskMode || !isIdle) return;

		// Find current index based on URL
		const currentTab = searchParams.get("tab") || "general";
		const currentSubTab = searchParams.get("sub") || "";
		let currentIndex = TV_PLAYLIST.findIndex(
			(scene) =>
				scene.tab === currentTab && (scene.subTab ?? "") === currentSubTab,
		);
		if (currentIndex === -1) currentIndex = 0;

		const currentScene = TV_PLAYLIST[currentIndex];
		const container = document.getElementById("kiosk-scroll-container");
		let animationFrameId: number;
		let startTime: number | null = null;
		let transitionTriggered = false;

		const startDelayMs = 4000; // Wait 4 seconds at the top
		const endDelayMs = 4000; // Wait 4 seconds at the bottom
		const SCROLL_SPEED = 65; // pixels per second (slightly faster but still smooth)

		const changeScene = () => {
			if (transitionTriggered) return;
			transitionTriggered = true;
			const nextIndex = (currentIndex + 1) % TV_PLAYLIST.length;
			const nextScene = TV_PLAYLIST[nextIndex];

			const newParams: Record<string, string> = {
				kiosk: "true",
				tab: nextScene.tab,
			};
			if (nextScene.subTab) newParams.sub = nextScene.subTab;

			setSearchParams(newParams);
		};

		const animateScroll = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;

			if (!container) {
				if (elapsed > currentScene.durationMs) changeScene();
				else animationFrameId = requestAnimationFrame(animateScroll);
				return;
			}

			const maxScroll = Math.max(
				0,
				container.scrollHeight - container.clientHeight,
			);

			// If no scroll needed, use default duration
			if (maxScroll <= 0) {
				if (elapsed > currentScene.durationMs) {
					changeScene();
				} else {
					animationFrameId = requestAnimationFrame(animateScroll);
				}
				return;
			}

			// If scroll is needed, dynamic duration based on page length
			if (elapsed > startDelayMs) {
				const scrollTimeMs = (maxScroll / SCROLL_SPEED) * 1000;
				const progress = Math.min((elapsed - startDelayMs) / scrollTimeMs, 1);

				// Sine easing for very smooth start and stop
				const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
				container.scrollTop = easeInOutSine(progress) * maxScroll;

				// Wait at the bottom
				if (progress >= 1) {
					const timeSinceReachedBottom = elapsed - startDelayMs - scrollTimeMs;
					if (timeSinceReachedBottom > endDelayMs) {
						changeScene();
						return;
					}
				}
			}

			if (!transitionTriggered) {
				animationFrameId = requestAnimationFrame(animateScroll);
			}
		};

		if (container) {
			container.style.scrollBehavior = "auto";
			container.scrollTop = 0;
		}

		animationFrameId = requestAnimationFrame(animateScroll);

		return () => {
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, [isKioskMode, isIdle, searchParams, setSearchParams]);

	return {
		isKioskMode,
		isIdle,
	};
}
