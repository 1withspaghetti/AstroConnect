import { ApplicationFormQuestionType as QType } from '@/types/applicationForm';
import { z } from 'zod/v4';
import { SELECT_MAX_OPTIONS, TEXT_MAX_LENGTH, TEXTAREA_MAX_LENGTH } from './applicationFormValidator';

export const descriptionEditFormSchema = z.object({
	type: z.enum(QType, "Invalid question type"),
	label: z.string().min(1, "Min 1 character").max(250, "Max 250 characters"),
	desc: z.string().max(1000, "Max 1000 characters").optional(),
	required: z.boolean(),
	// Additional properties for specific question types
	min: z.number().min(0, "Value must be at least 0").optional(),
	max: z.number().min(1, "Applicants must be able to enter at least 1 character").optional(),
	options: z.array(z.string()).min(2, "At least two options are required").max(SELECT_MAX_OPTIONS, "Max 10 available options").optional(),
}).superRefine((data, ctx) => {
	if (!(data.type === QType.TEXT || data.type === QType.TEXTAREA || data.type === QType.SELECT || data.type === QType.MULTISELECT) && (data.min || data.max)) {
		return ctx.addIssue({
			code: "unrecognized_keys",
			message: "Min and max values are only applicable for TEXT, TEXTAREA, SELECT, and MULTISELECT types",
			input: data,
			keys: ["min", "max"],
		});
	}

	if (!(data.type === QType.SELECT || data.type === QType.MULTISELECT) && data.options) {
		return ctx.addIssue({
			code: "unrecognized_keys",
			message: "Options are only applicable for SELECT and MULTISELECT types",
			input: data,
			keys: ["options"],
		});
	}

	if (data.type === QType.TEXT) {
		if (data.max && data.max > TEXT_MAX_LENGTH) {
			return ctx.addIssue({
				code: "too_big",
				message: `Max character value must be less than or equal to ${TEXT_MAX_LENGTH}`,
				maximum: TEXT_MAX_LENGTH,
				input: data.max,
				origin: "number",
				path: ["max"]
			});
		}
	} else if (data.type === QType.TEXTAREA) {
		if (data.max && data.max > TEXTAREA_MAX_LENGTH) {
			return ctx.addIssue({
				code: "too_big",
				message: `Max character value must be less than or equal to ${TEXTAREA_MAX_LENGTH}`,
				maximum: TEXTAREA_MAX_LENGTH,
				input: data.max,
				origin: "number",
				path: ["max"]
			});
		}
	} else if (data.type === QType.SELECT || data.type === QType.MULTISELECT) {
		if (data.options && data.options.length > SELECT_MAX_OPTIONS) {
			return ctx.addIssue({
				code: "too_big",
				message: `Max options must be less than or equal to ${SELECT_MAX_OPTIONS}`,
				maximum: SELECT_MAX_OPTIONS,
				input: data.options.length,
				origin: "array",
				path: ["options"]
			});
		}
	}

	let maxMaxValue = data.type === QType.TEXT ? TEXT_MAX_LENGTH : data.type === QType.TEXTAREA ? TEXTAREA_MAX_LENGTH : SELECT_MAX_OPTIONS;

	if ((data.min || 0) > (data.max || maxMaxValue)) {
		return ctx.addIssue({
			code: "custom",
			message: "Min character value must be less than or equal to max character value",
			path: ["min"]
		});
	}
});
