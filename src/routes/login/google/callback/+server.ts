import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { google } from '@/server/oauth';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/user';
import { eq } from 'drizzle-orm';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth';
import fs from 'fs';

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

	let userId: number;

	// Check if the user already exists in the database
	const existingUser = await db
		.select({
			id: users.id
		})
		.from(users)
		.where(eq(users.googleId, googleId));

	if (existingUser.length > 0) {
		// User already exists, update their info
		await db
			.update(users)
			.set({
				email,
				lastLogin: new Date()
			})
			.where(eq(users.googleId, googleId));

		userId = existingUser[0].id;
	} else {
		// Create a new user
		const user = await db
			.insert(users)
			.values({
				googleId,
				name,
				email,
				pfp
			})
			.returning({ id: users.id });

		userId = user[0].id;
	}

	// Create a session for the user
	const token = generateSessionToken();
	const session = await createSession(token, userId);
	setSessionTokenCookie(token, session.expiresAt);
	return redirect(302, '/home');
};
