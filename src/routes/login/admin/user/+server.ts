import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth';
import { invalidateSession } from '@/server/auth';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { session, user } = await locals.auth();
	if (!session.adminId) return error(403, 'Unauthorized');

	const token = generateSessionToken();
	const newSession = await createSession(token, session.adminId, session.adminId);
	setSessionTokenCookie(token, newSession.expiresAt);
	await invalidateSession(session.id);

	return json({});
};
