import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.session) return redirect(302, '/home');
	return {};
}) satisfies PageServerLoad;
