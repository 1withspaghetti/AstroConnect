import { findManyPostPreviews } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { z } from 'zod/v4';
import { and, asc, desc, eq, inArray, SQL, sql, type SQLWrapper } from 'drizzle-orm';
import { table } from '@/server/db';
import { error } from '@sveltejs/kit';

const queryParamsValidator = z.object({
	search: z.string().max(250, 'Max 250 characters in search').optional(),
	tags: z.string().max(500, 'Max 500 characters in tags').optional(),
	careerStage: z.string().max(500, 'Max 500 characters in Career Stage').optional(),
	orderBy: z.enum(['relevance', 'createdAt', 'title'], 'Invalid order by').optional(),
	order: z.enum(['asc', 'desc'], 'Invalid order').optional()
});

export const load = (async ({ url, locals }) => {
	await locals.auth();

	const parseRes = queryParamsValidator.safeParse(Object.fromEntries(url.searchParams.entries()));
	if (!parseRes.success) return error(400, parseRes.error.issues[0].message);
	const query = parseRes.data;

	let conditions: SQLWrapper[] = [];
	let extras: Record<string, SQL.Aliased> = {};
	let orderBy: SQL[] = [];

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

	const postData = findManyPostPreviews({
		where: and(eq(table.posts.isDraft, false), ...conditions),
		orderBy: [...orderBy, desc(table.posts.createdAt)],
		extras: {
			...extras,
			total: sql<number>`count(*) OVER()`.as('total')
		}
	}).then((posts) => ({
		posts: posts.map((post) => ({
			...post,
			total: undefined, // Remove total from individual posts
			rank: undefined, // Remove rank from individual posts
			rankCd: undefined // Remove rank_cd from individual posts
		})),
		total: posts[0]?.total ?? 0
	}));

	return {
		postData
	};
}) satisfies PageServerLoad;
