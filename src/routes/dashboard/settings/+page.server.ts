import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { settingsEditSchema } from '@/validators/settingsEditSchema';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/user';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const [user] = await db
		.select({
			sendSubmissionEmails: users.sendSubmissionEmails,
			alternateEmail: users.alternateEmail
		})
		.from(users)
		.where(eq(users.id, locals.user!.id));

	return {
		form: await superValidate(
			{
				sendSubmissionEmails: user.sendSubmissionEmails,
				alternateEmail: user.alternateEmail || undefined // Convert null to undefined
			},
			zod4(settingsEditSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(settingsEditSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		console.log(form.data);

		await db
			.update(users)
			.set({
				sendSubmissionEmails: form.data.sendSubmissionEmails,
				alternateEmail: form.data.alternateEmail || null // Store null if not provided
			})
			.where(eq(users.id, locals.user!.id));

		return message(form, { type: 'success', text: 'Settings updated successfully!' });
	}
};
