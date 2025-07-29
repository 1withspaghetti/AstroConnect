import { profileEditSchema } from '@/validators/profileEditSchema';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';
import { zod4 } from 'sveltekit-superforms/adapters';
import fakeData from '@/fake_data';

export const load = (async () => {
	const user = fakeData[0].createdBy;

	return {
		user,
		form: await superValidate(
			{
				name: user.name,
				pfp: user.pfp,
				bio: user.bio
			},
			zod4(profileEditSchema)
		)
	};
}) satisfies PageServerLoad;
