import { z } from 'zod/v4';

export const settingsEditSchema = z.object({
	sendSubmissionEmails: z.boolean(),
	alternateEmail: z.union([
		z.email('Invalid Email').max(500, 'Email must be at most 500 characters long').optional(),
		z.literal('')
	])
});
