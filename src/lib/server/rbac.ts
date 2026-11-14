import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { eq, and } from 'drizzle-orm';

export interface UserPermissionContext {
	userId: string;
	username: string;
	email: string;
	primaryRole: string;
	effectivePermissions: string[];
	allowedMenus: Array<{
		code: string;
		name: string;
		route: string;
		icon: string;
		sortOrder: number;
	}>;
}

/**
 * Computes effective permissions for a user:
 * 1. Collect all permissions from assigned roles (ALLOW)
 * 2. Apply user-level overrides:
 *    - Explicit ALLOW adds permission
 *    - Explicit DENY strictly removes permission (DENY overrides role ALLOW)
 */
export async function computeUserPermissions(userId: string): Promise<string[]> {
	// 1. Get User's assigned roles
	const userRolesList = await db
		.select({ roleId: schema.userRoles.roleId })
		.from(schema.userRoles)
		.where(eq(schema.userRoles.userId, userId));

	let rolePermissionIds: string[] = [];

	if (userRolesList.length > 0) {
		const roleIds = userRolesList.map((ur) => ur.roleId);
		for (const rId of roleIds) {
			const rPerms = await db
				.select({ permissionId: schema.rolePermissions.permissionId })
				.from(schema.rolePermissions)
				.where(eq(schema.rolePermissions.roleId, rId));
			rolePermissionIds.push(...rPerms.map((rp) => rp.permissionId));
		}
	}

	// 2. Fetch User Permission Overrides
	const overrides = await db
		.select({
			permissionId: schema.userPermissionOverrides.permissionId,
			effect: schema.userPermissionOverrides.effect
		})
		.from(schema.userPermissionOverrides)
		.where(eq(schema.userPermissionOverrides.userId, userId));

	const allowedSet = new Set<string>(rolePermissionIds);

	for (const o of overrides) {
		if (o.effect === 'ALLOW') {
			allowedSet.add(o.permissionId);
		} else if (o.effect === 'DENY') {
			allowedSet.delete(o.permissionId);
		}
	}

	if (allowedSet.size === 0) return [];

	// 3. Resolve to Permission Codes
	const permList = await db.select().from(schema.permissions);
	const codeMap = new Map(permList.map((p) => [p.id, p.code]));

	const effectiveCodes: string[] = [];
	for (const pId of allowedSet) {
		const code = codeMap.get(pId);
		if (code) effectiveCodes.push(code);
	}

	return effectiveCodes;
}

/**
 * Checks whether user has permission.
 * If user has 'SUPER_ADMIN' role or '*', returns true.
 */
export function hasEffectivePermission(
	userPermissions: string[],
	requiredCode: string
): boolean {
	if (userPermissions.includes('SUPER_ADMIN') || userPermissions.includes('*')) {
		return true;
	}
	return userPermissions.includes(requiredCode);
}

