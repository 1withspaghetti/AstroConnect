export type ApplicationFormQuestion = {
	id: string;
	type: ApplicationFormQuestionType;
	label: string;
	desc?: string;
	required: boolean;
} & (
	| {
			type: ApplicationFormQuestionType.TEXT;
			min?: number;
			max?: number;
	  }
	| {
			type: ApplicationFormQuestionType.TEXTAREA;
			min?: number;
			max?: number;
	  }
	| {
			type: ApplicationFormQuestionType.SELECT;
			options: string[];
	  }
	| {
			type: ApplicationFormQuestionType.MULTISELECT;
			options: string[];
			min?: number;
			max?: number;
	  }
	| {
			type: ApplicationFormQuestionType.FILE;
	  }
);

export enum ApplicationFormQuestionType {
	TEXT = 1,
	TEXTAREA = 2,
	SELECT = 3,
	MULTISELECT = 4, // Alias for SELECT
	FILE = 5
}

export type InferApplicationFormQuestionAnswer<T extends ApplicationFormQuestion> =
	T['type'] extends ApplicationFormQuestionType.TEXT
		? string
		: T['type'] extends ApplicationFormQuestionType.TEXTAREA
			? string
			: T['type'] extends ApplicationFormQuestionType.SELECT
				? string
				: T['type'] extends ApplicationFormQuestionType.MULTISELECT
					? string[]
					: T['type'] extends ApplicationFormQuestionType.FILE
						? string // File upload ID from backend
						: never;

export const applicationFormQuestionTypes = {
	[ApplicationFormQuestionType.TEXT]: 'Single Line Text',
	[ApplicationFormQuestionType.TEXTAREA]: 'Multi Line Text',
	[ApplicationFormQuestionType.SELECT]: 'Dropdown Select',
	[ApplicationFormQuestionType.MULTISELECT]: 'Multi Select',
	[ApplicationFormQuestionType.FILE]: 'File Upload'
};
