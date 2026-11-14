import { db } from './index.js';
import * as schema from './schema.js';
import { eq } from 'drizzle-orm';

export const DEFAULT_PERMISSIONS = [
	// Dashboard
	{ code: 'dashboard.view', name: 'View Dashboard', module: 'DASHBOARD', description: 'Access dashboard overview' },
	
	// Customers
	{ code: 'customers.view', name: 'View Customers', module: 'CRM', description: 'View customer directory and profiles' },
	{ code: 'customers.create', name: 'Create Customer', module: 'CRM', description: 'Create new B2B customer profile' },
	{ code: 'customers.update', name: 'Update Customer', module: 'CRM', description: 'Update B2B customer details & rules' },
	{ code: 'customers.archive', name: 'Archive Customer', module: 'CRM', description: 'Archive customer record' },
	{ code: 'customers.export', name: 'Export Customers', module: 'CRM', description: 'Export customer list to Excel/CSV' },
	
	// Invoices
	{ code: 'invoices.view', name: 'View Invoices', module: 'INVOICE MANAGEMENT', description: 'View invoice list and details' },
	{ code: 'invoices.create', name: 'Create Invoice', module: 'INVOICE MANAGEMENT', description: 'Create new flight/hotel invoice' },
	{ code: 'invoices.update', name: 'Update Invoice', module: 'INVOICE MANAGEMENT', description: 'Edit draft invoices' },
	{ code: 'invoices.submit', name: 'Submit Invoice', module: 'INVOICE MANAGEMENT', description: 'Submit invoice for approval' },
	{ code: 'invoices.approve', name: 'Approve Invoice', module: 'INVOICE MANAGEMENT', description: 'Approve submitted invoice' },
	{ code: 'invoices.reject', name: 'Reject Invoice', module: 'INVOICE MANAGEMENT', description: 'Reject invoice with mandatory note' },
	{ code: 'invoices.void.request', name: 'Request Void', module: 'INVOICE MANAGEMENT', description: 'Request void for invoice' },
	{ code: 'invoices.void.approve', name: 'Approve Void', module: 'INVOICE MANAGEMENT', description: 'Approve void invoice' },
	{ code: 'invoices.archive', name: 'Archive Invoice', module: 'INVOICE MANAGEMENT', description: 'Archive invoice' },
	{ code: 'invoices.restore', name: 'Restore Invoice', module: 'INVOICE MANAGEMENT', description: 'Restore archived invoice' },
	{ code: 'invoices.export', name: 'Export Invoices', module: 'INVOICE MANAGEMENT', description: 'Export invoices' },

	// Tracking & Overdue
	{ code: 'invoice_tracking.view', name: 'View Tracking', module: 'INVOICE TRACKING', description: 'Global invoice timeline search' },
	{ code: 'invoice_overdue.view', name: 'View Overdue', module: 'INVOICE OVERDUE', description: 'View overdue invoices and penalties' },
	{ code: 'invoice_overdue.update_followup', name: 'Update Overdue Followup', module: 'INVOICE OVERDUE', description: 'Update promise to pay date' },

	// Vendor Billing
	{ code: 'vendor_billing.view', name: 'View Vendor Billing', module: 'VENDOR BILLING', description: 'View vendor billing staging' },
	{ code: 'vendor_billing.upload', name: 'Upload Vendor Billing', module: 'VENDOR BILLING', description: 'Upload Excel/CSV billing' },
	{ code: 'vendor_billing.process', name: 'Process Billing', module: 'VENDOR BILLING', description: 'Execute matching algorithm' },
	{ code: 'vendor_billing.reprocess', name: 'Reprocess Billing', module: 'VENDOR BILLING', description: 'Reprocess error staging' },
	{ code: 'vendor_billing.finalize', name: 'Finalize Billing', module: 'VENDOR BILLING', description: 'Finalize vendor billing import' },

	// Bank Statement
	{ code: 'bank_statement.view', name: 'View Bank Statement', module: 'BANK STATEMENT', description: 'View bank statement mutations' },
	{ code: 'bank_statement.upload', name: 'Upload Statement', module: 'BANK STATEMENT', description: 'Upload MT940 / CSV statements' },
	{ code: 'bank_statement.process', name: 'Process Statement', module: 'BANK STATEMENT', description: 'Process auto-matching' },
	{ code: 'bank_statement.match', name: 'Manual Match Statement', module: 'BANK STATEMENT', description: 'Manually match transaction' },
	{ code: 'bank_statement.reprocess', name: 'Reprocess Statement', module: 'BANK STATEMENT', description: 'Reprocess statement errors' },
	{ code: 'bank_statement.finalize', name: 'Finalize Statement', module: 'BANK STATEMENT', description: 'Finalize statement reconciliation' },

	// Payments
	{ code: 'payments.view', name: 'View Payments', module: 'PAYMENTS', description: 'View payment receipts' },
	{ code: 'payments.create', name: 'Create Payment', module: 'PAYMENTS', description: 'Record payment receipt' },
	{ code: 'payments.allocate', name: 'Allocate Payment', module: 'PAYMENTS', description: 'Allocate payment to invoices' },
	{ code: 'payments.refund.request', name: 'Request Refund', module: 'PAYMENTS', description: 'Request customer refund' },
	{ code: 'payments.refund.approve', name: 'Approve Refund', module: 'PAYMENTS', description: 'Approve customer refund' },

	// Reports
	{ code: 'reports.daily_payment.view', name: 'View Daily Payment Report', module: 'REPORTS', description: 'View daily cash report' },
	{ code: 'reports.daily_payment.export', name: 'Export Daily Payment Report', module: 'REPORTS', description: 'Export daily report' },

	// Administration
	{ code: 'users.view', name: 'View Users', module: 'ADMINISTRATION', description: 'View system users' },
	{ code: 'users.create', name: 'Create User', module: 'ADMINISTRATION', description: 'Create new user' },
	{ code: 'users.update', name: 'Update User', module: 'ADMINISTRATION', description: 'Edit user details and roles' },
	{ code: 'users.deactivate', name: 'Deactivate User', module: 'ADMINISTRATION', description: 'Deactivate or lock user account' },
	{ code: 'roles.view', name: 'View Roles', module: 'ADMINISTRATION', description: 'View role list' },
	{ code: 'roles.create', name: 'Create Role', module: 'ADMINISTRATION', description: 'Create new custom role' },
	{ code: 'roles.update', name: 'Update Role', module: 'ADMINISTRATION', description: 'Edit role permissions' },
	{ code: 'permissions.view', name: 'View Permissions', module: 'ADMINISTRATION', description: 'View permissions matrix' },
	{ code: 'permissions.assign', name: 'Assign Permissions', module: 'ADMINISTRATION', description: 'Assign role & user overrides' },
	{ code: 'audit_logs.view', name: 'View Audit Logs', module: 'ADMINISTRATION', description: 'View audit logs' },
	{ code: 'system.settings.manage', name: 'Manage System Settings', module: 'ADMINISTRATION', description: 'Manage global settings' }
];

