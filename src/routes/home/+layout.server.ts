import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.user) return redirect(302, '/login');

	return {};
}) satisfies LayoutServerLoad;
