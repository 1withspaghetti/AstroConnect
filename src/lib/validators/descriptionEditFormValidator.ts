import dayjs from '@/util/dayjs';
import { z } from 'zod/v4';

export const tagValidator = z
	.string()
	.min(1, 'Minimum length is 1 character')
	.max(100, 'Maximum length is 100 characters');

export const descriptionEditFormSchema = z
	.object({
		title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
		desc: z.string().max(10000, 'Description cannot exceed 10000 characters').optional(),
		positions: z.string().max(100, 'Maximum length is 100 characters').optional(),
		careerStage: z.string().max(100, 'Maximum length is 100 characters').optional(),
		prereq: z.string().max(1000, 'Prerequisite cannot exceed 1000 characters').optional(),
		tags: z.array(tagValidator).max(25, 'You can add up to 25 tags'),
		durationStart: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
			.optional(),
		durationEnd: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
			.optional()
	})
	.superRefine((data, ctx) => {
		if ((data.durationStart && !data.durationEnd) || (data.durationEnd && !data.durationStart)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Both start and end dates are required',
				path: ['durationEnd']
			});
		} else if (data.durationStart && data.durationEnd) {
			let dateStart = dayjs(data.durationStart, 'YYYY-MM-DD', true);
			let dateEnd = dayjs(data.durationEnd, 'YYYY-MM-DD', true);
			if (!dateStart.isValid() || dateStart.isBefore(dayjs('2000-01-01', 'YYYY-MM-DD'))) {
				ctx.addIssue({
					code: 'custom',
					message: 'Invalid start date',
					path: ['durationStart']
				});
			} else if (!dateEnd.isValid() || dateEnd.isBefore(dayjs())) {
				ctx.addIssue({
					code: 'custom',
					message: 'Invalid end date',
					path: ['durationEnd']
				});
			} else if (dateStart.isAfter(dateEnd)) {
				ctx.addIssue({
					code: 'custom',
					message: 'Start date must be before end date',
					path: ['durationStart']
				});
			}
		}
	});
