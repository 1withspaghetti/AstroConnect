import z from 'zod/v4';

export const acceptingResponsesFormSchema = z.object({
	isOpen: z.boolean(),
	closesAt: z
		.date()
		.min(new Date(), 'Closing date must be in the future')
		.max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Closing date must be within one year')
		.optional()
});
