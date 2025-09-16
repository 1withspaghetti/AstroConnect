import { descriptionEditFormSchema } from '@/validators/descriptionEditFormValidator.js';
import type { Actions, PageServerLoad } from './$types.js';
import { error, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { db, table } from '@/server/db/index.js';
import { and, eq } from 'drizzle-orm';
import { validateId } from '@/validators/idValidator.js';
import { userHasAccessToPost } from '@/server/db/common.js';
import { applicationEditFormSchema } from '@/validators/applicationEditFormValidator.js';
import { acceptingResponsesFormSchema } from '@/validators/acceptingResponsesFormValidator.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);

	const post = await db.query.posts.findFirst({
		columns: {
			ownerId: true,
			title: true,
			desc: true,
			positions: true,
			timeCommitment: true,
			careerStage: true,
			prereq: true,
			durationStart: true,
			durationEnd: true,
			isOpen: true,
			closesAt: true,
			maxSlots: true,
			questions: true
		},
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id)),
		with: {
			tags: {
				columns: {
					tag: true
				}
			},
			images: {
				columns: {
					id: true,
					url: true,
					order: true
				}
			}
		}
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	const postTags = await db
		.selectDistinct({ tag: table.postTags.tag })
		.from(table.postTags)
		.orderBy(table.postTags.tag)
		.then((tags) => tags.map((tag) => tag.tag));

	const proxyAs = await db.query.userProxies
		.findMany({
			where: eq(table.userProxies.proxyId, user.id),
			columns: {
				userId: true
			},
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						email: true,
						pfp: true
					}
				}
			}
		})
		.then((proxies) => proxies.map((p) => p.user));

	return {
		postId,
		images: post.images,
		postTags,
		proxyAs,
		descriptionForm: await superValidate(
			{
				ownerId: post.ownerId,
				title: post.title,
				desc: post.desc,
				positions: post.positions,
				timeCommitment: post.timeCommitment,
				careerStage: post.careerStage,
				prereq: post.prereq,
				durationStart: post.durationStart || undefined,
				durationEnd: post.durationEnd || undefined,
				tags: post.tags.map((tag) => tag.tag)
			},
			zod4(descriptionEditFormSchema)
		),
		applicationForm: await superValidate(
			{
				isOpen: post.isOpen,
				closesAt: post.closesAt || undefined,
				maxSlots: post.maxSlots || undefined,
				questions: post.questions
			},
			zod4(applicationEditFormSchema)
		)
	};
};

export const actions: Actions = {
	description: async ({ request, params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);
		const formData = await request.formData();

		const form = await superValidate(formData, zod4(descriptionEditFormSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		if (form.data.ownerId !== user.id && !user.proxyAs.includes(form.data.ownerId)) {
			return message(form, { type: 'error', text: 'You cannot post as this person' });
		}

		await db
			.update(table.posts)
			.set({
				ownerId: form.data.ownerId,
				title: form.data.title,
				desc: form.data.desc || '',
				positions: form.data.positions || '',
				timeCommitment: form.data.timeCommitment || '',
				careerStage: form.data.careerStage || '',
				prereq: form.data.prereq || '',
				durationStart: form.data.durationStart || null,
				durationEnd: form.data.durationEnd || null
			})
			.where(and(eq(table.posts.id, postId), userHasAccessToPost(user.id)));

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
	},
	application: async ({ request, params, locals }) => {
		const { user } = await locals.auth();
		const postId = validateId(params.postId);
		const formData = await request.formData();

		const form = await superValidate(formData, zod4(applicationEditFormSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.posts)
			.set({
				isOpen: form.data.isOpen,
				closesAt: form.data.closesAt || null,
				maxSlots: form.data.maxSlots || null,
				questions: form.data.questions
			})
			.where(and(eq(table.posts.id, postId), userHasAccessToPost(user.id)));

		return message(form, { type: 'success', text: 'Post updated successfully!' });
	}
};
