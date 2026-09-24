export type AbnormalityStatus = "open" | "in_progress" | "resolved";

export type DayStatus = "rencana" | "ok_tanpa_5r" | "ok_dengan_5r" | "abnormal";

export interface Abnormality {
	id: string;

	zone_name: string;

	finder_name: string | null;

	group_name: string | null;

	description: string;

	countermeasure_plan: string | null;

	countermeasure_actual: string | null;

	date_found: string;

	planned_date: string | null;

	actual_date: string | null;

	status: AbnormalityStatus;

	progress_percentage: number;

	pic_name: string | null;

	is_kaizen: boolean;

	signed_by_staff: string | null;

	signed_by_ms: string | null;

	created_at: string;

	resolved_at: string | null;
}

export interface KaizenChampion {
	rank: number;
	user_id: string;
	name: string;

	department: string;

	score: number;

	kaizen_count: number;
}

export interface ZoneDetail {
	id: string;
	name: string;
	area?: string | null;
	standard_image_url: string | null;
	pic_utama?: string | null;
	pic_pengganti?: string | null;
}

export interface Zone {
	id: string;
	name: string;
	area?: string | null;
	standard_image_url: string | null;
	pic_utama?: string | null;
	pic_pengganti?: string | null;
}

export interface ScheduleZoneRow {
	zone_id: string;
	zone_name: string;
	item_group: string;
	criteria_code: string;
	criteria_description: string;

	days: Record<string, DayStatus>;
}

export interface KioskDashboardResponse {
	pic?: {
		name: string;
		position_title: string;
		avatar_url: string | null;
	} | null;
	open_abnormality_count: number;
	abnormality_resolved_today: number;
	abnormality_in_progress: number;

	compliance_percentage: number;

	safety_streak_days: number;
	safety_safe_shifts: number;

	kaizen_implemented_count: number;

	resolution_speed_avg_mins: number;
	resolution_rate: number;
	resolution_grade: string;

	oee_percentage: number;
	oee_target: number;

	zones: ZoneDetail[];

	abnormalities: Abnormality[];

	kaizen_champions: KaizenChampion[];

	schedule_matrix: ScheduleZoneRow[];

	weekly_trend: WeeklyTrendPoint[];

	trend_matrix: TrendAbnormalityRow[];

	reference_docs: GeneralDocument[];

	five_r_evaluations: FiveREvaluation[];
	assessment_docs: GeneralDocument[];
}

export interface FiveREvaluation {
	id: string;
	month: number;
	year: number;
	type: "self_assessment" | "asesor";
	total_score: number;
	file_url?: string | null;
}

export interface WeeklyTrendPoint {
	day: string;

	compliance?: number;

	alert_count: number;
}

export interface UnavailableEmployee {
	user_id: string;
	name: string;
	position: string;
	leave_type: "sick_leave" | "annual_leave" | "special_leave" | "business_trip";
	avatar_url?: string;
}

export interface AttendanceSummaryResponse {
	total_employees: number;
	present_count: number;
	on_leave_count: number;
	sick_count: number;
	business_trip_count: number;

	unavailable_today: UnavailableEmployee[];

	division_employees: DivisionEmployee[];
}

export interface DivisionEmployee {
	user_id: string;
	name: string;
	role_label: string;
	unit: string;
	hierarchy_level?: number;
	avatar_url?: string;
	today_status?: string | null;
}

export interface OrganizationDocument {
	id: string;
	title: string;
	description: string | null;
	image_url: string | null;
	category?: "structure" | "map_area";
}

export interface TrendMonthData {
	temuan: number | null;
	tindak_lanjut: number | null;
	belum_selesai: number | null;
}

export interface TrendAbnormalityRow {
	zone_label: string;

	months: Record<string, TrendMonthData>;
}

export interface TrendAbnormalityResponse {
	year: number;
	matrix: TrendAbnormalityRow[];
}

export type GeneralDocumentCategory =
	| "basic_rule"
	| "flow_process"
	| "kaizen_report"
	| "sor"
	| "cog"
	| "berat_badan"
	| "self_assessment"
	| "asesor";

export type GeneralDocumentDomain =
	| "visual_board"
	| "organization"
	| "assessment";

export interface GeneralDocument {
	id: string;
	title: string;
	description: string | null;
	domain: GeneralDocumentDomain;
	category: GeneralDocumentCategory | "structure" | "map_area";
	document_url: string;
	mime_type: string | null;
}

export interface BulletinsResponse {
	data: Bulletin[];
}

export interface QuickLink {
	id: string;
	title: string;
	url: string;
	description: string | null;
	icon: string | null;
	is_active: boolean;
}

export interface ApiSuccessResponse<T> {
	success: true;
	message: string;
	data: T;
}

export interface Bulletin {
	id: string;
	title: string;
	content: string;
	type: "general" | "health_safety" | "event" | "policy";
	image_url: string | null;
	document_url: string | null;
	published_at: string;
	expired_at: string | null;
	author: string;
}

export interface WorkstationItem {
	id: string;
	name: string;
	sku: string;
	standard_quantity: number;
}

export interface WorkstationData {
	id: string;
	name: string;
	is_active: boolean;
	standard_image_url: string | null;
	zone?: { id: string; name: string };
	pic_utama?: { id: string; namecode: string } | null;
	pic_pengganti?: { id: string; namecode: string } | null;
	employee?: {
		id: string;
		namecode: string;
		name: string;
		avatar_url?: string;
	};
	items?: WorkstationItem[];
	master_criterias?: {
		id: string;
		item_group: string;
		criteria_code: string;
		standard_criteria: string;
	}[];
	created_at: string;
}
