import { descriptionEditFormSchema } from '@/validators/descriptionEditFormValidator.js';
import type { Actions, PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { db, table } from '@/server/db/index.js';
import { and, eq } from 'drizzle-orm';
import { validateId } from '@/validators/idValidator.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const postId = validateId(params.postId);

	const post = await db.query.posts.findFirst({
		columns: {
			title: true,
			desc: true,
			careerStage: true,
			prereq: true
		},
		where: and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id)),
		with: {
			tags: {
				columns: {
					tag: true
				}
			}
		}
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		form: await superValidate(
			{
				title: post.title,
				desc: post.desc,
				careerStage: post.careerStage,
				prereq: post.prereq,
				tags: post.tags.map((tag) => tag.tag)
			},
			zod4(descriptionEditFormSchema)
		)
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const postId = validateId(params.postId);

		const form = await superValidate(request, zod4(descriptionEditFormSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.posts)
			.set({
				title: form.data.title,
				desc: form.data.desc || '',
				careerStage: form.data.careerStage || '',
				prereq: form.data.prereq || ''
			})
			.where(and(eq(table.posts.id, postId), eq(table.posts.ownerId, locals.user!.id)));

		await db.delete(table.postTags).where(eq(table.postTags.postId, postId));

		if (form.data.tags.length > 0) {
			await db.insert(table.postTags).values(
				form.data.tags.map((tag) => ({
					postId,
					tag
				}))
			);
		}

		return message(form, { type: 'success', text: 'Post updated successfully!' });
	}
};
