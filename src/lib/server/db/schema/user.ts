import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { posts } from './post';
import { sessions } from './session';
import { applications } from './application';

export const users = pgTable(
	'users',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		googleId: text('google_id').notNull().unique(),
		name: varchar({ length: 200 }).notNull(),
		email: varchar({ length: 500 }).notNull(),
		pfp: varchar({ length: 500 }),
		bio: varchar({ length: 500 }).default('').notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		isAdmin: boolean('is_admin').default(false).notNull(),
		firstLogin: timestamp('first_login').defaultNow().notNull(),
		lastLogin: timestamp('last_login').defaultNow().notNull(),
		sendSubmissionEmails: boolean('send_submission_emails').default(true).notNull(),
		alternateEmail: varchar('alternate_email', { length: 500 })
	},
	(table) => [
		index('users_google_id_idx').on(table.googleId),
		index('users_email_idx').on(table.email),
		index('users_is_public_idx').on(table.isPublic)
	]
);

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	sessions: many(sessions),
	applications: many(applications)
}));
