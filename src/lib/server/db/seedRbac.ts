import { db } from './index.js';
import * as schema from './schema.js';
import {
	DEFAULT_PERMISSIONS,
	DEFAULT_ROLES,
	ROLE_PERMISSION_DEFAULTS,
	SEED_ACCOUNTS
} from './rbacData.js';
import { eq } from 'drizzle-orm';

export async function seedRbacAndUsers() {
	console.log('--- Starting Dynamic RBAC and User Seeding ---');

	// 1. Seed Permissions
	const existingPerms = await db.select().from(schema.permissions);
	const permMap = new Map<string, string>(); // code -> id

	for (const p of existingPerms) {
		permMap.set(p.code, p.id);
	}

	for (const p of DEFAULT_PERMISSIONS) {
		if (!permMap.has(p.code)) {
			const [inserted] = await db.insert(schema.permissions).values(p).returning();
			permMap.set(p.code, inserted.id);
		}
	}
	console.log(`Permissions seeded. Total: ${permMap.size}`);

	// 2. Seed Roles
	const existingRoles = await db.select().from(schema.roles);
	const roleMap = new Map<string, string>(); // code -> id

	for (const r of existingRoles) {
		roleMap.set(r.code, r.id);
	}

	for (const r of DEFAULT_ROLES) {
		if (!roleMap.has(r.code)) {
			const [inserted] = await db.insert(schema.roles).values(r).returning();
			roleMap.set(r.code, inserted.id);
		}
	}
	console.log(`Roles seeded. Total: ${roleMap.size}`);

	// 3. Assign Role Permissions
	for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSION_DEFAULTS)) {
		const roleId = roleMap.get(roleCode);
		if (!roleId) continue;

		for (const pCode of permCodes) {
			const permId = permMap.get(pCode);
			if (!permId) continue;

			const existing = await db
				.select()
				.from(schema.rolePermissions)
				.where(
					eq(schema.rolePermissions.roleId, roleId) &&
						eq(schema.rolePermissions.permissionId, permId)
				);

			if (existing.length === 0) {
				await db.insert(schema.rolePermissions).values({
					roleId,
					permissionId: permId
				});
			}
		}
	}
	console.log('Role Permissions mappings verified.');

	// 4. Seed User Accounts & Assign UserRoles
	for (const acc of SEED_ACCOUNTS) {
		const [existingUser] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, acc.email));

		let userId = existingUser?.id;

		if (!userId) {
			const [inserted] = await db
				.insert(schema.users)
				.values({
					userNo: acc.userNo,
					fullName: acc.fullName,
					name: acc.fullName,
					email: acc.email,
					username: acc.username,
					role: acc.roleCode,
					department: acc.department,
					branch: 'JKT-HQ',
					status: 'ACTIVE',
					isActive: true,
					isLocked: false,
					mustChangePassword: true,
					passwordHash: 'argon2id$v=19$m=65536,t=3,p=4$wahana_seed_hash'
				})
				.returning();
			userId = inserted.id;
		}

		const roleId = roleMap.get(acc.roleCode);
		if (userId && roleId) {
			const userRoleExists = await db
				.select()
				.from(schema.userRoles)
				.where(
					eq(schema.userRoles.userId, userId) &&
						eq(schema.userRoles.roleId, roleId)
				);

			if (userRoleExists.length === 0) {
				await db.insert(schema.userRoles).values({
					userId,
					roleId,
					assignedBy: 'SYSTEM'
				});
			}
		}
	}
	console.log(`Seed Accounts created. Total: ${SEED_ACCOUNTS.length}`);

	// 5. Seed Navigation Menus
	const defaultMenus = [
		{ name: 'Dashboard', code: 'menu.dashboard', route: 'dashboard', icon: 'LayoutDashboard', sortOrder: 1 },
		{ name: 'Customers B2B', code: 'menu.customers', route: 'crm-customers', icon: 'Building2', sortOrder: 2 },
		{ name: 'New Invoice', code: 'menu.new_invoice', route: 'new-invoice', icon: 'PlusCircle', sortOrder: 3 },
		{ name: 'Invoice List', code: 'menu.invoices', route: 'invoices', icon: 'Receipt', sortOrder: 4 },
		{ name: 'Invoice Approval', code: 'menu.approval', route: 'approval', icon: 'CheckSquare', sortOrder: 5 },
		{ name: 'Invoice Overdue', code: 'menu.overdue', route: 'overdue', icon: 'Clock', sortOrder: 6 },
		{ name: 'Invoice Tracking', code: 'menu.tracking', route: 'tracking', icon: 'Compass', sortOrder: 7 },
		{ name: 'Payment Receipt', code: 'menu.payments', route: 'payment-receipt', icon: 'CreditCard', sortOrder: 8 },
		{ name: 'Vendor Billing', code: 'menu.vendor_billing', route: 'vendor-billing', icon: 'FileSpreadsheet', sortOrder: 9 },
		{ name: 'Bank Statement', code: 'menu.bank_statement', route: 'bank-statement', icon: 'FileCheck', sortOrder: 10 },
		{ name: 'Daily Report', code: 'menu.daily_report', route: 'daily-report', icon: 'FileText', sortOrder: 11 },
		{ name: 'User Management & RBAC', code: 'menu.admin', route: 'admin-users', icon: 'ShieldCheck', sortOrder: 12 }
	];

	for (const m of defaultMenus) {
		const [existingMenu] = await db
			.select()
			.from(schema.navigationMenus)
			.where(eq(schema.navigationMenus.code, m.code));

		if (!existingMenu) {
			await db.insert(schema.navigationMenus).values(m);
		}
	}
	console.log('Navigation menus seeded.');

	console.log('--- Dynamic RBAC Seeding Completed ---');
}

