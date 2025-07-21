export interface User {
	id: string;
	name: string;
	email: string;
	pfp?: string;
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}
