import { findManyPostPreviews } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { table } from '@/server/db';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	const posts = findManyPostPreviews({
		where: and(eq(table.posts.ownerId, user.id), eq(table.posts.isDraft, false))
	});

	return {
		posts
	};
}) satisfies PageServerLoad;
