import { db, table } from '@/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	await locals.auth();

	const globalTagsData = db
		.select({ tag: table.defaultTags.tag })
		.from(table.defaultTags)
		.orderBy(table.defaultTags.tag)
		.then((tags) => tags.map((tag) => tag.tag));

	const userTagsData = db
		.selectDistinct({ tag: table.postTags.tag })
		.from(table.postTags)
		.orderBy(table.postTags.tag)
		.then((tags) => tags.map((tag) => tag.tag));

	return {
		globalTagsData,
		userTagsData
	};
}) satisfies LayoutServerLoad;
