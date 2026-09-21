import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import MobileAttendance from "@/pages/MobileAttendance";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 2,
			staleTime: 10_000,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Toaster richColors position="top-right" />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<AppShell />} />
					<Route path="/presensi" element={<MobileAttendance />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
