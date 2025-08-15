import { generateSessionToken, createSession, setSessionTokenCookie } from '@/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Create a session for the user
	const token = generateSessionToken();
	const session = await createSession(token, 'd939dfd7-6006-4ccf-a822-74e25ed7ee01'); // Hardcoded user ID for demo purposes
	setSessionTokenCookie(token, session.expiresAt);
	return redirect(302, '/home');
};
