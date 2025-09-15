import type { Actions, PageServerLoad } from './$types.js';
import { error, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { applicationEditFormSchema } from '@/validators/applicationEditFormValidator.js';
import { db, table } from '@/server/db/index.js';
import { and, eq } from 'drizzle-orm';
import { validateId } from '@/validators/idValidator.js';
import { userHasAccessToPost } from '@/server/db/common.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);

	const post = await db.query.posts.findFirst({
		columns: {
			questions: true
		},
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		form: await superValidate(
			{
				questions: post.questions
			},
			zod4(applicationEditFormSchema)
		)
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);
		const formData = await request.formData();

		const form = await superValidate(formData, zod4(applicationEditFormSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.posts)
			.set({
				questions: form.data.questions
			})
			.where(and(eq(table.posts.id, postId), userHasAccessToPost(user.id)));

		if (formData.has('continue')) return redirect(303, `/dashboard/post/${postId}/preview`);

		return message(form, { type: 'success', text: 'Post updated successfully!' });
	}
};
