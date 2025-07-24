export interface ApplicationForm {
	id: number;
	postId: number;
	questions: ApplicationFormQuestion[];
}

export type ApplicationFormQuestion = {
	id: string;
	type: ApplicationFormQuestionType;
	label: string;
	desc?: string;
	required: boolean;
} & (
	| {
			type: ApplicationFormQuestionType.TEXT;
			min: number;
			max: number;
	  }
	| {
			type: ApplicationFormQuestionType.TEXTAREA;
			min: number;
			max: number;
	  }
	| {
			type: ApplicationFormQuestionType.SELECT;
			options: string[];
			multiple: boolean;
	  }
	| {
			type: ApplicationFormQuestionType.FILE;
	  }
);

export enum ApplicationFormQuestionType {
	TEXT = 1,
	TEXTAREA = 2,
	SELECT = 3,
	FILE = 4
}

export type InferApplicationFormQuestionAnswer<T extends ApplicationFormQuestion> =
	T['type'] extends ApplicationFormQuestionType.TEXT
		? string
		: T['type'] extends ApplicationFormQuestionType.TEXTAREA
			? string
			: T['type'] extends ApplicationFormQuestionType.SELECT
				? string[]
				: T['type'] extends ApplicationFormQuestionType.FILE
					? string // File upload ID from backend
					: never;

export const applicationFormQuestionTypes = {
	[ApplicationFormQuestionType.TEXT]: 'Single Line Text',
	[ApplicationFormQuestionType.TEXTAREA]: 'Multi Line Text',
	[ApplicationFormQuestionType.SELECT]: 'Select',
	[ApplicationFormQuestionType.FILE]: 'File Upload'
};
