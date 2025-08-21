import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod/v4';
import { db, table } from '@/server/db';
import { ilike, asc } from 'drizzle-orm';

let userQueryValidator = z.object({
	q: z.string().min(0).max(100).trim().optional()
});

export const GET: RequestHandler = async ({ locals, url }) => {
	const { session } = await locals.auth();
	if (!session.adminId) return error(403, 'Unauthorized');

	const searchParamsRes = userQueryValidator.safeParse(
		Object.fromEntries(url.searchParams.entries())
	);
	if (!searchParamsRes.success) return error(400, 'Invalid query parameters');
	const { q } = searchParamsRes.data;

	const users = await db.query.users.findMany({
		columns: {
			email: true
		},
		where: q ? ilike(table.users.email, `%${q}%`) : undefined,
		orderBy: [asc(table.users.email)],
		limit: 10
	});

	return json({
		users: users.map((user) => user.email)
	});
};
