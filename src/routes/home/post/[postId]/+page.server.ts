import type { Actions, PageServerLoad } from './$types.js';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { getApplicationFormSchema } from '@/validators/applicationFormValidator.js';
import { findFirstPost } from '@/server/db/common.js';
import { db, table } from '@/server/db/index.js';
import { and, eq } from 'drizzle-orm';
import { sendApplicationEmail } from '@/server/email/index.js';
import {
	ApplicationFormQuestionType,
	stringifyApplicationFormAnswer
} from '@/types/applicationForm.js';
import { validateId } from '@/validators/idValidator.js';
import { s3client } from '@/server/s3.js';
import {
	CopyObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand
} from '@aws-sdk/client-s3';
import {
	S3_BUCKET_UPLOADS,
	S3_BUCKET_TEMP_UPLOADS,
	S3_BUCKET_UPLOADS_PUBLIC_URL
} from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const load: PageServerLoad = async ({ params }) => {
	const postId = validateId(params.postId);

	const post = await findFirstPost({
		where: and(eq(table.posts.id, postId), eq(table.posts.isDraft, false))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		post,
		form: await superValidate(zod4(getApplicationFormSchema(post.questions)))
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const postId = validateId(params.postId);

		const post = await db.query.posts.findFirst({
			columns: {
				id: true,
				ownerId: true,
				questions: true
			},
			where: and(eq(table.posts.id, postId), eq(table.posts.isDraft, false))
		});

		if (!post) {
			throw error(404, `Post not found`);
		}

		const form = await superValidate(request, zod4(getApplicationFormSchema(post.questions)));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		// Verify files
		for (const question of post.questions.filter(
			(q) => q.type === ApplicationFormQuestionType.FILE
		)) {
			const fileId = form.data[question.id];
			if (fileId) {
				// Verify file exists in database
				const file = await db.query.applicationUploads.findFirst({
					columns: {
						id: true,
						fileKey: true
					},
					where: and(
						eq(table.applicationUploads.id, fileId),
						eq(table.applicationUploads.userId, locals.user!.id)
					)
				});
				if (!file) {
					return message(form, {
						type: 'error',
						text: `File not found for question ${question.label}`
					});
				}
				// Verify it has been uploaded to S3
				const command = new HeadObjectCommand({
					Bucket: S3_BUCKET_TEMP_UPLOADS,
					Key: file.fileKey
				});
				try {
					await s3client.send(command);
				} catch (error: any) {
					if (error.name === 'NotFound') {
						return message(form, {
							type: 'error',
							text: `File not found in S3 for question ${question.label}`
						});
					} else {
						console.error(`Error checking file ${file.fileKey} in S3:`, error);
						return message(form, {
							type: 'error',
							text: `Error verifying file for question ${question.label}`
						});
					}
				}
				// Move it to the permanent location
				const copyCommand = new CopyObjectCommand({
					CopySource: encodeURIComponent(`${S3_BUCKET_TEMP_UPLOADS}/${file.fileKey}`),
					Bucket: S3_BUCKET_UPLOADS,
					Key: `${postId}/${file.fileKey}`
				});
				await s3client.send(copyCommand);
				const deleteCommand = new DeleteObjectCommand({
					Bucket: S3_BUCKET_TEMP_UPLOADS,
					Key: file.fileKey
				});
				await s3client.send(deleteCommand);

				// Update status in db

				await db.delete(table.applicationUploads).where(eq(table.applicationUploads.id, file.id));

				// Get new url

				const fileUrl = new URL(
					`${postId}/${encodeURIComponent(file.fileKey)}`,
					S3_BUCKET_UPLOADS_PUBLIC_URL
				).toString();

				form.data[question.id] = fileUrl;
			}
		}

		let answers = post.questions.map((question) => {
			const answer = form.data[question.id];
			return {
				type: question.type,
				label: question.label,
				answer: answer
			};
		});

		await db.insert(table.applications).values({
			postId: post.id,
			userId: locals.user!.id, // Replace with actual user ID from session
			answers
		});

		// Now handle email notifications, etc. if needed

		const owner = await db.query.users.findFirst({
			columns: {
				id: true,
				email: true,
				name: true,
				sendSubmissionEmails: true,
				alternateEmail: true
			},
			where: eq(table.users.id, post.ownerId)
		});

		if (!owner) {
			throw error(404, `Post owner not found`);
		}

		if (owner.sendSubmissionEmails) {
			let email = owner.alternateEmail || owner.email;

			const sender = await db.query.users.findFirst({
				columns: {
					name: true,
					email: true,
					bio: true,
					pfp: true
				},
				where: eq(table.users.id, locals.user!.id)
			});

			if (!sender) {
				throw error(404, `Sender not found`);
			}

			console.log(`Sending application email to ${email} for post ${postId}`);

			await sendApplicationEmail(
				{
					email,
					name: owner.name
				},
				{
					name: owner.name,
					applicantName: sender.name,
					applicantEmail: sender.email,
					applicantBio: sender.bio,
					applicantPfp: sender.pfp,
					applicationLink: `/dashboard/post/${postId}/responses`,
					questions: answers.map((answer) => ({
						label: answer.label,
						response: stringifyApplicationFormAnswer(answer)
					}))
				}
			);
		}

		return message(form, {
			type: 'success',
			text: 'Application submitted successfully! Good luck!'
		});
	}
};
