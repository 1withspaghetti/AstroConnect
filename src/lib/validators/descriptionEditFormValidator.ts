import { z } from 'zod/v4';

export const tagValidator = z
	.string()
	.min(1, 'Minimum length is 1 character')
	.max(100, 'Maximum length is 100 characters');

export const descriptionEditFormSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
	desc: z.string().max(10000, 'Description cannot exceed 10000 characters').optional(),
	careerStage: tagValidator.optional(),
	prereq: z.string().max(1000, 'Prerequisite cannot exceed 1000 characters').optional(),
	tags: z.array(tagValidator).max(25, 'You can add up to 25 tags')
});
