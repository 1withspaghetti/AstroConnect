import z from 'zod/v4';

export const profileEditSchema = z.object({
	name: z.string().min(1, 'Display Name is required').max(200, 'Name cannot exceed 200 characters'),
	pfp: z
		.url('Profile picture must be a valid URL')
		.max(500, 'Profile picture URL cannot exceed 500 characters')
		.optional(),
	bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
	isPublic: z.boolean()
});
