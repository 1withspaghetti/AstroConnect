import { z } from 'zod';

export const searchSchema = z.object({
	query: z.string().max(128).optional()
});
