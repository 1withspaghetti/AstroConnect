import type { RequestHandler } from './$types';
import { db, table } from '@/server/db';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth';
import { invalidateSession } from '@/server/auth';
import { json } from '@sveltejs/kit';

const emailValidator = z.email().max(256);

export const GET: RequestHandler = async ({ params, locals }) => {
	const { session, user } = await locals.auth();
	if (!session.adminId) return error(403, 'Unauthorized');

	const parseRes = emailValidator.safeParse(params.email);
	if (!parseRes.success) return error(400, 'Invalid email');
	const email = parseRes.data;

	let toImpersonateUserId: string;
	const existingUser = await db.query.users.findFirst({
		columns: {
			id: true,
			isAdmin: true
		},
		where: eq(table.users.email, email)
	});

	if (existingUser) {
		toImpersonateUserId = existingUser.id;
	} else {
		console.log('Creating ghost user with email: ' + email);
		const [user] = await db
			.insert(table.users)
			.values({
				name: email.split('@')[0],
				email
			})
			.returning({ id: table.users.id });
		toImpersonateUserId = user.id;
	}

	const token = generateSessionToken();
	const newSession = await createSession(token, toImpersonateUserId, user.id);
	setSessionTokenCookie(token, newSession.expiresAt);
	await invalidateSession(session.id);

	return json({});
};
