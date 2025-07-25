import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import posts from '../../search/fake_data.js';
import { error } from '@sveltejs/kit';
import { getApplicationFormSchema } from '@/validators/applicationFormValidator.js';

export const load: PageServerLoad = async ({ params }) => {
	const postId = parseInt(params.postId);

	const post = posts.find((p) => p.id === postId);

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		post,
		form: await superValidate(zod4(getApplicationFormSchema(post.applicationForm)))
	};
};
