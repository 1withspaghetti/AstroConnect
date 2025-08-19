import { z } from 'zod/v4';
import type { RequestHandler } from './$types';
import { validateId } from '@/validators/idValidator';
import { error, json } from '@sveltejs/kit';
import sharp from 'sharp';
import { s3client } from '@/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_IMAGES, S3_BUCKET_IMAGES_PUBLIC_URL } from '$env/static/private';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/avif', 'image/webp', 'image/tiff'];

const imageUploadValidator = z.object({
	image: z
		.instanceof(File)
		.refine((file) => file.size < MAX_IMAGE_SIZE, 'File size must be less than 5MB')
		.refine((file) => ALLOWED_FILE_TYPES.includes(file.type), 'Invalid file type')
});

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.auth();
	const formData = await request.formData();
	const res = imageUploadValidator.safeParse(Object.fromEntries(formData.entries()));
	if (!res.success) return error(400, res.error.issues[0].message);

	const image = await sharp(await res.data.image.bytes())
		.resize(256, 256, { fit: 'cover' })
		.webp({ quality: 80 })
		.toBuffer();

	const putReq = new PutObjectCommand({
		Bucket: S3_BUCKET_IMAGES,
		Key: `profile/${user.id}.webp`,
		Body: image,
		ContentType: 'image/webp'
	});

	try {
		await s3client.send(putReq);
	} catch (err) {
		console.error('Error uploading image to S3:', err);
		return error(500, 'Failed to upload image to CDN');
	}

	const url = new URL(
		`profile/${user.id}.webp?t=${Date.now()}`,
		S3_BUCKET_IMAGES_PUBLIC_URL
	).toString();

	await db
		.update(table.users)
		.set({
			pfp: url
		})
		.where(eq(table.users.id, user.id));

	return json({
		pfp: url
	});
};
