import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
	index
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations, sql } from 'drizzle-orm';
import { applications } from './application';

export const posts = pgTable(
	'posts',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		ownerId: integer('owner_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		isDraft: boolean('is_draft').default(true).notNull(),
		title: varchar({ length: 200 }).notNull(),
		desc: varchar({ length: 10000 }).default('').notNull(),
		careerStage: varchar('career_stage', { length: 100 }).default('').notNull(),
		prereq: varchar({ length: 1000 }).default('').notNull(),
		isOpen: boolean('is_open').default(true).notNull(),
		closesAt: timestamp('closes_at'),
		maxSlots: integer('max_slots'),
		questions: jsonb().default([]).notNull()
	},
	(table) => [
		index('posts_search_idx').using(
			'gin',
			sql`to_tsvector('english', ${table.title} || ' ' || ${table.desc})`
		),
		index('posts_owner_id_idx').on(table.ownerId),
		index('posts_created_at_idx').on(table.createdAt),
		index('posts_is_draft_idx').on(table.isDraft),
		index('posts_is_open_idx').on(table.isOpen),
		index('posts_career_stage_idx').on(table.careerStage)
	]
);

export const postsRelations = relations(posts, ({ one, many }) => ({
	owner: one(users, {
		fields: [posts.ownerId],
		references: [users.id]
	}),
	images: many(postImages),
	tags: many(postTags),
	applications: many(applications)
}));

export const postImages = pgTable(
	'post_images',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		postId: integer('post_id')
			.references(() => posts.id, { onDelete: 'cascade' })
			.notNull(),
		url: text().notNull(),
		order: integer().notNull().default(0)
	},
	(table) => [
		index('post_images_post_id_idx').on(table.postId),
		index('post_images_order_idx').on(table.order)
	]
);

export const postImagesRelations = relations(postImages, ({ one }) => ({
	post: one(posts, {
		fields: [postImages.postId],
		references: [posts.id]
	})
}));

export const postTags = pgTable(
	'post_tags',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		postId: integer('post_id')
			.references(() => posts.id, { onDelete: 'cascade' })
			.notNull(),
		tag: varchar({ length: 100 }).notNull()
	},
	(table) => [
		index('post_tags_post_id_idx').on(table.postId),
		index('post_tags_tag_idx').on(table.tag)
	]
);

export const postTagsRelations = relations(postTags, ({ one }) => ({
	post: one(posts, {
		fields: [postTags.postId],
		references: [posts.id]
	})
}));
