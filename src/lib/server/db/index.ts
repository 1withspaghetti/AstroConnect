import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import * as sessionSchema from './schema/session';
import * as userSchema from './schema/user';
import * as postSchema from './schema/post';
import * as applicationSchema from './schema/application';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = neon(env.DATABASE_URL);

export const table = {
	...userSchema,
	...postSchema,
	...applicationSchema,
	...sessionSchema
};

export const db = drizzle(client, {
	schema: table,
	casing: 'snake_case'
});
