import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
	ApiSuccessResponse,
	AttendanceSummaryResponse,
} from "@/types/api";

export function useAttendanceSummary() {
	return useQuery({
		queryKey: ["attendanceSummary"],
		queryFn: async () => {
			const response = await axios.get<
				ApiSuccessResponse<AttendanceSummaryResponse>
			>("http://localhost:8000/api/v1/hr/kiosk/attendance-summary");
			return response.data.data;
		},
		refetchInterval: 300000,
	});
}
