export interface User {
	id: string;
	name: string;
	email: string;
	pfp?: string;
	bio?: string;
	isPublic: boolean;
	isAdmin: boolean;
	firstLogin: string;
	lastLogin?: string;
}
