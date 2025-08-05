import type { Actions, PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { applicationEditFormSchema } from '@/validators/applicationEditFormValidator.js';
import { db, table } from '@/server/db/index.js';
import { and, eq } from 'drizzle-orm';
import type { ApplicationFormQuestion } from '@/types/applicationForm.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const postId = parseInt(params.postId);

	if (isNaN(postId)) {
		throw error(400, `Invalid post ID: ${params.postId}`);
	}

	const post = await db.query.posts.findFirst({
		columns: {
			questions: true
		},
		where: and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		form: await superValidate(
			{
				questions: post.questions as ApplicationFormQuestion[]
			},
			zod4(applicationEditFormSchema)
		)
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const postId = parseInt(params.postId);

		if (isNaN(postId)) {
			throw error(400, `Invalid post ID: ${params.postId}`);
		}

		const form = await superValidate(request, zod4(applicationEditFormSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.posts)
			.set({
				questions: form.data.questions
			})
			.where(and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id)));

		return message(form, { type: 'success', text: 'Post updated successfully!' });
	}
};
