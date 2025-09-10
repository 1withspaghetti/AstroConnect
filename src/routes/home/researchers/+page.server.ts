import z from 'zod/v4';
import type { PageServerLoad } from './$types';
import { and, asc, desc, inArray, sql, eq, type SQL, type SQLWrapper } from 'drizzle-orm';
import { db, table } from '@/server/db';
import type { UserProfile } from '@/types/user';
import { error } from '@sveltejs/kit';

const queryParamsValidator = z.object({
	search: z.string().max(250, 'Max 250 characters in search').optional(),
	tags: z.string().max(500, 'Max 500 characters in tags').optional(),
	careerStage: z.string().max(500, 'Max 500 characters in Career Stage').optional(),
	orderBy: z.enum(['relevance', 'name'], 'Invalid order by').optional(),
	order: z.enum(['asc', 'desc'], 'Invalid order').optional()
});

export const load = (async ({ locals, url }) => {
	await locals.auth();

	const parseRes = queryParamsValidator.safeParse(Object.fromEntries(url.searchParams.entries()));
	if (!parseRes.success) return error(400, parseRes.error.issues[0].message);
	const query = parseRes.data;

	let conditions: SQLWrapper[] = [];
	let extras: Record<string, SQL.Aliased> = {};
	let orderBy: SQL[] = [];

	if (query.search) {
		conditions.push(
			sql`to_tsvector('english', ${table.users.name} || ' ' || ${table.users.bio}) @@ websearch_to_tsquery('english', ${query.search || ''})`
		);
		extras.rank =
			sql`ts_rank(to_tsvector('english', ${table.users.name} || ' ' || ${table.users.bio}), websearch_to_tsquery('english', ${query.search || ''}))`.as(
				'rank'
			);
		extras.rankCd =
			sql`ts_rank_cd(to_tsvector('english', ${table.users.name} || ' ' || ${table.users.bio}), websearch_to_tsquery('english', ${query.search || ''}))`.as(
				'rank_cd'
			);
	}

	let tags = query.tags ? query.tags.split(';') : [];

	if (query.tags) {
		// This could prob be optimized further, but for now it works
		conditions.push(
			sql`to_jsonb("users_tags"."data") @> ${JSON.stringify(tags.map((tag) => [tag]))}::jsonb`
		);
	}

	let careerStages = query.careerStage ? query.careerStage.split(';') : [];

	if (query.careerStage) {
		conditions.push(inArray(table.users.careerStage, careerStages));
	}

	let orderFn = query.order === 'asc' ? asc : desc;

	if (query.orderBy === 'relevance' && query.search) orderBy.unshift(orderFn(extras.rankCd));
	else if (query.orderBy === 'name') orderBy.unshift(orderFn(sql`LOWER(${table.users.name})`));

	const data = db.query.users
		.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				pfp: true,
				bio: true,
				careerStage: true,
				major: true,
				isAdmin: true
			},
			with: {
				tags: {
					columns: {
						tag: true
					},
					orderBy: table.userTags.tag
				}
			},
			where: and(eq(table.users.isPublic, true), ...conditions),
			orderBy: [...orderBy, desc(sql`LOWER(${table.users.name})`)],
			extras: {
				...extras,
				total: sql<number>`count(*) OVER()`.as('total')
			}
		})
		.then((users) => ({
			users: users.map((user) => ({
				...user,
				tags: user.tags.map((t) => t.tag), // Simplify tags to string array
				total: undefined // Remove total from individual users
				// rank: undefined, // Remove rank from individual users
				// rankCd: undefined // Remove rank_cd from individual users
			})) as UserProfile[],
			total: users[0]?.total ?? 0
		}));

	return {
		usersData: data
	};
}) satisfies PageServerLoad;
