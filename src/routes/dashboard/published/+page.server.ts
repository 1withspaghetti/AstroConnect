import { findManyPostPreviews, userHasAccessToPost } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { table } from '@/server/db';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	const posts = findManyPostPreviews({
		where: and(eq(table.posts.isDraft, false), userHasAccessToPost(user.id))
	});

	return {
		posts
	};
}) satisfies PageServerLoad;
