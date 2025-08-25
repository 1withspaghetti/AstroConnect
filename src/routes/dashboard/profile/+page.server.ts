import { profileEditSchema } from '@/validators/profileEditValidator';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { User } from '@/types/user';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();
	const fullUser = await db.query.users.findFirst({
		columns: {
			id: true,
			name: true,
			pfp: true,
			bio: true,
			careerStage: true,
			major: true,
			email: true,
			isPublic: true,
			isAdmin: true,
			firstLogin: true,
			lastLogin: true
		},
		with: {
			tags: {
				columns: {
					tag: true
				},
				orderBy: table.userTags.tag
			}
		},
		where: eq(table.users.id, user.id)
	});

	if (!fullUser) error(404, 'User not found');

	const userTagList = await db
		.selectDistinct({ tag: table.userTags.tag })
		.from(table.userTags)
		.orderBy(table.userTags.tag)
		.then((tags) => tags.map((tag) => tag.tag));

	return {
		user: {
			...fullUser,
			tags: fullUser.tags.map((t) => t.tag)
		} as User,
		userTagList,
		form: await superValidate(
			{
				name: fullUser.name,
				bio: fullUser.bio || undefined,
				careerStage: fullUser.careerStage || undefined,
				major: fullUser.major || undefined,
				tags: fullUser.tags.map((t) => t.tag),
				isPublic: fullUser.isPublic
			},
			zod4(profileEditSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(profileEditSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.users)
			.set({
				name: form.data.name,
				bio: form.data.bio || '',
				careerStage: form.data.careerStage || '',
				major: form.data.major || '',
				isPublic: form.data.isPublic
			})
			.where(eq(table.users.id, user.id));

		await db.delete(table.userTags).where(eq(table.userTags.userId, user.id));

		if (form.data.tags.length > 0) {
			await db.insert(table.userTags).values(
				form.data.tags.map((tag) => ({
					userId: user.id,
					tag
				}))
			);
		}

		return message(form, { type: 'success', text: 'Profile updated successfully!' });
	}
};
