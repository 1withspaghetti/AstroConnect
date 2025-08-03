import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	googleId: text('google_id').notNull().unique(),
	name: varchar({ length: 200 }).notNull(),
	email: varchar({ length: 500 }).notNull(),
	pfp: varchar({ length: 500 }),
	bio: varchar({ length: 500 }),
	isPublic: boolean('is_public').default(false).notNull(),
	isAdmin: boolean('is_admin').default(false).notNull(),
	firstLogin: timestamp('first_login').defaultNow().notNull(),
	lastLogin: timestamp('last_login').defaultNow().notNull()
});
