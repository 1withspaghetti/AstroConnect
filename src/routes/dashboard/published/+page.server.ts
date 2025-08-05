import { findManyPostPreviews } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { table } from '@/server/db';

export const load = (async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const posts = findManyPostPreviews({
		where: and(eq(table.posts.ownerId, locals.user.id), eq(table.posts.isDraft, false))
	});

	return {
		posts
	};
}) satisfies PageServerLoad;
