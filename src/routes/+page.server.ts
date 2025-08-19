import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	let { session } = await locals.auth(false);
	if (session) return redirect(302, '/home');
	return {};
}) satisfies PageServerLoad;
