import { integer, jsonb, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';
import { posts } from './post';

export const applications = pgTable('applications', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	postId: integer()
		.references(() => posts.id)
		.notNull(),
	userId: integer()
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	answers: jsonb().default([]).notNull()
});
