import type { ApplicationFormQuestion } from './applicationForm';
import type { User } from './user';

export interface PostMinimal {
	id: number;
	isDraft: boolean;
	title: string;
	isOpen: boolean;
	createdAt: Date;
}

export interface PostPreview extends PostMinimal {
	desc?: string;
	images: string[];
	tags: string[];
	careerStage?: string;
	prereq?: string;
	closesAt?: Date;
	slotsRemaining?: number;
	owner: User;
}

export interface Post extends PostPreview {
	questions: ApplicationFormQuestion[];
}

export const defaultCareerStageLevels = [
	'Undergraduate',
	'Post-Bachelor',
	'Graduate',
	'Post-Graduate',
	'Post-Doctoral',
	'Research/Staff Scientist Collaborator',
	'Faculty Collaborator'
];
