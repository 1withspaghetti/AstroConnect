import z from 'zod/v4';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';
import { s3client } from '@/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_TEMP_UPLOADS } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { db, table } from '@/server/db';

const uploadRequestValidator = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters long')
		.max(250, 'Name must be at most 250 characters long'),
	size: z
		.number()
		.min(0, 'Size must be a positive number')
		.max(1024 * 1024 * 10, 'Size must be at most 10MB')
});

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

export const POST: RequestHandler = async ({ locals, request }) => {
	const result = uploadRequestValidator.safeParse(await request.json());
	if (!result.success) error(400, { message: result.error.issues[0].message });
	const { name, size } = result.data;

	const fileKey = nanoid() + '-' + encodeURIComponent(name.normalize('NFC'));

	// Generate signed URLs for upload and download
	const uploadUrl = await getSignedUrl(
		s3client,
		new PutObjectCommand({
			Bucket: S3_BUCKET_TEMP_UPLOADS,
			Key: fileKey,
			ContentLength: size
		}),
		{
			expiresIn: 15 * 60 // 15 minutes
		}
	);

	const [dbFile] = await db
		.insert(table.applicationUploads)
		.values({
			fileKey,
			userId: locals.user!.id
		})
		.returning({ id: table.applicationUploads.id });

	return json({
		uploadUrl,
		id: dbFile.id
	});
};
