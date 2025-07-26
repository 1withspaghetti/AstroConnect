import type { PostMinimal } from '@/types/post';
import posts from '@/fake_data';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	return {
		postList: posts as PostMinimal[]
	};
}) satisfies LayoutServerLoad;
