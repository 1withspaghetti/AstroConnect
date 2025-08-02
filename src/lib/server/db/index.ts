import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import * as userSchema from './schema/user';
import * as postSchema from './schema/post';
import * as applicationSchema from './schema/application';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = neon(env.DATABASE_URL);

export const db = drizzle(client, {
	schema: {
		...userSchema,
		...postSchema,
		...applicationSchema
	},
	casing: 'snake_case'
});
