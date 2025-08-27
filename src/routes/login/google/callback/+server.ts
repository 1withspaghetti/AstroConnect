import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { google } from '@/server/oauth';
import { db, table } from '@/server/db';
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth';
import { EMAIL_SUFFIX, INITIAL_ADMIN_EMAILS } from '$env/static/private';

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
			isAdmin: true,
			googleId: true,
			email: true
		},
		where: or(
			eq(table.users.googleId, googleId),
			and(eq(table.users.email, email), isNull(table.users.googleId))
		),
		orderBy: sql`${table.users.googleId} NULLS LAST`
	});

	if (existingUser) {
		if (existingUser.googleId) {
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
			// Email exists but has not been linked to a Google account
			await db
				.update(table.users)
				.set({
					googleId,
					name,
					email,
					pfp,
					lastLogin: new Date()
				})
				.where(eq(table.users.id, existingUser.id));

			userId = existingUser.id;
			isAdmin = existingUser.isAdmin;
		}
	} else {
		isAdmin = INITIAL_ADMIN_EMAILS.split(',')
			.map((email) => email.trim())
			.includes(email);

		if (!email.endsWith(EMAIL_SUFFIX ?? '') && !isAdmin) {
			return error(
				403,
				'You must use your University of Washington email address to create an account'
			);
		}

		// Create a new user
		const user = await db
			.insert(table.users)
			.values({
				googleId,
				name,
				email,
				pfp,
				isAdmin
			})
			.returning({ id: table.users.id });

		userId = user[0].id;
	}

	// Create a session for the user
	const token = generateSessionToken();
	const session = await createSession(token, userId, isAdmin ? userId : null);
	setSessionTokenCookie(token, session.expiresAt);
	return redirect(302, '/home');
};
