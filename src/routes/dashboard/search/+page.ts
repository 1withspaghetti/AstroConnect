import type { PageLoad } from './$types';
import posts from './fake_data';

export const load = (async () => {
	return {
		posts
	};
}) satisfies PageLoad;
