import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { findFirstPost } from '@/server/db/common';
import { and, eq } from 'drizzle-orm';
import { table } from '@/server/db/index.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const postId = parseInt(params.postId);

	if (isNaN(postId)) {
		throw error(400, `Invalid post ID: ${params.postId}`);
	}

	const post = await findFirstPost({
		where: and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		post
	};
};
