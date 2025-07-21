export interface User {
	id: string;
	name: string;
	email: string;
	pfp?: string;
	bio?: string;
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}
