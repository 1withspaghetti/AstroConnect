import { findManyPostPreviews } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { z } from 'zod/v4';
import { and, asc, desc, eq, gte, inArray, lte, SQL, sql, type SQLWrapper } from 'drizzle-orm';
import { table } from '@/server/db';
import { error } from '@sveltejs/kit';
import dayjs from '@/util/dayjs';

const perPage = 25;

const queryParamsValidator = z
	.object({
		search: z.string().max(250, 'Max 250 characters in search').optional(),
		tags: z.string().max(500, 'Max 500 characters in tags').optional(),
		careerStage: z.string().max(500, 'Max 500 characters in Career Stage').optional(),
		start: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
			.optional(),
		end: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
			.optional(),
		orderBy: z.enum(['relevance', 'createdAt', 'title'], 'Invalid order by').optional(),
		order: z.enum(['asc', 'desc'], 'Invalid order').optional(),
		page: z.coerce.number().min(1, 'Page must be at least 1').optional().default(1)
	})
	.superRefine((data, ctx) => {
		if ((data.start && !data.end) || (data.end && !data.start)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Both start and end dates are required',
				path: ['end']
			});
		} else if (data.start && data.end) {
			let dateStart = dayjs(data.start, 'YYYY-MM-DD', true);
			let dateEnd = dayjs(data.end, 'YYYY-MM-DD', true);
			if (!dateStart.isValid() || dateStart.isBefore(dayjs('2000-01-01', 'YYYY-MM-DD'))) {
				ctx.addIssue({
					code: 'custom',
					message: 'Invalid start date',
					path: ['start']
				});
			} else if (!dateEnd.isValid() || dateEnd.isBefore(dayjs())) {
				ctx.addIssue({
					code: 'custom',
					message: 'Invalid end date',
					path: ['end']
				});
			} else if (dateStart.isAfter(dateEnd)) {
				ctx.addIssue({
					code: 'custom',
					message: 'Start date must be before end date',
					path: ['start']
				});
			}
		}
	});

export const load = (async ({ url, locals }) => {
	await locals.auth();

	const parseRes = queryParamsValidator.safeParse(Object.fromEntries(url.searchParams.entries()));
	if (!parseRes.success) return error(400, parseRes.error.issues[0].message);
	const query = parseRes.data;

	let conditions: (SQLWrapper | undefined)[] = [];
	let extras: Record<string, SQL.Aliased> = {};
	let orderBy: SQL[] = [];

	if (query.search) {
		conditions.push(
			sql`to_tsvector('english', ${table.posts.title} || ' ' || ${table.posts.desc}) @@ websearch_to_tsquery('english', ${query.search || ''})`
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
			sql`exists (SELECT json_array_elements_text("posts_tags"."data") INTERSECT SELECT json_array_elements_text(${JSON.stringify(tags.map((tag) => [tag]))}::json))`
		);
	}

	let careerStages = query.careerStage ? query.careerStage.split(';') : [];

	if (query.careerStage) {
		conditions.push(inArray(table.posts.careerStage, careerStages));
	}

	if (query.start && query.end) {
		conditions.push(
			and(gte(table.posts.durationStart, query.start), lte(table.posts.durationEnd, query.end))
		);
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
		},
		limit: perPage,
		offset: (query.page - 1) * perPage
	}).then((posts) => ({
		posts: posts.map((post) => ({
			...post,
			total: undefined, // Remove total from individual posts
			rankCd: undefined // Remove rank_cd from individual posts
		})),
		total: posts[0]?.total ?? 0
	}));

	return {
		postData
	};
}) satisfies PageServerLoad;
