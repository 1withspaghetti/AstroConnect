import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const defaultTags = pgTable('default_tags', {
	tag: varchar({ length: 100 }).primaryKey()
});
