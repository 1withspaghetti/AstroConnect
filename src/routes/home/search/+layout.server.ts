import { db, table } from '@/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	await locals.auth();

	const postTagsData = db
		.selectDistinct({ tag: table.postTags.tag })
		.from(table.postTags)
		.orderBy(table.postTags.tag)
		.then((tags) => tags.map((tag) => tag.tag));

	return {
		postTagsData
	};
}) satisfies LayoutServerLoad;
