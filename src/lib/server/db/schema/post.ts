import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';
import { applications } from './application';

export const posts = pgTable('posts', {
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
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	owner: one(users, {
		fields: [posts.ownerId],
		references: [users.id]
	}),
	images: many(postImages),
	tags: many(postTags),
	applications: many(applications)
}));

export const postImages = pgTable('post_images', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer('post_id')
		.references(() => posts.id, { onDelete: 'cascade' })
		.notNull(),
	url: text().notNull(),
	order: integer().notNull().default(0)
});

export const postImagesRelations = relations(postImages, ({ one }) => ({
	post: one(posts, {
		fields: [postImages.postId],
		references: [posts.id]
	})
}));

export const postTags = pgTable('post_tags', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer('post_id')
		.references(() => posts.id, { onDelete: 'cascade' })
		.notNull(),
	tag: varchar({ length: 100 }).notNull()
});

export const postTagsRelations = relations(postTags, ({ one }) => ({
	post: one(posts, {
		fields: [postTags.postId],
		references: [posts.id]
	})
}));
