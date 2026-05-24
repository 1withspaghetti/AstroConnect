import { validateId } from '@/validators/idValidator';
import type { LayoutServerLoad } from './$types';
import { table } from '@/server/db';
import { findFirstPost, userHasAccessToPost } from '@/server/db/common';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = (async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);

	const post = await findFirstPost({
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		post
	};
}) satisfies LayoutServerLoad;
