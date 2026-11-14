import { db } from '#lib/server/db/index.js';
import * as schema from '#lib/server/db/schema.js';
import { sql, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// 1. Connection check
		const dbVersionResult = await db.execute(sql`SELECT version()`);
		const rawTables = await db.execute(
			sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
		);

		// 2. Query real B2B Customers with relations
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

		// 3. Query real Invoices with flight reservations
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

		// 4. Query real Payments
		const rawPayments = await db.query.payments.findMany({
			with: {
				allocations: true
			},
			orderBy: [desc(schema.payments.createdDate)]
		});

		// 5. Query Audit Logs
		const rawLogs = await db.query.auditLogs.findMany({
			limit: 10,
			orderBy: [desc(schema.auditLogs.createdDate)]
		});

		return {
			databaseConnected: true,
			dbHost: 'ep-wispy-cake-ao5ix3t9-pooler.c-2.ap-southeast-1.aws.neon.tech',
			region: 'Singapore (ap-southeast-1)',
			pgVersion: (dbVersionResult[0] as any)?.version || 'PostgreSQL (Neon)',
			tablesCount: rawTables.length,
			tables: rawTables.map((r: any) => r.table_name as string),
			customers: rawCustomers,
			invoices: rawInvoices,
			payments: rawPayments,
			auditLogs: rawLogs,
			stats: {
				customers: rawCustomers.length,
				invoices: rawInvoices.length,
				payments: rawPayments.length
			}
		};
	} catch (error: any) {
		console.error('Database connection error:', error);
		return {
			databaseConnected: false,
			errorMessage: error?.message || 'Failed to connect to Neon PostgreSQL',
			customers: [],
			invoices: [],
			payments: [],
			auditLogs: [],
			stats: { customers: 0, invoices: 0, payments: 0 }
		};
	}
};
