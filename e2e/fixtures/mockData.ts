import type {
	AttendanceSummaryResponse,
	Bulletin,
	KioskDashboardResponse,
	KioskLocationWithItems,
	OrganizationDocument,
	QuickLink,
} from "@/types/api";

export const MOCK_KIOSK_DASHBOARD: KioskDashboardResponse = {
	pic: {
		name: "Ahmad Evaluator",
		position_title: "Auditor Senior",
		avatar_url: null,
	},
	open_abnormality_count: 2,
	abnormality_resolved_today: 1,
	abnormality_in_progress: 1,
	compliance_percentage: 94.5,
	safety_streak_days: 120,
	safety_safe_shifts: 360,
	kaizen_implemented_count: 5,
	resolution_speed_avg_mins: 45,
	resolution_rate: 88,
	resolution_grade: "A",
	oee_percentage: 91,
	oee_target: 85,
	zones: [
		{
			id: "zone-01",
			name: "Zona Lobby Audit",
			area: "Lantai 1",
			standard_image_url: null,
			pic_utama: "MRA",
			pic_pengganti: "BDI",
		},
	],
	abnormalities: [],
	kaizen_champions: [
		{
			rank: 1,
			user_id: "usr-01",
			name: "Muhammad Ridwan Auditor",
			department: "Internal Audit",
			score: 95,
			kaizen_count: 3,
		},
	],
	schedule_matrix: [
		{
			zone_id: "zone-01",
			zone_name: "Zona Lobby Audit",
			item_group: "Ringkas",
			criteria_code: "5R-01",
			criteria_description: "Kerapihan berkas & jalur evakuasi",
			days: {
				"1": "ok_dengan_5r",
				"2": "ok_tanpa_5r",
			},
		},
	],
	weekly_trend: [
		{ day: "Sen", compliance: 92, alert_count: 1 },
		{ day: "Sel", compliance: 95, alert_count: 0 },
	],
	trend_matrix: [],
	reference_docs: [],
	five_r_evaluations: [
		{
			id: "eval-01",
			month: 11,
			year: 2026,
			type: "self_assessment",
			total_score: 92,
			file_url: null,
		},
	],
	assessment_docs: [],
};

export const MOCK_ATTENDANCE_SUMMARY: AttendanceSummaryResponse = {
	total_employees: 12,
	present_count: 10,
	on_leave_count: 1,
	sick_count: 0,
	business_trip_count: 1,
	unavailable_today: [],
	division_employees: [
		{
			user_id: "usr-01",
			name: "Muhammad Ridwan Auditor",
			role_label: "Auditor Senior",
			unit: "Internal Audit",
			hierarchy_level: 2,
			today_status: "present",
		},
	],
};

export const MOCK_CLEAN_BULLETIN: Bulletin = {
	id: "bul-clean-01",
	title: "Jadwal Audit Triwulan IV",
	content: "<p>Pelaksanaan audit berjalan sesuai jadwal.</p>",
	type: "general",
	image_url: null,
	document_url: null,
	published_at: "2026-11-12T08:00:00Z",
	expired_at: null,
	author: "Internal Audit IIA",
};

export const XSS_BULLETIN_FIXTURE: Bulletin = {
	id: "bul-xss-01",
	title: "Pengumuman Keselamatan & Kebijakan 5R",
	content: [
		"<p>Pengumuman resmi standar 5R triwulan berjalan.</p>",
		'<script>window.__xssExecuted = "script";</script>',
		'<img src="/assets/nonexistent-xss-probe.png" alt="probe" onerror="window.__xssExecuted = \'onerror\'" />',
		"<a href=\"javascript:window.__xssExecuted='href'\">Tautan Berbahaya</a>",
		'<a href="https://portal.inalum.id/panduan">Tautan Resmi</a>',
	].join(""),
	type: "health_safety",
	image_url: null,
	document_url: null,
	published_at: "2026-11-12T09:00:00Z",
	expired_at: null,
	author: "HSE & Internal Audit",
};

export const MOCK_QUICK_LINKS: QuickLink[] = [
	{
		id: "ql-01",
		title: "Portal Audit",
		url: "https://portal.inalum.id",
		description: "Portal Internal Audit",
		icon: null,
		is_active: true,
	},
];

export const MOCK_INVENTORY_LOCATIONS: KioskLocationWithItems[] = [
	{
		id: "loc-01",
		name: "Rak Utama Audit",
		code: "RAK-A1",
		items: [
			{
				id: "item-01",
				name: "Rompi Safety K3",
				type: "asset",
				unit: "pcs",
				image_url: null,
				current_stock: 10,
				minimum_stock: 2,
				stock_status: "ok",
				borrowed_quantity: 1,
			},
		],
	},
];

export const MOCK_ORGANIZATION_DOCUMENTS: OrganizationDocument[] = [];
