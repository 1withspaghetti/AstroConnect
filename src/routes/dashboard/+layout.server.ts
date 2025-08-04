import type { PostMinimal } from '@/types/post';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db, table } from '@/server/db';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.user) return redirect(302, '/login');

	const posts = await db.query.posts.findMany({
		columns: {
			id: true,
			isDraft: true,
			title: true,
			isOpen: true,
			createdAt: true
		},
		where: eq(table.posts.ownerId, locals.user!.id),
		orderBy: [desc(table.posts.createdAt)]
	});

	return {
		postList: posts as PostMinimal[]
	};
}) satisfies LayoutServerLoad;
