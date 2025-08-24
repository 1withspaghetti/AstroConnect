import z from 'zod/v4';
import { tagValidator } from './descriptionEditFormValidator';

export const profileEditSchema = z.object({
	name: z.string().min(1, 'Display Name is required').max(200, 'Name cannot exceed 200 characters'),
	bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
	careerStage: z.string().max(100, 'Maximum length is 100 characters').optional(),
	major: z.string().max(100, 'Maximum length is 100 characters').optional(),
	tags: z.array(tagValidator).max(25, 'You can add up to 25 tags'),
	isPublic: z.boolean()
});
