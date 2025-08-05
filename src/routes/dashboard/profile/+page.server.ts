import { profileEditSchema } from '@/validators/profileEditValidator';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';
import type { User } from '@/types/user';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const user = await db.query.users.findFirst({
		columns: {
			id: true,
			name: true,
			pfp: true,
			bio: true,
			email: true,
			isPublic: true,
			isAdmin: true,
			firstLogin: true,
			lastLogin: true
		},
		where: eq(table.users.id, locals.user!.id)
	});

	if (!user) error(404, 'User not found');

	return {
		user: user,
		form: await superValidate(
			{
				name: user.name,
				pfp: user.pfp || undefined,
				bio: user.bio || undefined,
				isPublic: user.isPublic
			},
			zod4(profileEditSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(profileEditSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.users)
			.set({
				name: form.data.name,
				pfp: form.data.pfp || null,
				bio: form.data.bio || '',
				isPublic: form.data.isPublic
			})
			.where(eq(table.users.id, locals.user!.id));

		return message(form, { type: 'success', text: 'Profile updated successfully!' });
	}
};
