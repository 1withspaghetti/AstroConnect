export interface UserPreview {
	id: number;
	name: string;
	email: string;
	pfp: string | null;
	bio: string;
}

export interface User extends UserPreview {
	isPublic: boolean;
	isAdmin: boolean;
}
