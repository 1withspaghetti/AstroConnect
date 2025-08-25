import { db, table } from '@/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	await locals.auth();

	const userTagsData = db
		.selectDistinct({ tag: table.userTags.tag })
		.from(table.userTags)
		.orderBy(table.userTags.tag)
		.then((tags) => tags.map((tag) => tag.tag));

	return {
		userTagsData
	};
}) satisfies LayoutServerLoad;
