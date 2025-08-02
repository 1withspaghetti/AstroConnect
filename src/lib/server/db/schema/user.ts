import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	oauthId: text().notNull().unique(),
	name: varchar({ length: 200 }).notNull(),
	email: varchar({ length: 500 }).notNull(),
	pfp: varchar({ length: 500 }),
	bio: varchar({ length: 500 }),
	isPublic: boolean().default(false).notNull(),
	isAdmin: boolean().default(false).notNull(),
	firstLogin: timestamp().defaultNow(),
	lastLogin: timestamp()
});
