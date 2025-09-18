import type { ApplicationFormQuestion } from './applicationForm';
import type { UserProfile } from './user';

export interface PostMinimal {
	id: string;
	isDraft: boolean;
	title: string;
	isOpen: boolean;
	createdAt: Date;
	publishedAt: Date | null;
}

export interface PostPreview extends PostMinimal {
	desc: string;
	images: string[];
	positions: string;
	timeCommitment: string;
	tags: string[];
	careerStage: string;
	prereq: string;
	durationStart: string | null;
	durationEnd: string | null;
	closesAt: Date | null;
	maxSlots: number | null;
	applications: number;
	owner: UserProfile;
}

export interface Post extends PostPreview {
	questions: ApplicationFormQuestion[];
}

export const defaultCareerStageLevels = [
	'Pre-Major',
	'Novice Undergraduate',
	'Experienced Undergraduate',
	'Undergraduate',
	'Post-Baccalaureate',
	'1st Year Graduate Student',
	'2nd Year Graduate Student',
	'Graduate Student',
	'Post-Doc',
	'Research/Staff Scientist',
	'Faculty',
	'Department Staff',
	'Collaborator',
	'External Collaborator'
];

export interface PostImage {
	id: string;
	url: string;
	order: number;
}
