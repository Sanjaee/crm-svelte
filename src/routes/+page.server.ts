import { db } from '#lib/server/db/index.js';
import * as schema from '#lib/server/db/schema.js';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Test live connection to Neon PostgreSQL
		const dbVersionResult = await db.execute(sql`SELECT version()`);
		const rawTables = await db.execute(
			sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
		);

		const customerCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(schema.businessProfiles);
		const invoiceCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(schema.invoices);
		const paymentCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(schema.payments);

		return {
			databaseConnected: true,
			dbHost: 'ep-wispy-cake-ao5ix3t9-pooler.c-2.ap-southeast-1.aws.neon.tech',
			region: 'Singapore (ap-southeast-1)',
			pgVersion: (dbVersionResult[0] as any)?.version || 'PostgreSQL (Neon)',
			tablesCount: rawTables.length,
			tables: rawTables.map((r: any) => r.table_name as string),
			stats: {
				customers: Number(customerCount[0]?.count ?? 0),
				invoices: Number(invoiceCount[0]?.count ?? 0),
				payments: Number(paymentCount[0]?.count ?? 0)
			}
		};
	} catch (error: any) {
		console.error('Database connection error:', error);
		return {
			databaseConnected: false,
			errorMessage: error?.message || 'Failed to connect to Neon PostgreSQL'
		};
	}
};
