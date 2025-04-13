export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	username?: string;
}

export interface Event {
	id: string;
	eventId: string;
	name: string;
	description: string;
	date: string;
	startDate: string;
	members: User[];
	assignments?: Assignment[];
	categories: Category[];
	permission: string;
	isCreator: boolean;
}

export interface Category {
	id: string;
	name: string;
	items: Item[];
	assignmentId?: string;
}

export interface Item {
	id: string;
	name: string;
	isPacked: boolean;
	isDelivered?: boolean;
	categoryId: string;
	assignmentId?: string;
}

export interface Assignment {
	id: string;
	userId: string;
	eventId: string;
	level: Permission;
	categories?: Category[];
	items?: Item[];
}

export enum Permission {
	Admin = 'Admin',
	Member = 'Member',
	Viewer = 'Viewer'
} 