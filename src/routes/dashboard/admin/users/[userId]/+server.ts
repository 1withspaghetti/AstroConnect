import { validateId } from '@/validators/idValidator';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { db, table } from '@/server/db';
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_IMAGES } from '$env/static/private';
import { s3client } from '@/server/s3';
import { eq } from 'drizzle-orm';
import z from 'zod/v4';

const userPatchRequestValidator = z.strictObject({
	isAdmin: z.boolean().optional()
});

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	const { session } = await locals.auth();
	if (!session.adminId) throw error(403, 'Unauthorized');
	const userId = validateId(params.userId);

	const res = userPatchRequestValidator.safeParse(await request.json());
	if (!res.success) {
		throw error(400, 'Invalid request body');
	}

	const updateResult = await db
		.update(table.users)
		.set({
			isAdmin: res.data.isAdmin
		})
		.where(eq(table.users.id, userId));

	if (updateResult.rowCount <= 0) {
		throw error(404, 'User Not Found');
	}

	return json({});
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { session } = await locals.auth();
	if (!session.adminId) throw error(403, 'Unauthorized');
	const userId = validateId(params.userId);

	const posts = await db.query.posts.findMany({
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
		where: eq(table.posts.ownerId, userId)
	});

	const imageKeys = posts.flatMap((post) =>
		post.images.map((image) => ({ Key: `post/${post.id}/${image.id}.webp` }))
	);
	if (imageKeys.length > 0) {
		const postImageDelRequest = new DeleteObjectsCommand({
			Bucket: S3_BUCKET_IMAGES,
			Delete: {
				Objects: imageKeys
			}
		});

		await s3client.send(postImageDelRequest);
	}

	const pfpImageDelRequest = new DeleteObjectCommand({
		Bucket: S3_BUCKET_IMAGES,
		Key: `profile/${userId}.webp`
	});

	await s3client.send(pfpImageDelRequest);

	// Finally delete from db, should cascade to posts and other schemas that depend on it
	await db.delete(table.users).where(eq(table.users.id, userId));

	return json({});
};
