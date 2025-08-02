import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './user';

export const posts = pgTable('posts', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	ownerId: integer()
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	isDraft: boolean().default(true).notNull(),
	title: varchar({ length: 200 }).notNull(),
	desc: varchar({ length: 10000 }),
	careerStage: varchar({ length: 100 }).notNull(),
	prereq: varchar({ length: 1000 }),
	isOpen: boolean().default(true).notNull(),
	closesAt: timestamp(),
	maxSlots: integer(),
	questions: jsonb().default([]).notNull()
});

export const postImages = pgTable('post_images', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer()
		.references(() => posts.id)
		.notNull(),
	url: text().notNull(),
	order: integer().notNull().default(0)
});

export const postTags = pgTable('post_tags', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer()
		.references(() => posts.id)
		.notNull(),
	tag: varchar({ length: 100 }).notNull()
});
