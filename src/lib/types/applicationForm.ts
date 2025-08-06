export type BaseQuestion = {
	id: string;
	label: string;
	desc?: string;
	required: boolean;
};

export type TextQuestion = BaseQuestion & {
	type: ApplicationFormQuestionType.TEXT;
	min?: number;
	max?: number;
};
export type TextareaQuestion = BaseQuestion & {
	type: ApplicationFormQuestionType.TEXTAREA;
	min?: number;
	max?: number;
};
export type SelectQuestion = BaseQuestion & {
	type: ApplicationFormQuestionType.SELECT;
	options: string[];
};
export type MultiSelectQuestion = BaseQuestion & {
	type: ApplicationFormQuestionType.MULTISELECT;
	options: string[];
	min?: number;
	max?: number;
};
export type FileQuestion = BaseQuestion & {
	type: ApplicationFormQuestionType.FILE;
};

export type ApplicationFormQuestion =
	| TextQuestion
	| TextareaQuestion
	| SelectQuestion
	| MultiSelectQuestion
	| FileQuestion;

export enum ApplicationFormQuestionType {
	TEXT = 1,
	TEXTAREA = 2,
	SELECT = 3,
	MULTISELECT = 4, // Alias for SELECT
	FILE = 5
}

export type InferApplicationFormQuestionAnswer<T extends ApplicationFormQuestionType> =
	T extends ApplicationFormQuestionType.TEXT
		? string
		: T extends ApplicationFormQuestionType.TEXTAREA
			? string
			: T extends ApplicationFormQuestionType.SELECT
				? string
				: T extends ApplicationFormQuestionType.MULTISELECT
					? string[]
					: T extends ApplicationFormQuestionType.FILE
						? string // File upload ID from backend
						: never;

export const applicationFormQuestionTypes = {
	[ApplicationFormQuestionType.TEXT]: 'Single Line Text',
	[ApplicationFormQuestionType.TEXTAREA]: 'Multi Line Text',
	[ApplicationFormQuestionType.SELECT]: 'Dropdown Select',
	[ApplicationFormQuestionType.MULTISELECT]: 'Multi Select',
	[ApplicationFormQuestionType.FILE]: 'File Upload'
};

export type ApplicationFormAnswer<
	T extends ApplicationFormQuestionType = ApplicationFormQuestionType
> = {
	type: T;
	answer: InferApplicationFormQuestionAnswer<T>;
};
