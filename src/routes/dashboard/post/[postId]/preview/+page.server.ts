import type { PageServerLoad } from './$types.js';
import posts from '@/fake_data';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const postId = parseInt(params.postId);

	const post = posts.find((p) => p.id === postId);

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		post
	};
};
