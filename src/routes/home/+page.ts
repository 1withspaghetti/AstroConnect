import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	return redirect(302, '/home/search');
}) satisfies PageLoad;
