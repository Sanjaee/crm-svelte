import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
	process.env.DATABASE_URL ||
	'postgresql://neondb_owner:npg_Vb9FYZanC2Ns@ep-wispy-cake-ao5ix3t9-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

