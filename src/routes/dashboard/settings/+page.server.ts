import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { settingsEditSchema } from '@/validators/settingsEditValidator';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	const fullUser = await db.query.users.findFirst({
		columns: {
			sendSubmissionEmails: true,
			alternateEmail: true
		},
		where: eq(table.users.id, user.id)
	});

	if (!fullUser) error(404, 'User not found');

	return {
		form: await superValidate(
			{
				sendSubmissionEmails: fullUser.sendSubmissionEmails,
				alternateEmail: fullUser.alternateEmail || undefined // Use undefined if alternateEmail is null
			},
			zod4(settingsEditSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(settingsEditSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		await db
			.update(table.users)
			.set({
				sendSubmissionEmails: form.data.sendSubmissionEmails,
				alternateEmail: form.data.alternateEmail || null // Store null if not provided
			})
			.where(eq(table.users.id, user.id));

		return message(form, { type: 'success', text: 'Settings updated successfully!' });
	}
};
