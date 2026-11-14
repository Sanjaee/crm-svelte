export type UserRole =
	| 'TICKETING'
	| 'SUPERVISOR'
	| 'ACCOUNTING_AR'
	| 'ACCOUNTING_AP'
	| 'ACCOUNTING_TAX'
	| 'ADMIN';

export interface UserSession {
	userNo: string;
	name: string;
	email: string;
	role: UserRole;
	branch: string;
}

export const MOCK_USERS: Record<UserRole, UserSession> = {
	TICKETING: {
		userNo: 'USR-TCK-001',
		name: 'Sarah Ticketing',
		email: 'sarah.ticketing@wahanatravel.com',
		role: 'TICKETING',
		branch: 'JKT-HQ'
	},
	SUPERVISOR: {
		userNo: 'USR-SPV-001',
		name: 'Budi Supervisor',
		email: 'budi.spv@wahanatravel.com',
		role: 'SUPERVISOR',
		branch: 'JKT-HQ'
	},
	ACCOUNTING_AR: {
		userNo: 'USR-AR-001',
		name: 'Linda Accounting AR',
		email: 'linda.ar@wahanatravel.com',
		role: 'ACCOUNTING_AR',
		branch: 'JKT-HQ'
	},
	ACCOUNTING_AP: {
		userNo: 'USR-AP-001',
		name: 'Rudi Accounting AP',
		email: 'rudi.ap@wahanatravel.com',
		role: 'ACCOUNTING_AP',
		branch: 'JKT-HQ'
	},
	ACCOUNTING_TAX: {
		userNo: 'USR-TAX-001',
		name: 'Hendra Tax Specialist',
		email: 'hendra.tax@wahanatravel.com',
		role: 'ACCOUNTING_TAX',
		branch: 'JKT-HQ'
	},
	ADMIN: {
		userNo: 'USR-ADM-001',
		name: 'Admin Wahana',
		email: 'admin@wahanatravel.com',
		role: 'ADMIN',
		branch: 'JKT-HQ'
	}
};

/**
 * Role Permission Check Matrix
 * Directly based on WahanaTravel Role Legend Diagram
 */
export function hasPermission(role: UserRole, action: string): boolean {
	if (role === 'ADMIN') return true;

	const permissions: Record<string, UserRole[]> = {
		'CREATE_INVOICE': ['TICKETING', 'SUPERVISOR'],
		'EDIT_DRAFT_INVOICE': ['TICKETING', 'SUPERVISOR'],
		'SUBMIT_INVOICE': ['TICKETING', 'SUPERVISOR'],
		'APPROVE_INVOICE': ['SUPERVISOR', 'ACCOUNTING_AR'],
		'REJECT_INVOICE': ['SUPERVISOR', 'ACCOUNTING_AR'],
		'REQUEST_VOID_INVOICE': ['TICKETING'],
		'APPROVE_VOID_INVOICE': ['SUPERVISOR', 'ACCOUNTING_AR'],
		'VIEW_INVOICE_OVERDUE': ['SUPERVISOR', 'ACCOUNTING_AR'],
		'VENDOR_BILLING_HANDLING': ['ACCOUNTING_AR'],
		'BANK_STATEMENT_HANDLING': ['ACCOUNTING_AR'],
		'PAYMENT_RECEIPT_ALLOCATION': ['ACCOUNTING_AR', 'ACCOUNTING_AP'],
		'DAILY_PAYMENT_REPORT': ['SUPERVISOR', 'ACCOUNTING_AR', 'ACCOUNTING_AP'],
		'MANAGE_CUSTOMERS_B2B': ['SUPERVISOR', 'ACCOUNTING_AR']
	};

	const allowedRoles = permissions[action];
	return allowedRoles ? allowedRoles.includes(role) : false;
}

