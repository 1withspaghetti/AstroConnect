export interface UserPreview {
	id: string;
	name: string;
	email: string;
	pfp: string | null;
}

export interface UserProfile extends UserPreview {
	bio: string;
}

export interface User extends UserPreview {
	isPublic: boolean;
	isAdmin: boolean;
}

export interface SessionUser extends UserPreview {
	isAdmin: boolean;
}
