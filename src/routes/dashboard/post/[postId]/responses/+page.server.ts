import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { validateId } from '@/validators/idValidator';
import { and, eq } from 'drizzle-orm';
import { db, table } from '@/server/db';
import { acceptingResponsesFormSchema } from '@/validators/acceptingResponsesFormValidator';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);

	const post = await db.query.posts.findFirst({
		columns: {
			isOpen: true,
			closesAt: true
		},
		where: and(eq(table.posts.id, postId), eq(table.posts.ownerId, user.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		postId,
		form: await superValidate(
			{
				isOpen: post.isOpen,
				closesAt: post.closesAt || undefined
			},
			zod4(acceptingResponsesFormSchema)
		)
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);

		const form = await superValidate(request, zod4(acceptingResponsesFormSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		const res = await db
			.update(table.posts)
			.set({
				isOpen: form.data.isOpen,
				closesAt: form.data.closesAt || null
			})
			.where(and(eq(table.posts.id, postId), eq(table.posts.ownerId, user.id)));

		if (res.rowCount === 0) return message(form, { type: 'error', text: 'Post not found' });

		return message(form, { type: 'success', text: 'Post updated successfully!' });
	}
};
