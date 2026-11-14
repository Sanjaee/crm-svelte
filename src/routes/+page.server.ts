import { db } from '#lib/server/db/index.js';
import * as schema from '#lib/server/db/schema.js';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// 1. Query real B2B Customers with relations
		const rawCustomers = await db.query.businessProfiles.findMany({
			with: {
				invoiceAndPayment: true,
				contactInfos: true,
				personInCharges: true,
				taxInfos: true,
				refundAccounts: true
			},
			orderBy: [desc(schema.businessProfiles.createdDate)]
		});

		// 2. Query real Invoices with flight reservations
		const rawInvoices = await db.query.invoices.findMany({
			with: {
				flightReservations: {
					with: {
						routes: true,
						passengers: true
					}
				},
				actions: true
			},
			orderBy: [desc(schema.invoices.createdDate)]
		});

		// 3. Query real Payments
		const rawPayments = await db.query.payments.findMany({
			with: {
				allocations: true
			},
			orderBy: [desc(schema.payments.createdDate)]
		});

		// 4. Query Users, Roles, Permissions for RBAC
		const rawUsers = await db.select().from(schema.users).orderBy(desc(schema.users.createdDate));
		const rawRoles = await db.select().from(schema.roles).orderBy(schema.roles.name);
		const rawPermissions = await db.select().from(schema.permissions).orderBy(schema.permissions.module);
		const rawOverrides = await db.select().from(schema.userPermissionOverrides);

		return {
			databaseConnected: true,
			customers: rawCustomers,
			invoices: rawInvoices,
			payments: rawPayments,
			usersList: rawUsers,
			rolesList: rawRoles,
			permissionsList: rawPermissions,
			overridesList: rawOverrides,
			stats: {
				customers: rawCustomers.length,
				invoices: rawInvoices.length,
				payments: rawPayments.length,
				users: rawUsers.length,
				roles: rawRoles.length
			}
		};
	} catch (error: any) {
		console.error('Database query error:', error);
		return {
			databaseConnected: false,
			customers: [],
			invoices: [],
			payments: [],
			usersList: [],
			rolesList: [],
			permissionsList: [],
			overridesList: [],
			stats: { customers: 0, invoices: 0, payments: 0, users: 0, roles: 0 }
		};
	}
};
