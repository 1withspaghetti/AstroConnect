import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, table } from '@/server/db';
import { asc, eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { defaultTagSchema } from '@/validators/defaultTagValidator';

export const load = (async ({ locals }) => {
	const { session } = await locals.auth();
	if (session.adminId === null) throw error(403, 'Unauthorized');

	const tags = await db.query.defaultTags.findMany({
		orderBy: asc(table.defaultTags.tag)
	});

	return {
		tags: tags.map((tag) => tag.tag),
		defaultTagForm: await superValidate(zod4(defaultTagSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { session } = await locals.auth();
		if (session.adminId === null) throw error(403, 'Unauthorized');

		const form = await superValidate(request, zod4(defaultTagSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		// Check if the tag already exists
		const existingTag = await db.query.defaultTags.findFirst({
			where: eq(table.defaultTags.tag, form.data.tag)
		});

		if (existingTag) {
			return message(form, { type: 'error', text: 'This tag already exists.' });
		}

		// Create the tag
		await db.insert(table.defaultTags).values({
			tag: form.data.tag
		});

		return message(form, { type: 'success', text: 'Tag added successfully!' });
	}
};
