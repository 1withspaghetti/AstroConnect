import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { findFirstPost } from '@/server/db/common';
import { and, eq } from 'drizzle-orm';
import { table } from '@/server/db/index.js';
import { validateId } from '@/validators/idValidator.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);

	const post = await findFirstPost({
		where: and(eq(table.posts.id, postId), eq(table.posts.ownerId, user.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		post
	};
};
