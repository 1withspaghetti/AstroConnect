import { profileEditSchema } from '@/validators/profileEditSchema';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/user';
import { eq } from 'drizzle-orm';
import type { User } from '@/types/user';

export const load = (async ({ locals }) => {
	const user = await getUser(locals.user!.id);

	return {
		user: user as User,
		form: await superValidate(
			{
				name: user.name,
				pfp: user.pfp || undefined,
				bio: user.bio || undefined
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
			.update(users)
			.set({
				name: form.data.name,
				pfp: form.data.pfp,
				bio: form.data.bio
			})
			.where(eq(users.id, locals.user!.id));

		return message(form, { type: 'success', text: 'Profile updated successfully!' });
	}
};

async function getUser(id: number): Promise<User> {
	const [user] = await db
		.select({
			id: users.id,
			name: users.name,
			pfp: users.pfp,
			bio: users.bio,
			email: users.email,
			isPublic: users.isPublic,
			isAdmin: users.isAdmin,
			firstLogin: users.firstLogin,
			lastLogin: users.lastLogin
		})
		.from(users)
		.where(eq(users.id, id));

	return {
		...user,
		pfp: user.pfp || undefined,
		bio: user.bio || undefined
	} as User;
}
