import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	pgTable,
	text,
	timestamp,
	varchar,
	index,
	uuid,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { posts } from './post';
import { sessions } from './session';
import { applications, applicationUploads } from './application';

export const users = pgTable(
	'users',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		googleId: text('google_id').unique(),
		name: varchar({ length: 200 }).notNull(),
		email: varchar({ length: 500 }).notNull().unique(),
		pfp: varchar({ length: 500 }),
		bio: varchar({ length: 500 }).default('').notNull(),
		careerStage: varchar('career_stage', { length: 100 }).default('').notNull(),
		major: varchar({ length: 100 }).default('').notNull(),
		isPublic: boolean('is_public').default(false).notNull(),
		isAdmin: boolean('is_admin').default(false).notNull(),
		firstLogin: timestamp('first_login').defaultNow().notNull(),
		lastLogin: timestamp('last_login').defaultNow().notNull(),
		sendSubmissionEmails: boolean('send_submission_emails').default(true).notNull(),
		alternateEmail: varchar('alternate_email', { length: 500 })
	},
	(table) => [
		index('users_search_idx').using(
			'gin',
			sql`to_tsvector('english', ${table.name} || ' ' || ${table.bio})`
		),
		index('users_google_id_idx').on(table.googleId),
		index('users_email_idx').on(table.email),
		index('users_is_public_idx').on(table.isPublic)
	]
);

export const usersRelations = relations(users, ({ many }) => ({
	tags: many(userTags),
	posts: many(posts),
	sessions: many(sessions),
	applications: many(applications),
	applicationUploads: many(applicationUploads),
	proxies: many(userProxies, { relationName: 'user' }),
	proxyAs: many(userProxies, { relationName: 'proxy' })
}));

export const userTags = pgTable(
	'user_tags',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		tag: varchar({ length: 100 }).notNull()
	},
	(table) => [
		index('user_tags_user_id_idx').on(table.userId),
		index('user_tags_tag_idx').on(table.tag)
	]
);

export const userTagsRelations = relations(userTags, ({ one }) => ({
	user: one(users, {
		fields: [userTags.userId],
		references: [users.id]
	})
}));

export const userProxies = pgTable(
	'user_proxies',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		proxyId: uuid('proxy_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull()
	},
	(table) => [
		index('user_proxies_user_id_idx').on(table.userId),
		index('user_proxies_proxy_id_idx').on(table.proxyId),
		uniqueIndex('user_proxies_user_id_proxy_id_idx').on(table.userId, table.proxyId)
	]
);

export const userProxiesRelations = relations(userProxies, ({ one }) => ({
	user: one(users, {
		fields: [userProxies.userId],
		references: [users.id],
		relationName: 'user'
	}),
	proxy: one(users, {
		fields: [userProxies.proxyId],
		references: [users.id],
		relationName: 'proxy'
	})
}));