export const DEFAULT_ROLES = [
	{ code: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Full system administration and permission control', isSystem: true },
	{ code: 'TICKETING', name: 'Ticketing Officer', description: 'Operations staff: create, update, and submit invoices', isSystem: true },
	{ code: 'SUPERVISOR', name: 'Operational Supervisor', description: 'Review, approve, and reject operational invoices', isSystem: true },
	{ code: 'ACCOUNTING_AR', name: 'Accounting AR Specialist', description: 'Accounts Receivable, billing reconciliation, and payment allocation', isSystem: true },
	{ code: 'ACCOUNTING_AP', name: 'Accounting AP Specialist', description: 'Accounts Payable, payment disbursements, and refunds', isSystem: true },
	{ code: 'ACCOUNTING_TAX', name: 'Accounting Tax Specialist', description: 'Tax reporting, PPN/Faktur pajak verification', isSystem: true },
	{ code: 'ACCOUNTING_FINANCE', name: 'Finance Manager', description: 'Settlement summary, cashflow, and financial monitoring', isSystem: true }
];

export const ROLE_PERMISSION_DEFAULTS: Record<string, string[]> = {
	SUPER_ADMIN: DEFAULT_PERMISSIONS.map((p) => p.code),
	TICKETING: [
		'dashboard.view',
		'customers.view',
		'customers.create',
		'customers.update',
		'invoices.view',
		'invoices.create',
		'invoices.update',
		'invoices.submit',
		'invoice_tracking.view'
	],
	SUPERVISOR: [
		'dashboard.view',
		'customers.view',
		'invoices.view',
		'invoices.approve',
		'invoices.reject',
		'invoices.void.approve',
		'invoices.archive',
		'invoices.restore',
		'invoice_tracking.view',
		'invoice_overdue.view',
		'reports.daily_payment.view'
	],
	ACCOUNTING_AR: [
		'dashboard.view',
		'customers.view',
		'invoices.view',
		'invoices.approve',
		'invoices.reject',
		'invoice_tracking.view',
		'invoice_overdue.view',
		'invoice_overdue.update_followup',
		'vendor_billing.view',
		'vendor_billing.upload',
		'vendor_billing.process',
		'vendor_billing.reprocess',
		'vendor_billing.finalize',
		'bank_statement.view',
		'bank_statement.upload',
		'bank_statement.process',
		'bank_statement.match',
		'bank_statement.reprocess',
		'payments.view',
		'payments.create',
		'payments.allocate',
		'reports.daily_payment.view',
		'reports.daily_payment.export'
	],
	ACCOUNTING_AP: [
		'dashboard.view',
		'invoice_tracking.view',
		'invoices.view',
		'payments.view',
		'payments.create',
		'payments.refund.request',
		'reports.daily_payment.view',
		'reports.daily_payment.export'
	],
	ACCOUNTING_TAX: [
		'dashboard.view',
		'invoice_tracking.view',
		'reports.daily_payment.view'
	],
	ACCOUNTING_FINANCE: [
		'dashboard.view',
		'invoice_tracking.view',
		'payments.view',
		'bank_statement.view',
		'reports.daily_payment.view',
		'reports.daily_payment.export'
	]
};

export const SEED_ACCOUNTS = [
	{
		email: 'admin@wahanatravel.example',
		username: 'admin',
		fullName: 'Super Administrator',
		userNo: 'USR-ADMIN-01',
		roleCode: 'SUPER_ADMIN',
		department: 'IT & MANAGEMENT'
	},
	{
		email: 'ticketing@wahanatravel.example',
		username: 'ticketing',
		fullName: 'Sarah Ticketing Specialist',
		userNo: 'USR-TCK-001',
		roleCode: 'TICKETING',
		department: 'OPERATIONS'
	},
	{
		email: 'supervisor@wahanatravel.example',
		username: 'supervisor',
		fullName: 'Budi Operational Supervisor',
		userNo: 'USR-SPV-001',
		roleCode: 'SUPERVISOR',
		department: 'OPERATIONS'
	},
	{
		email: 'accounting.ar@wahanatravel.example',
		username: 'accounting.ar',
		fullName: 'Linda Accounting AR',
		userNo: 'USR-AR-001',
		roleCode: 'ACCOUNTING_AR',
		department: 'ACCOUNTING'
	},
	{
		email: 'accounting.ap@wahanatravel.example',
		username: 'accounting.ap',
		fullName: 'Rudi Accounting AP',
		userNo: 'USR-AP-001',
		roleCode: 'ACCOUNTING_AP',
		department: 'ACCOUNTING'
	},
	{
		email: 'accounting.tax@wahanatravel.example',
		username: 'accounting.tax',
		fullName: 'Hendra Tax Specialist',
		userNo: 'USR-TAX-001',
		roleCode: 'ACCOUNTING_TAX',
		department: 'TAX & COMPLIANCE'
	},
	{
		email: 'accounting.finance@wahanatravel.example',
		username: 'accounting.finance',
		fullName: 'Maya Finance Director',
		userNo: 'USR-FIN-001',
		roleCode: 'ACCOUNTING_FINANCE',
		department: 'FINANCE'
	}
];

