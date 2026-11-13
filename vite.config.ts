import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const backendTarget = env.VITE_BACKEND_TARGET || "http://localhost:8000";

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			host: true,
			proxy: {
				"/api": {
					target: backendTarget,
					changeOrigin: true,
				},
				"/storage": {
					target: backendTarget,
					changeOrigin: true,
				},
			},
		},
		preview: {
			host: true,
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						if (!id.includes("node_modules")) {
							return undefined;
						}
						if (
							id.includes("node_modules/react/") ||
							id.includes("node_modules/react-dom/") ||
							id.includes("node_modules/react-router") ||
							id.includes("node_modules/scheduler/")
						) {
							return "vendor-react";
						}
						if (
							id.includes("node_modules/recharts/") ||
							id.includes("node_modules/d3-") ||
							id.includes("node_modules/victory-vendor/")
						) {
							return "vendor-charts";
						}
						if (
							id.includes("node_modules/@tanstack/") ||
							id.includes("node_modules/axios/")
						) {
							return "vendor-query";
						}
						if (
							id.includes("node_modules/lucide-react/") ||
							id.includes("node_modules/@base-ui/") ||
							id.includes("node_modules/sonner/") ||
							id.includes("node_modules/qrcode.react/")
						) {
							return "vendor-ui";
						}
						return undefined;
					},
				},
			},
		},
	};
});
