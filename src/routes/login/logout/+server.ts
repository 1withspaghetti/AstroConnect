import { error } from 'console';
import type { RequestHandler } from './$types';
import { deleteSessionTokenCookie, invalidateSession } from '@/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	await invalidateSession(locals.session!.id);
	deleteSessionTokenCookie();
	return redirect(302, '/');
};
