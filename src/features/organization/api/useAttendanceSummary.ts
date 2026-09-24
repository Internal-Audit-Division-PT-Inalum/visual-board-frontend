import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	ApiSuccessResponse,
	AttendanceSummaryResponse,
} from "@/types/api";

export function useAttendanceSummary() {
	return useQuery({
		queryKey: ["attendanceSummary"],
		queryFn: async () => {
			const response = await api.get<
				ApiSuccessResponse<AttendanceSummaryResponse>
			>("/hr/kiosk/attendance-summary");
			return response.data.data;
		},
		refetchInterval: 300000,
	});
}
