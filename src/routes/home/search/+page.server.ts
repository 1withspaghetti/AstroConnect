import { findManyPostPreviews } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import {
	and,
	arrayContains,
	asc,
	count,
	desc,
	eq,
	gte,
	inArray,
	SQL,
	sql,
	type SQLWrapper
} from 'drizzle-orm';
import { db, table } from '@/server/db';
import posts from '@/fake_data';

const queryParamsValidator = z.object({
	search: z.string().max(250).optional(),
	tags: z.string().max(500).optional(),
	careerStage: z.string().max(500).optional(),
	orderBy: z.enum(['relevance', 'createdAt', 'title']).optional(),
	order: z.enum(['asc', 'desc']).optional()
});

export const load = (async ({ url, locals }) => {
	const query = queryParamsValidator.parse(Object.fromEntries(url.searchParams.entries()));

	let conditions: SQLWrapper[] = [eq(table.posts.isDraft, false)];
	let extras: Record<string, SQL.Aliased> = {};
	let orderBy: SQL[] = [desc(table.posts.createdAt)];

	if (query.search) {
		conditions.push(
			sql`to_tsvector('english', ${table.posts.title} || ' ' || ${table.posts.desc}) @@ websearch_to_tsquery('english', ${query.search || ''})`
		);
		extras.rank =
			sql`ts_rank(to_tsvector('english', ${table.posts.title} || ' ' || ${table.posts.desc}), websearch_to_tsquery('english', ${query.search || ''}))`.as(
				'rank'
			);
		extras.rankCd =
			sql`ts_rank_cd(to_tsvector('english', ${table.posts.title} || ' ' || ${table.posts.desc}), websearch_to_tsquery('english', ${query.search || ''}))`.as(
				'rank_cd'
			);
	}

	let tags = query.tags ? query.tags.split(';') : [];

	if (query.tags) {
		// This could prob be optimized further, but for now it works
		conditions.push(
			sql`to_jsonb("posts_tags"."data") @> ${JSON.stringify(tags.map((tag) => [tag]))}::jsonb`
		);
	}

	let careerStages = query.careerStage ? query.careerStage.split(';') : [];

	if (query.careerStage) {
		conditions.push(inArray(table.posts.careerStage, careerStages));
	}

	let orderFn = query.order === 'asc' ? asc : desc;

	if (query.orderBy === 'relevance' && query.search) orderBy.unshift(orderFn(extras.rankCd));
	else if (query.orderBy === 'createdAt') orderBy.unshift(orderFn(table.posts.createdAt));
	else if (query.orderBy === 'title') orderBy.unshift(orderFn(table.posts.title));

	const posts = await findManyPostPreviews({
		where: and(...conditions),
		orderBy: orderBy,
		extras: extras
	});

	return {
		posts
	};
}) satisfies PageServerLoad;
