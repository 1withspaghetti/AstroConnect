import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';

export const sessions = pgTable('sessions', {
	id: text().primaryKey(),
	userId: integer()
		.references(() => users.id, {onDelete: 'cascade'})
		.notNull(),
	expiresAt: timestamp().notNull()
});

export type Session = typeof sessions.$inferSelect;
