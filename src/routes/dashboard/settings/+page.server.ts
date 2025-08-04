import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import fakeData from '@/fake_data';
import { settingsEditSchema } from '@/validators/settingsEditSchema';

export const load = (async () => {
	const user = fakeData[0].owner;

	return {
		form: await superValidate(
			{
				darkMode: false,
				receivingEmail: user.email
			},
			zod4(settingsEditSchema)
		)
	};
}) satisfies PageServerLoad;
