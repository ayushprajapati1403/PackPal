export interface Category {
	id: string;
	name: string;
	description?: string;
	assignmentId?: string;
	eventId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Event {
	id: string;
	name: string;
	eventName: string;
	description: string;
	startDate: string;
	endDate: string;
	status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED';
	categories?: Category[];
	assignments?: Assignment[];
	createdAt: string;
	updatedAt: string;
}

export interface Assignment {
	id: string;
	userId: string;
	eventId: string;
	role: 'ADMIN' | 'MEMBER' | 'VIEWER';
	categories?: Category[];
	user?: {
		id: string;
		username: string;
		email: string;
	};
	createdAt: string;
	updatedAt: string;
} 