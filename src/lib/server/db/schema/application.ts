import { integer, jsonb, pgTable, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './user';
import { posts } from './post';
import { relations } from 'drizzle-orm';

export const applications = pgTable(
	'applications',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		postId: integer('post_id')
			.references(() => posts.id, { onDelete: 'cascade' })
			.notNull(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		answers: jsonb().default([]).notNull()
	},
	(table) => [
		index('applications_post_id_idx').on(table.postId),
		index('applications_user_id_idx').on(table.userId)
	]
);

export const applicationsRelations = relations(applications, ({ one }) => ({
	post: one(posts, {
		fields: [applications.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [applications.userId],
		references: [users.id]
	})
}));
