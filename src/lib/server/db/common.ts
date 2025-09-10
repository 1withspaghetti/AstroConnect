import type { Post, PostPreview } from '@/types/post';
import { db, table } from '.';
import { and, desc, eq, exists, or } from 'drizzle-orm';

export async function findManyPostPreviews(
	query: Omit<Omit<Parameters<typeof db.query.posts.findMany>[0], 'columns'>, 'with'>
): Promise<(PostPreview & Record<string, any>)[]> {
	const posts = await db.query.posts.findMany({
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
		},
		orderBy: desc(table.posts.createdAt),
		...query
	});

	return posts.map((post) => ({
		...post,
		owner: {
			...post.owner,
			tags: post.owner.tags.map((tag) => tag.tag)
		},
		images: post.images.map((image) => image.url),
		tags: post.tags.map((tag) => tag.tag),
		applications: post.applications.length
	}));
}

export async function findFirstPost(
	query: Omit<Omit<Parameters<typeof db.query.posts.findFirst>[0], 'columns'>, 'with'>
): Promise<Post | undefined> {
	const post = await db.query.posts.findFirst({
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
			maxSlots: true,
			questions: true
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
		},
		orderBy: desc(table.posts.createdAt),
		...query
	});

	return post
		? {
				...post,
				owner: {
					...post.owner,
					tags: post.owner.tags.map((tag) => tag.tag)
				},
				images: post.images.map((image) => image.url),
				tags: post.tags.map((tag) => tag.tag),
				applications: post.applications.length,
				questions: post.questions
			}
		: undefined;
}

/**
 * @returns a condition for checking user access to a post, should be used in a where clause
 */
export function userHasAccessToPost(userId: string) {
	return or(
		eq(table.posts.ownerId, userId),
		exists(
			db
				.select()
				.from(table.userProxies)
				.where(
					and(
						eq(table.userProxies.proxyId, userId),
						eq(table.userProxies.userId, table.posts.ownerId)
					)
				)
		)
	);
}
