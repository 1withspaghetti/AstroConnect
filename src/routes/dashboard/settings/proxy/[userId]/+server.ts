import { db, table } from '@/server/db';
import type { RequestHandler } from './$types';
import { validateId } from '@/validators/idValidator';
import { and, eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user } = await locals.auth();

	const proxyId = validateId(params.userId);

	const result = await db
		.delete(table.userProxies)
		.where(and(eq(table.userProxies.userId, user.id), eq(table.userProxies.proxyId, proxyId)));

	if (result.rowCount === 0) return error(404, 'Proxy user not found');

	return json({});
};
