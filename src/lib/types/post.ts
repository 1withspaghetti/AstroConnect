import type { User } from './user';

export interface PostPreview {
	id: number;
	title: string;
	desc?: string;
	images: string[];
	tags: string[];
	careerStage?: string;
	prereq?: string;
	open: boolean;
	closesAt?: string;
	slotsRemaining?: number;
	createdAt: string;
	createdBy: User;
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
