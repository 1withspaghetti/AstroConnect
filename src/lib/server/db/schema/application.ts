import { jsonb, pgTable, timestamp, index, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { users } from './user';
import { posts } from './post';
import { relations } from 'drizzle-orm';
import type { ApplicationFormAnswer } from '@/types/applicationForm';

export const applications = pgTable(
	'applications',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		postId: uuid('post_id')
			.references(() => posts.id, { onDelete: 'cascade' })
			.notNull(),
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		answers: jsonb().$type<ApplicationFormAnswer[]>().default([]).notNull()
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

export const applicationUploads = pgTable(
	'application_uploads',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		fileKey: text('file_key').unique().notNull(),
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		isTemp: boolean('is_temp').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('application_uploads_file_key_idx').on(table.fileKey),
		index('application_uploads_user_id_idx').on(table.userId)
	]
);

export const applicationUploadsRelations = relations(applicationUploads, ({ one }) => ({
	user: one(users, {
		fields: [applicationUploads.userId],
		references: [users.id]
	})
}));
