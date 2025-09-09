import { z } from 'zod/v4';
import type { RequestHandler } from './$types';
import { validateId } from '@/validators/idValidator';
import { error, json } from '@sveltejs/kit';
import sharp from 'sharp';
import { s3client } from '@/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_IMAGES, S3_BUCKET_IMAGES_PUBLIC_URL } from '$env/static/private';
import { db, table } from '@/server/db';
import { and, eq, sql } from 'drizzle-orm';
import { userHasAccessToPost } from '@/server/db/common';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/avif', 'image/webp', 'image/tiff'];

const imageUploadValidator = z.object({
	image: z
		.instanceof(File)
		.refine((file) => file.size < MAX_IMAGE_SIZE, 'File size must be less than 5MB')
		.refine((file) => ALLOWED_FILE_TYPES.includes(file.type), 'Invalid file type')
});

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const { user } = await locals.auth();
	const formData = await request.formData();
	const res = imageUploadValidator.safeParse(Object.fromEntries(formData.entries()));
	if (!res.success) return error(400, res.error.issues[0].message);

	const postId = validateId(params.postId);
	const post = await db.query.posts.findFirst({
		columns: {
			id: true
		},
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
	});
	if (post === undefined) return error(404, 'Post not found');

	const image = await sharp(await res.data.image.bytes())
		.resize(256 * 4 * 2, 256 * 4, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 80 })
		.toBuffer();

	const imageId = crypto.randomUUID();

	const putReq = new PutObjectCommand({
		Bucket: S3_BUCKET_IMAGES,
		Key: `post/${postId}/${imageId}.webp`,
		Body: image,
		ContentType: 'image/webp'
	});

	try {
		await s3client.send(putReq);
	} catch (err) {
		console.error('Error uploading image to S3:', err);
		return error(500, 'Failed to upload image to CDN');
	}

	await db.insert(table.postImages).values({
		id: imageId,
		postId,
		url: new URL(`post/${postId}/${imageId}.webp`, S3_BUCKET_IMAGES_PUBLIC_URL).toString(),
		order: sql`(SELECT COALESCE(MAX(${table.postImages.order}), -1) + 1 FROM ${table.postImages} WHERE ${table.postImages.postId} = ${postId})`
	});

	return json({});
};
