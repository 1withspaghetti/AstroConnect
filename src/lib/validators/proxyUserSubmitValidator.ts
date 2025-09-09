import z from 'zod/v4';

export const proxyUserSubmitSchema = z.object({
	email: z.email('Invalid email address').max(500, 'Email must be at most 500 characters long')
});
