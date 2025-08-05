import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db, table } from '@/server/db';
import { and, eq } from 'drizzle-orm';

export const load = (async ({ params }) => {
	return redirect(301, `/dashboard/post/${params.postId}/edit/description`);
}) satisfies PageServerLoad;

export const actions = {
	publish: async ({ params, locals }) => {
		const postId = parseInt(params.postId);
		if (isNaN(postId)) {
			throw error(400, `Invalid post ID: ${params.postId}`);
		}

		const res = await db
			.update(table.posts)
			.set({ isDraft: false })
			.where(and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id)));

		if (res.rowCount < 1) {
			throw error(404, `Post not found`);
		}

		return redirect(303, `/dashboard/post/${postId}/results#published`);
	},

	unpublish: async ({ params, locals }) => {
		const postId = parseInt(params.postId);
		if (isNaN(postId)) {
			throw error(400, `Invalid post ID: ${params.postId}`);
		}

		const res = await db
			.update(table.posts)
			.set({ isDraft: true })
			.where(and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id)));

		if (res.rowCount < 1) {
			throw error(404, `Post not found`);
		}

		return redirect(303, `/dashboard/post/${postId}`);
	},

	delete: async ({ params, locals }) => {
		const postId = parseInt(params.postId);
		if (isNaN(postId)) {
			throw error(400, `Invalid post ID: ${params.postId}`);
		}

		const res = await db
			.delete(table.posts)
			.where(and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id)));

		if (res.rowCount < 1) {
			throw error(404, `Post not found`);
		}

		return redirect(303, `/dashboard/drafts`);
	}
};
