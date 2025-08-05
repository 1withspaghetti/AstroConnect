import type { Post, PostPreview } from '@/types/post';
import { db, table } from '.';
import { desc } from 'drizzle-orm';
import type { ApplicationFormQuestion } from '@/types/applicationForm';

export async function findManyPostPreviews(
	query: Omit<Omit<Parameters<typeof db.query.posts.findMany>[0], 'columns'>, 'with'>
): Promise<PostPreview[]> {
	const posts = await db.query.posts.findMany({
		columns: {
			id: true,
			title: true,
			desc: true,
			createdAt: true,
			isDraft: true,
			careerStage: true,
			prereq: true,
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
					bio: true
				}
			}
		},
		orderBy: desc(table.posts.createdAt),
		...query
	});

	return posts.map((post) => ({
		...post,
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
			title: true,
			desc: true,
			createdAt: true,
			isDraft: true,
			careerStage: true,
			prereq: true,
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
					bio: true
				}
			}
		},
		orderBy: desc(table.posts.createdAt),
		...query
	});

	return post
		? {
				...post,
				images: post.images.map((image) => image.url),
				tags: post.tags.map((tag) => tag.tag),
				applications: post.applications.length,
				questions: post.questions as ApplicationFormQuestion[]
			}
		: undefined;
}
