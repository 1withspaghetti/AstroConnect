import type { PageServerLoad } from './$types';
import { validateId } from '@/validators/idValidator';
import { and, desc, eq } from 'drizzle-orm';
import { db, table } from '@/server/db';
import { error } from '@sveltejs/kit';
import type { UserProfile } from '@/types/user';
import { userHasAccessToPost } from '@/server/db/common';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.auth();
	const postId = validateId(params.postId);

	const post = await db.query.posts.findFirst({
		columns: {
			id: true
		},
		with: {
			applications: {
				columns: {
					id: true,
					answers: true,
					createdAt: true
				},
				with: {
					user: {
						columns: {
							id: true,
							name: true,
							email: true,
							pfp: true,
							bio: true,
							careerStage: true,
							major: true,
							isAdmin: true
						},
						with: {
							tags: {
								columns: {
									tag: true
								}
							}
						}
					}
				},
				orderBy: [desc(table.applications.createdAt)]
			}
		},
		where: and(eq(table.posts.id, postId), userHasAccessToPost(user.id))
	});

	if (!post) {
		throw error(404, `Post not found`);
	}

	return {
		postId,
		applications: post.applications.map((app) => ({
			...app,
			user: {
				...app.user,
				tags: app.user.tags.map((t) => t.tag)
			} as UserProfile
		}))
	};
};
