import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { settingsEditSchema } from '@/validators/settingsEditSchema';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const user = await db.query.users.findFirst({
		columns: {
			id: true,
			sendSubmissionEmails: true,
			alternateEmail: true
		},
		where: eq(table.users.id, locals.user!.id)
	});

	if (!user) error(404, 'User not found');

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
			.update(table.users)
			.set({
				sendSubmissionEmails: form.data.sendSubmissionEmails,
				alternateEmail: form.data.alternateEmail || null // Store null if not provided
			})
			.where(eq(table.users.id, locals.user!.id));

		return message(form, { type: 'success', text: 'Settings updated successfully!' });
	}
};
