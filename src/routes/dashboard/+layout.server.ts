import type { PostPreview } from '@/types/post';
import posts from '@/fake_data';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	return {
		posts: posts as PostPreview[]
	};
}) satisfies LayoutServerLoad;
