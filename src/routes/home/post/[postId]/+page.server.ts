import type { Actions, PageServerLoad } from './$types.js';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { getApplicationFormSchema } from '@/validators/applicationFormValidator.js';
import { findFirstPost } from '@/server/db/common.js';
import { db, table } from '@/server/db/index.js';
import { and, eq } from 'drizzle-orm';
import { sendApplicationEmail } from '@/server/email/index.js';
import { stringifyApplicationFormAnswer } from '@/types/applicationForm.js';
import { validateId } from '@/validators/idValidator.js';

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
