import type { PostPreview } from '@/types/post';
import { db } from '.';

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
			images: true,
			tags: true,
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
		...query
	});

	return posts.map((post) => ({
		id: post.id,
		isDraft: post.isDraft,
		title: post.title,
		isOpen: post.isOpen,
		createdAt: post.createdAt,
		desc: post.desc || undefined,
		images: post.images.map((image) => image.url),
		tags: post.tags.map((tag) => tag.tag),
		careerStage: post.careerStage || undefined,
		prereq: post.prereq || undefined,
		closesAt: post.closesAt || undefined,
		slotsRemaining: post.maxSlots ? post.maxSlots - post.applications.length : undefined,
		owner: {
			id: post.owner.id,
			name: post.owner.name,
			email: post.owner.email,
			pfp: post.owner.pfp || undefined,
			bio: post.owner.bio || undefined
		}
	}));
}
