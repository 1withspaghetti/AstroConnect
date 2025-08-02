export interface UserPreview {
	id: string;
	name: string;
	email: string;
	pfp?: string;
	bio?: string;
}

export interface User extends UserPreview {
	isPublic: boolean;
	isAdmin: boolean;
	firstLogin: string;
	lastLogin: string;
}
