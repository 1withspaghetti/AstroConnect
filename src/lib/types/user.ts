export interface UserPreview {
	id: string;
	name: string;
	email: string;
	pfp: string | null;
}

export interface UserProfile extends UserPreview {
	bio: string;
	careerStage: string;
	major: string;
	tags: string[];
	isAdmin: boolean;
}

export interface User extends UserProfile {
	isPublic: boolean;
	firstLogin: Date;
	lastLogin: Date;
}

export interface SessionUser extends UserPreview {
	isAdmin: boolean;
}
