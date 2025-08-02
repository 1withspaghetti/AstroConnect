import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './user';

export const sessions = pgTable('sessions', {
	id: text().primaryKey(),
	userId: integer()
		.references(() => users.id)
		.notNull(),
	expiresAt: timestamp().notNull()
});

export type Session = typeof sessions.$inferSelect;
