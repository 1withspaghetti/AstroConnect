import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { settingsEditSchema } from '@/validators/settingsEditValidator';
import { db, table } from '@/server/db';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { proxyUserSubmitSchema } from '@/validators/proxyUserSubmitValidator';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	const fullUser = await db.query.users.findFirst({
		columns: {
			sendSubmissionEmails: true,
			alternateEmail: true
		},
		where: eq(table.users.id, user.id),
		with: {
			proxies: {
				columns: {
					proxyId: true
				},
				with: {
					proxy: {
						columns: {
							id: true,
							name: true,
							email: true,
							pfp: true
						}
					}
				}
			}
		}
	});

	if (!fullUser) error(404, 'User not found');

	return {
		userSettingsForm: await superValidate(
			{
				sendSubmissionEmails: fullUser.sendSubmissionEmails,
				alternateEmail: fullUser.alternateEmail || undefined // Use undefined if alternateEmail is null
			},
			zod4(settingsEditSchema)
		),
		proxyUserForm: await superValidate(zod4(proxyUserSubmitSchema)),
		proxyUsers: fullUser.proxies.map((p) => p.proxy)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update: async ({ request, locals }) => {
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
	},
	proxy: async ({ request, locals }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(proxyUserSubmitSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		// Check if the proxy user exists
		const proxyUser = await db.query.users.findFirst({
			where: eq(table.users.email, form.data.email)
		});

		if (!proxyUser) {
			return message(form, { type: 'error', text: 'No user found with that email.' });
		}

		if (proxyUser.id === user.id) {
			return message(form, { type: 'error', text: 'You cannot add yourself as a proxy.' });
		}

		// Check if the proxy relationship already exists
		const existingProxy = await db.query.userProxies.findFirst({
			where: and(eq(table.userProxies.userId, user.id), eq(table.userProxies.proxyId, proxyUser.id))
		});

		if (existingProxy) {
			return message(form, { type: 'error', text: 'This user is already your proxy.' });
		}

		// Create the proxy relationship
		await db.insert(table.userProxies).values({
			userId: user.id,
			proxyId: proxyUser.id
		});

		return message(form, { type: 'success', text: 'Proxy user added successfully!' });
	}
};
