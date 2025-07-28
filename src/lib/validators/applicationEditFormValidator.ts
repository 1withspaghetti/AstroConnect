import { ApplicationFormQuestionType as QType } from '@/types/applicationForm';
import { z } from 'zod/v4';
import { SELECT_MAX_OPTIONS, TEXT_MAX_LENGTH, TEXTAREA_MAX_LENGTH } from './applicationFormValidator';

export const optionSchema = z.string().min(1, "Option must be at least 1 character").max(100, "Option must be at most 100 characters");

const textValidator = z.object({
	type: z.literal(QType.TEXT),
	min: z.number().min(0, "Value must be at least 0").optional(),
	max: z.number().min(1, "Applicants must be able to enter at least 1 character").max(TEXT_MAX_LENGTH, `Max ${TEXT_MAX_LENGTH} characters`).optional(),
});

const textareaValidator = z.object({
	type: z.literal(QType.TEXTAREA),
	min: z.number().min(0, "Value must be at least 0").optional(),
	max: z.number().min(1, "Applicants must be able to enter at least 1 character").max(TEXTAREA_MAX_LENGTH, `Max ${TEXTAREA_MAX_LENGTH} characters`).optional(),
});

const selectValidator = z.object({
	type: z.literal(QType.SELECT),
	options: z.array(optionSchema).min(2, "At least two options are required").max(SELECT_MAX_OPTIONS, "Max 10 available options"),
});

const multiselectValidator = z.object({
	type: z.literal(QType.MULTISELECT),
	options: z.array(optionSchema).min(2, "At least two options are required").max(SELECT_MAX_OPTIONS, "Max 10 available options"),
	min: z.number().min(1, "Min 1 option can be selected").optional(),
	max: z.number().min(1, "Min 1 option can be selected").max(SELECT_MAX_OPTIONS, "Max 10 option can be selected").optional(),
});

const fileValidator = z.object({
	type: z.literal(QType.FILE),
});

export const applicationEditFormFieldSchema = z.discriminatedUnion("type", [
	textValidator,
	textareaValidator,
	selectValidator,
	multiselectValidator,
	fileValidator,
]).and(z.object({
	label: z.string().min(1, "Min 1 character").max(250, "Max 250 characters"),
	desc: z.string().max(1000, "Max 1000 characters").optional(),
	required: z.boolean(),
}));