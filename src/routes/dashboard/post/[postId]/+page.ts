import { error } from '@sveltejs/kit';
import posts from '../../search/fake_data';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const postId = parseInt(params.postId);

	const post = posts.find((p) => p.id === postId);

	if (!post) {
		throw error(404, `Post not found`);
	}

	return { post };
}) satisfies PageLoad;
