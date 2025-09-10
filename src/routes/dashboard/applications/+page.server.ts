import { db, table } from '@/server/db';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import type { PostPreview } from '@/types/post';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	const applications = await db.query.applications.findMany({
		where: eq(table.applications.userId, user.id),
		columns: {
			id: true,
			answers: true,
			createdAt: true
		},
		with: {
			post: {
				columns: {
					id: true,
					createdAt: true,
					isDraft: true,
					title: true,
					desc: true,
					positions: true,
					timeCommitment: true,
					careerStage: true,
					prereq: true,
					durationStart: true,
					durationEnd: true,
					isOpen: true,
					closesAt: true,
					maxSlots: true
				},
				with: {
					images: {
						columns: {
							url: true
						},
						orderBy: table.postImages.order
					},
					tags: {
						columns: {
							tag: true
						},
						orderBy: table.postTags.tag
					},
					applications: {
						columns: {
							id: true
						}
					},
					owner: {
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
								},
								orderBy: table.userTags.tag
							}
						}
					}
				}
			}
		}
	});

	return {
		applications: applications.map((app) => ({
			...app,
			post: {
				...app.post,
				owner: {
					...app.post.owner,
					tags: app.post.owner.tags.map((tag) => tag.tag)
				},
				images: app.post.images.map((image) => image.url),
				tags: app.post.tags.map((tag) => tag.tag),
				applications: app.post.applications.length
			} as PostPreview
		}))
	};
}) satisfies PageServerLoad;
