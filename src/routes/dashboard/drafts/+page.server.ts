import type { PageServerLoad, Actions } from './$types';
import { db, table } from '@/server/db';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { findManyPostPreviews, userHasAccessToPost } from '@/server/db/common';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	const posts = findManyPostPreviews({
		where: and(eq(table.posts.isDraft, true), userHasAccessToPost(user.id))
	});

	return {
		posts
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	new: async ({ locals }) => {
		const { user } = await locals.auth();

		const [newPost] = await db
			.insert(table.posts)
			.values({
				ownerId: user.id,
				title: 'New Draft'
			})
			.returning({ id: table.posts.id });

		if (!newPost) error(500, 'Failed to create new draft');

		return redirect(303, `/dashboard/post/${newPost.id}`);
	}
};
