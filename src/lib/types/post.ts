import type { User } from './user';

export interface PostPreview {
	id: number;
	title: string;
	desc?: string;
	images: string[];
	tags: string[];
	experience?: string;
	prereq?: string;
	open: boolean;
	createdAt: string;
	createdBy: User;
}

export const defaultExperienceLevels = [
	'Undergraduate',
	'1st Year Undergraduate',
	'2nd Year Undergraduate',
	'3rd Year Undergraduate',
	'>=4th Year Undergraduate',
	'Post-Bachelor',
	'Graduate',
	'1st Year Graduate',
	'2nd Year Graduate',
	'>=3rd Year Graduate',
	'Post-Graduate',
	'Post-Doctoral',
	'Research/Staff Scientist Collaborator',
	'Faculty Collaborator'
];
