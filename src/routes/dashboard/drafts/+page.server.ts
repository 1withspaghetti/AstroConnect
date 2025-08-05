import type { PageServerLoad, Actions } from './$types';
import { db, table } from '@/server/db';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { findManyPostPreviews } from '@/server/db/common';

export const load = (async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const posts = findManyPostPreviews({
		where: and(eq(table.posts.ownerId, locals.user.id), eq(table.posts.isDraft, true))
	});

	return {
		posts
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	new: async ({ locals }) => {
		if (!locals.user) error(401, 'Unauthorized');

		const [newPost] = await db
			.insert(table.posts)
			.values({
				ownerId: locals.user.id,
				title: 'New Draft'
			})
			.returning({ id: table.posts.id });

		if (!newPost) error(500, 'Failed to create new draft');

		return redirect(303, `/dashboard/post/${newPost.id}`);
	}
};
