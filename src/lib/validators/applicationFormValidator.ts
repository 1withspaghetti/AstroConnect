import { ApplicationFormQuestionType, type ApplicationForm } from '@/types/applicationForm';
import { z } from 'zod/v4';

export const TEXT_MAX_LENGTH = 1000;
export const TEXTAREA_MAX_LENGTH = 10000;
export const SELECT_MAX_OPTIONS = 10;

export function getApplicationFormSchema(form: ApplicationForm) {
	return z.object(
		form.questions.reduce(
			(acc, question) => {
				acc[question.id] = _questionDefinitionToSchema(question);
				return acc;
			},
			{} as Record<string, z.ZodType<any, any>>
		)
	);
}

function _questionDefinitionToSchema(question: ApplicationForm['questions'][number]) {
	let schema: z.ZodTypeAny;

	switch (question.type) {
		case ApplicationFormQuestionType.TEXT: // TEXT
			schema = z
				.string()
				.min(
					question.min || 0,
					'Minimum length is ' +
						(question.min || 0) +
						' character' +
						(question.min === 1 ? '' : 's')
				)
				.max(
					question.max || TEXT_MAX_LENGTH,
					'Maximum length is ' +
						(question.max || TEXT_MAX_LENGTH) +
						' character' +
						(question.max === 1 ? '' : 's')
				);
			break;
		case ApplicationFormQuestionType.TEXTAREA: // TEXTAREA
			schema = z
				.string()
				.min(
					question.min || 0,
					'Minimum length is ' +
						(question.min || 0) +
						' character' +
						(question.min === 1 ? '' : 's')
				)
				.max(
					question.max || TEXTAREA_MAX_LENGTH,
					'Maximum length is ' +
						(question.max || TEXTAREA_MAX_LENGTH) +
						' character' +
						(question.max === 1 ? '' : 's')
				);
			break;
		case ApplicationFormQuestionType.SELECT: // SELECT
			schema = z.literal(question.options, 'Select one of the options').default('');
			break;
		case ApplicationFormQuestionType.MULTISELECT: // MULTISELECT
			schema = z
				.array(z.enum(question.options))
				.min(
					question.min || 0,
					'Select at least ' + (question.min || 0) + ' option' + (question.min === 1 ? '' : 's')
				)
				.max(
					question.max || SELECT_MAX_OPTIONS,
					'Select at most ' +
						(question.max || SELECT_MAX_OPTIONS) +
						' option' +
						(question.max === 1 ? '' : 's')
				);
			break;
		case ApplicationFormQuestionType.FILE: // FILE
			schema = z.string();
			break;
	}

	if (question.required === false) {
		schema = schema.optional();
	}

	return schema;
}
