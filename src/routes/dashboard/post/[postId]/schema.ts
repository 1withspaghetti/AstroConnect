import {
	ApplicationFormQuestionType,
	type ApplicationForm,
	type InferApplicationFormQuestionAnswer
} from '@/types/applicationForm';
import { z } from 'zod';

export function getApplicationFormSchema(form: ApplicationForm) {
	return z.object(
		form.questions.reduce(
			(acc, question) => {
				switch (question.type) {
					case ApplicationFormQuestionType.TEXT: // TEXT
						acc[question.id] = z.string().min(question.min).max(question.max);
						break;
					case ApplicationFormQuestionType.TEXTAREA: // TEXTAREA
						acc[question.id] = z.string().min(question.min).max(question.max);
						break;
					case ApplicationFormQuestionType.SELECT: // SELECT
						acc[question.id] = z
							.array(z.enum(question.options as [string, ...string[]]))
							.refine(
								(val) => question.multiple || val.length === 1,
								'Must select exactly one option'
							);
						break;
					case ApplicationFormQuestionType.FILE: // FILE
						acc[question.id] = z.string();
						break;
				}
				if (!question.required) {
					acc[question.id] = acc[question.id].optional();
				}
				return acc;
			},
			{} as Record<string, z.ZodTypeAny>
		)
	);
}

// export type InferSchemaFromApplicationForm<T extends ApplicationForm> = z.ZodObject<{
//     [K in ApplicationForm['questions'][number]['id']]: InferApplicationFormQuestionAnswer<
//         Extract<ApplicationForm['questions'][number], { id: K }>
//     >
// }>
