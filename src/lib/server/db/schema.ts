import { pgTable, integer, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique()
});

export type User = typeof user.$inferSelect;
