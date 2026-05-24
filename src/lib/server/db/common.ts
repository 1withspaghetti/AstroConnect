import type { Post, PostPreview } from '@/types/post';
import { db, table } from '.';
import { and, desc, eq, exists, or } from 'drizzle-orm';
import type { ApplicationFormQuestion } from '@/types/applicationForm';

export type RawPost = {
	applications: {
		id: string;
	}[];
	careerStage: string;
	closesAt: Date | null;
	createdAt: Date;
	desc: string;
	durationEnd: string | null;
	durationStart: string | null;
	id: string;
	images: {
		url: string;
	}[];
	isDraft: boolean;
	isOpen: boolean;
	maxSlots: number | null;
	owner: {
		bio: string;
		careerStage: string;
		email: string;
		id: string;
		isAdmin: boolean;
		major: string;
		name: string;
		pfp: string | null;
		tags: {
			tag: string;
		}[];
	};
	positions: string;
	prereq: string;
	publishedAt: Date | null;
	questions: ApplicationFormQuestion[];
	tags: {
		tag: string;
	}[];
	timeCommitment: string;
	title: string;
};

export function normalizePost(post: RawPost): Post {
	return {
		...post,
		owner: {
			...post.owner,
			tags: post.owner.tags.map((tag) => tag.tag)
		},
		images: post.images.map((image) => image.url),
		tags: post.tags.map((tag) => tag.tag),
		applications: post.applications.length,
		questions: post.questions
	};
}

export async function findManyPostPreviews(
	query: Omit<Omit<Parameters<typeof db.query.posts.findMany>[0], 'columns'>, 'with'>
): Promise<(PostPreview & Record<string, unknown>)[]> {
	const posts = await db.query.posts.findMany({
		columns: {
			id: true,
			createdAt: true,
			publishedAt: true,
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
		orderBy: [desc(table.posts.publishedAt), desc(table.posts.createdAt)],
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

export async function findFirstPost<Raw extends boolean = false>(
	query: Omit<Omit<Parameters<typeof db.query.posts.findFirst>[0], 'columns'>, 'with'>,
	raw: Raw = false as Raw
): Promise<(Raw extends true ? RawPost : Post) | undefined> {
	const post = await db.query.posts.findFirst({
		columns: {
			id: true,
			createdAt: true,
			publishedAt: true,
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
		orderBy: [desc(table.posts.publishedAt), desc(table.posts.createdAt)],
		...query
	});

	if (raw) return post as RawPost | undefined as (Raw extends true ? RawPost : Post) | undefined;

	return post ? (normalizePost(post) as Raw extends true ? RawPost : Post) : undefined;
}

/**
 * @returns a condition for checking user access to a post, should be used in a where clause
 */
export function userHasAccessToPost(userId: string, isAdmin?: boolean) {
	if (isAdmin) return undefined;
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
