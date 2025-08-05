import { findManyPostPreviews } from '@/server/db/common';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { and, asc, count, desc, eq, gte, inArray, SQL, sql, type SQLWrapper } from 'drizzle-orm';
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

    //let builder: Partial<Parameters<typeof findManyPostPreviews>[0]> = {};
    let conditions: SQLWrapper[] = [];
    let extras: Record<string, SQL.Aliased> = {};
    let orderBy: SQL[] = [desc(table.posts.createdAt)];

    if (query.search) {
        conditions.push(
            sql`to_tsvector('english', ${table.posts.title}) || to_tsvector('english', ${table.posts.desc}) @@ to_tsquery('english', ${query.search})`
        );
        extras.rankCd = sql`ts_rank_cd(setweight(to_tsvector('english', ${table.posts.title}), 'A') || setweight(to_tsvector('english', ${table.posts.desc}), 'B')), to_tsquery('english', ${query.search})`.as('rank_cd');
    }

    let tags = query.tags ? query.tags.split(';') : [];

    if (query.tags) {
        // const tagCount = count(
        //     db.select({ tag: table.postTags.tag }).from(table.postTags)
        //         .where(and(eq(table.postTags.postId, table.posts.id), inArray(table.postTags.tag, tags)))
        // );

        // conditions.push(
        //     gte(tagCount, tags.length)
        // )
        conditions.push(
            gte(sql`jsonb_array_length("posts_tags"."data")`, tags.length)
        )
    }

    let careerStages = query.careerStage ? query.careerStage.split(';') : [];

    if (query.careerStage) {
        conditions.push(
            inArray(table.posts.careerStage, careerStages)
        );
    }

    let orderFn = (query.order === 'asc') ? asc : desc;

    if (query.orderBy === 'relevance' && query.search) orderBy.unshift(orderFn(extras.rankCd));
    else if (query.orderBy === 'createdAt') orderBy.unshift(orderFn(table.posts.createdAt));
    else if (query.orderBy === 'title') orderBy.unshift(orderFn(table.posts.title));

    const posts = await findManyPostPreviews({
        where: and(...conditions),
        orderBy: orderBy,
        extras: extras
    });

    console.log(posts);

    return {
        posts
    }
        
}) satisfies PageServerLoad;