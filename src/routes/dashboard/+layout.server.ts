import type { PostMinimal } from '@/types/post';
import type { LayoutServerLoad } from './$types';
import { db, table } from '@/server/db';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const { session, user } = await locals.auth();

	const posts = await db.query.posts.findMany({
		columns: {
			id: true,
			isDraft: true,
			title: true,
			isOpen: true,
			createdAt: true
		},
		where: eq(table.posts.ownerId, user.id),
		orderBy: [desc(table.posts.createdAt)]
	});

	return {
		postList: posts as PostMinimal[],
		user: user,
		isAdmin: session.adminId !== null
	};
}) satisfies LayoutServerLoad;
