import { pgTable, text, timestamp, index, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';

export const sessions = pgTable(
	'sessions',
	{
		id: text().primaryKey(),
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		adminId: uuid('admin_id') // If the user is an admin, this will be their ID, as the userId  could be a different user they are signed in as.
			.references(() => users.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull()
	},
	(table) => [index('sessions_user_id_idx').on(table.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export type Session = typeof sessions.$inferSelect;
