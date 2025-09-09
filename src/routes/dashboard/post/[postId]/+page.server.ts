import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db, table } from '@/server/db';
import { and, eq } from 'drizzle-orm';
import { validateId } from '@/validators/idValidator';
import { s3client } from '@/server/s3';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_IMAGES } from '$env/static/private';
import { userHasAccessToPost } from '@/server/db/common';

export const load = (async ({ params }) => {
	return redirect(301, `/dashboard/post/${params.postId}/edit/description`);
}) satisfies PageServerLoad;

export const actions = {
	publish: async ({ params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);

		const res = await db
			.update(table.posts)
			.set({ isDraft: false })
			.where(and(eq(table.posts.id, postId), userHasAccessToPost(user.id)));

		if (res.rowCount < 1) {
			throw error(404, `Post not found`);
		}

		return redirect(303, `/dashboard/post/${postId}/responses#published`);
	},

	unpublish: async ({ params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);

		const res = await db
			.update(table.posts)
			.set({ isDraft: true })
			.where(and(eq(table.posts.id, postId), userHasAccessToPost(user.id)));

		if (res.rowCount < 1) {
			throw error(404, `Post not found`);
		}

		return redirect(303, `/dashboard/post/${postId}`);
	},

	delete: async ({ params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);

		const post = await db.query.posts.findFirst({
			columns: {
				id: true
			},
			with: {
				images: {
					columns: {
						id: true
					}
				}
			},
			where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
		});

		if (!post) throw error(404, 'Post Not Found');

		const imageKeys = post.images.map((image) => ({ Key: `post/${post.id}/${image.id}.webp` }));
		if (imageKeys.length > 0) {
			const postImageDelRequest = new DeleteObjectsCommand({
				Bucket: S3_BUCKET_IMAGES,
				Delete: {
					Objects: imageKeys
				}
			});

			await s3client.send(postImageDelRequest);
		}

		// Finally delete from db, should cascade to posts and other schemas that depend on it
		await db
			.delete(table.posts)
			.where(and(eq(table.posts.id, postId), userHasAccessToPost(user.id)));

		return redirect(303, `/dashboard/drafts`);
	}
};
