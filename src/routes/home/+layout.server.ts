import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { session, user } = await locals.auth();

	return { user, isAdmin: session.adminId !== null };
}) satisfies LayoutServerLoad;
