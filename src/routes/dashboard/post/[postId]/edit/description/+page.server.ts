import { descriptionEditFormSchema } from '@/validators/descriptionEditFormValidator.js';
import type { PageServerLoad } from './$types.js';
import posts from '@/fake_data';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const postId = parseInt(params.postId);

	const post = posts.find((p) => p.id === postId);

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		form: await superValidate(post, zod4(descriptionEditFormSchema))
	};
};
