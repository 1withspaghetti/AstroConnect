import { ApplicationFormQuestionType as QType } from '@/types/applicationForm';
import { z } from 'zod/v4';
import {
	SELECT_MAX_OPTIONS,
	TEXT_MAX_LENGTH,
	TEXTAREA_MAX_LENGTH
} from './applicationFormValidator';

export const optionSchema = z
	.string()
	.min(1, 'Option must be at least 1 character')
	.max(100, 'Option must be at most 100 characters');

export const baseSchema = z.object({
	id: z
		.string()
		.min(1, 'Min 1 character')
		.max(300, 'Max 300 characters')
		.regex(/[\w]+/, 'Not a valid ID'),
	label: z.string().min(1, 'Min 1 character').max(250, 'Max 250 characters'),
	desc: z.string().max(1000, 'Max 1000 characters').optional(),
	required: z.boolean()
});

export const textSchema = baseSchema.extend({
	type: z.literal(QType.TEXT),
	min: z.number().min(0, 'Value must be at least 0').optional(),
	max: z
		.number()
		.min(1, 'Applicants must be able to enter at least 1 character')
		.max(TEXT_MAX_LENGTH, `Max ${TEXT_MAX_LENGTH} characters`)
		.optional()
});

export const textareaSchema = baseSchema.extend({
	type: z.literal(QType.TEXTAREA),
	min: z.number().min(0, 'Value must be at least 0').optional(),
	max: z
		.number()
		.min(1, 'Applicants must be able to enter at least 1 character')
		.max(TEXTAREA_MAX_LENGTH, `Max ${TEXTAREA_MAX_LENGTH} characters`)
		.optional()
});

export const selectSchema = baseSchema.extend({
	type: z.literal(QType.SELECT),
	options: z
		.array(optionSchema)
		.min(2, 'At least two options are required')
		.max(SELECT_MAX_OPTIONS, 'Max 10 available options')
});

export const multiselectSchema = baseSchema.extend({
	type: z.literal(QType.MULTISELECT),
	options: z
		.array(optionSchema)
		.min(2, 'At least two options are required')
		.max(SELECT_MAX_OPTIONS, 'Max 10 available options'),
	min: z.number().min(1, 'Min 1 option can be selected').optional(),
	max: z
		.number()
		.min(1, 'Min 1 option can be selected')
		.max(SELECT_MAX_OPTIONS, 'Max 10 option can be selected')
		.optional()
});

export const fileSchema = baseSchema.extend({
	type: z.literal(QType.FILE)
});

export const applicationEditFormFieldSchema = z.discriminatedUnion('type', [
	textSchema,
	textareaSchema,
	selectSchema,
	multiselectSchema,
	fileSchema
]);

export const applicationEditFormSchema = z.object({
	isOpen: z.boolean(),
	closesAt: z
		.date()
		.min(new Date(), 'Closing date must be in the future')
		.max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Closing date must be within one year')
		.optional(),
	maxSlots: z.number().min(1, 'Must be at least 1').optional(),
	questions: z.array(applicationEditFormFieldSchema).max(25, 'Max 25 questions are allowed')
});
