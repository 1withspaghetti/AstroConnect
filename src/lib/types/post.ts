import type { ApplicationFormQuestion } from './applicationForm';
import type { UserProfile } from './user';

export interface PostMinimal {
	id: string;
	isDraft: boolean;
	title: string;
	isOpen: boolean;
	createdAt: Date;
}

export interface PostPreview extends PostMinimal {
	desc: string;
	images: string[];
	tags: string[];
	careerStage: string;
	prereq: string;
	closesAt: Date | null;
	maxSlots: number | null;
	applications: number;
	owner: UserProfile;
}

export interface Post extends PostPreview {
	durationStart: string | null;
	durationEnd: string | null;
	questions: ApplicationFormQuestion[];
}

export const defaultTags = [
	'Astrobiology',
	'Astrophysical processes',
	'Cosmology',
	'Exoplanets',
	'Galactic and extragalactic astronomy',
	'High energy astrophysics',
	'Interdisciplinary astronomy',
	'Interstellar medium',
	'Observational astronomy',
	'Solar physics',
	'Solar system astronomy',
	'Stellar astronomy'
];

export const defaultCareerStageLevels = [
	'Novice Undergraduate',
	'Experienced Undergraduate',
	'Undergraduate',
	'Post-Baccalaureate',
	'Graduate',
	'Post-Graduate',
	'Post-Doctoral',
	'Research/Staff Scientist Collaborator',
	'Faculty Collaborator'
];

export interface PostImage {
	id: string;
	url: string;
	order: number;
}
