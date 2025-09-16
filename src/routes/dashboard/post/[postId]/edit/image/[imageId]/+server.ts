import { validateId } from '@/validators/idValidator';
import type { RequestHandler } from './$types';
import { db, table } from '@/server/db';
import { and, eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_IMAGES } from '$env/static/private';
import { s3client } from '@/server/s3';
import { z } from 'zod/v4';
import { userHasAccessToPost } from '@/server/db/common';

const imagePatchRequestValidator = z.strictObject({
	order: z.number().min(0).optional()
});

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);
	const imageId = validateId(params.imageId);

	const res = imagePatchRequestValidator.safeParse(await request.json());
	if (!res.success) return error(400, res.error.issues[0].message);

	// Verify post exists and the user is the owner
	const post = await db.query.posts.findFirst({
		columns: {
			id: true
		},
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
	});
	if (post === undefined) return error(404, 'Post not found');

	const [image] = await db
		.update(table.postImages)
		.set(res.data)
		.where(eq(table.postImages.id, imageId))
		.returning();

	return json({ image });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);
	const imageId = validateId(params.imageId);

	const post = await db.query.posts.findFirst({
		columns: {
			id: true
		},
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
	});
	if (post === undefined) return error(404, 'Post not found');

	const postImage = await db.query.postImages.findFirst({
		columns: {
			id: true
		},
		where: and(eq(table.postImages.postId, postId), eq(table.postImages.id, imageId))
	});
	if (postImage === undefined) return error(404, 'Image not found');

	const delRequest = new DeleteObjectCommand({
		Bucket: S3_BUCKET_IMAGES,
		Key: `post/${postId}/${imageId}.webp`
	});

	try {
		const res = await s3client.send(delRequest);
	} catch (err) {
		console.error('Error deleting image from S3:', err);
		// Still continue and delete from db
	}

	await db.delete(table.postImages).where(eq(table.postImages.id, imageId));

	return json({});
};
