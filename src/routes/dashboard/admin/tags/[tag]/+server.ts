import type { RequestHandler } from './$types';
import { tagValidator } from '@/validators/descriptionEditFormValidator';
import { error, json } from '@sveltejs/kit';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { session } = await locals.auth();
	if (session.adminId === null) return new Response('Unauthorized', { status: 403 });

	const parseRes = tagValidator.safeParse(params.tag);
	if (!parseRes.success) return error(400, 'Invalid Tag');
	const tag = parseRes.data;

	const result = await db.delete(table.defaultTags).where(eq(table.defaultTags.tag, tag));

	if (result.rowCount === 0) return error(404, 'Tag not found');

	return json({});
};
