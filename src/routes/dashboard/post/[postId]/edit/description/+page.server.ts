import { descriptionEditFormSchema } from '@/validators/descriptionEditFormValidator.js';
import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { db, table } from '@/server/db/index.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const postId = parseInt(params.postId);

	if (isNaN(postId)) {
		throw error(400, `Invalid post ID: ${params.postId}`);
	}

	const post = await db.query.posts
		.findFirst({
			columns: {
				title: true,
				desc: true,
				careerStage: true,
				prereq: true
			},
			where: eq(table.posts.id, postId),
			with: {
				tags: {
					columns: {
						tag: true
					}
				}
			}
		})
		.then((post) =>
			post
				? {
						title: post.title,
						desc: post.desc || undefined,
						careerStage: post.careerStage || undefined,
						prereq: post.prereq || undefined,
						tags: post.tags.map((tag) => tag.tag)
					}
				: undefined
		);

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		form: await superValidate(post, zod4(descriptionEditFormSchema))
	};
};
