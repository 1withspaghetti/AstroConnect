import type { PostMinimal } from '@/types/post';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db, table } from '@/server/db';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.user) return redirect(302, '/login');

	const posts = await db
		.select({
			id: table.posts.id,
			isDraft: table.posts.isDraft,
			title: table.posts.title,
			isOpen: table.posts.isOpen,
			createdAt: table.posts.createdAt
		})
		.from(table.posts)
		.where(eq(table.posts.ownerId, locals.user.id));

	return {
		postList: posts as PostMinimal[]
	};
}) satisfies LayoutServerLoad;
