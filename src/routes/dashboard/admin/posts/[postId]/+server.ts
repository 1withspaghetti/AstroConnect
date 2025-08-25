import { validateId } from '@/validators/idValidator';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { db, table } from '@/server/db';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_IMAGES } from '$env/static/private';
import { s3client } from '@/server/s3';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { session } = await locals.auth();
	if (!session.adminId) throw error(403, 'Unauthorized');
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
		where: eq(table.posts.id, postId)
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
	await db.delete(table.posts).where(eq(table.posts.id, postId));

	return json({});
};
