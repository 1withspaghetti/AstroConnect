import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { searchSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(searchSchema))
	};
};
