// HTTP Method types
type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH';

// Monitor types
type MonitorType =
	| 'status'
	| 'expected_status_code'
	| 'keyword'
	| 'keyword_absence'
	| 'ping'
	| 'tcp'
	| 'udp'
	| 'smtp'
	| 'pop'
	| 'imap'
	| 'dns'
	| 'playwright';

// Monitor status
type MonitorStatus = 'up' | 'down' | 'validating' | 'paused' | 'pending' | 'maintenance';

// Regions
type Region = 'us' | 'eu' | 'as' | 'au';

// Days of the week
type MaintenanceDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// SSL and Domain expiration days
type ExpirationDays = null | 1 | 2 | 3 | 7 | 14 | 30 | 60;

// Request header interface
interface RequestHeader {
	id: string;
	name: string;
	value: string;
}

// Monitor attributes interface
interface MonitorAttributes {
	url: string;
	pronounceable_name: string;
	auth_username: string;
	auth_password: string;
	monitor_type: MonitorType;
	monitor_group_id: number;
	last_checked_at: string;
	status: MonitorStatus;
	policy_id: number | null;
	team_name: string;
	required_keyword: string | null;
	verify_ssl: boolean;
	check_frequency: number;
	call: boolean;
	sms: boolean;
	email: boolean;
	push: boolean;
	team_wait: number;
	http_method: HttpMethod;
	request_timeout: number;
	recovery_period: number;
	request_headers: RequestHeader[];
	request_body: string;
	follow_redirects: boolean;
	remember_cookies: boolean;
	created_at: string;
	updated_at: string;
	ssl_expiration: ExpirationDays;
	domain_expiration: ExpirationDays;
	regions: Region[];
	expected_status_codes: number[];
	port: string | null;
	confirmation_period: number;
	paused_at: string | null;
	paused: boolean;
	maintenance_from: string | null;
	maintenance_to: string | null;
	maintenance_timezone: string;
	maintenance_days: MaintenanceDay[];
	playwright_script: string | null;
	ip_version: string | null;
	checks_version: string;
}

// Monitor interface
interface Monitor {
	id: string;
	type: 'monitor';
	attributes: MonitorAttributes;
	relationships: {
		policy: {
			// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
			data: null | unknown; // Type could be expanded if policy data structure is known
		};
	};
}

// Pagination interface
interface Pagination {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

// Root response interface
interface UptimeMonitorResponse {
	data: Monitor[];
	pagination: Pagination;
}

export type {
	UptimeMonitorResponse,
	Monitor,
	MonitorAttributes,
	RequestHeader,
	MonitorType,
	MonitorStatus,
	HttpMethod,
	Region,
	MaintenanceDay,
	ExpirationDays,
	Pagination
};
