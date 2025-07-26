import type { PostPreview } from '@/types/post';
import posts from '@/fake_data';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		posts: posts.filter((post) => !post.draft) as PostPreview[]
	};
}) satisfies PageServerLoad;
