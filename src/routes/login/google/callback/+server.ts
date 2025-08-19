import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { google } from '@/server/oauth';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth';
import { INITIAL_ADMIN_EMAILS } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state') ?? null;
	const codeVerifier = cookies.get('google_code_verifier') ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return error(400, 'Missing code, state, or code verifier, please try again');
	}
	if (state !== storedState) {
		return error(400, 'Invalid state, please try again');
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return error(400, 'Invalid code or client credentials, please try again');
	}
	const claims = decodeIdToken(tokens.idToken()) as any;

	const googleId = claims.sub as string;
	const name = claims.name as string;
	const email = claims.email as string;
	const pfp = claims.picture as string;

	let userId: string;
	let isAdmin: boolean;

	// Check if the user already exists in the database
	const existingUser = await db.query.users.findFirst({
		columns: {
			id: true,
			isAdmin: true
		},
		where: eq(table.users.googleId, googleId)
	});

	if (existingUser) {
		// User already exists, update their info
		await db
			.update(table.users)
			.set({
				email,
				lastLogin: new Date()
			})
			.where(eq(table.users.googleId, googleId));

		userId = existingUser.id;
		isAdmin = existingUser.isAdmin;
	} else {
		// Create a new user
		const user = await db
			.insert(table.users)
			.values({
				googleId,
				name,
				email,
				pfp
			})
			.returning({ id: table.users.id });

		userId = user[0].id;
		isAdmin = INITIAL_ADMIN_EMAILS.split(',')
			.map((email) => email.trim())
			.includes(email);
	}

	// Create a session for the user
	const token = generateSessionToken();
	const session = await createSession(token, userId, isAdmin ? userId : null);
	setSessionTokenCookie(token, session.expiresAt);
	return redirect(302, '/home');
};
