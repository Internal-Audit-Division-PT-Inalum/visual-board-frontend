import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccessResponse, WorkstationData } from "@/types/api";

const getWorkstationByEmployee = async (
	employeeId: string,
): Promise<WorkstationData> => {
	const { data } = await api.get<ApiSuccessResponse<WorkstationData>>(
		`/visual-board/kiosk/workstations/by-employee/${employeeId}`,
	);
	return data.data;
};

export const useWorkstationByEmployee = (employeeId: string | null) => {
	return useQuery({
		queryKey: ["workstation-by-employee", employeeId],
		queryFn: () => {
			if (!employeeId) {
				throw new Error("Employee ID is required to fetch workstation data.");
			}
			return getWorkstationByEmployee(employeeId);
		},
		enabled: Boolean(employeeId),
		retry: false,
	});
};
