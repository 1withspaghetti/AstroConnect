import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './user';

export const posts = pgTable('posts', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	ownerId: integer('owner_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	isDraft: boolean('is_draft').default(true).notNull(),
	title: varchar({ length: 200 }).notNull(),
	desc: varchar({ length: 10000 }),
	careerStage: varchar('career_stage', { length: 100 }).notNull(),
	prereq: varchar({ length: 1000 }),
	isOpen: boolean('is_open').default(true).notNull(),
	closesAt: timestamp('closes_at').notNull(),
	maxSlots: integer('max_slots'),
	questions: jsonb().default([]).notNull()
});

export const postImages = pgTable('post_images', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer('post_id')
		.references(() => posts.id, { onDelete: 'cascade' })
		.notNull(),
	url: text().notNull(),
	order: integer().notNull().default(0)
});

export const postTags = pgTable('post_tags', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer('post_id')
		.references(() => posts.id, { onDelete: 'cascade' })
		.notNull(),
	tag: varchar({ length: 100 }).notNull()
});
