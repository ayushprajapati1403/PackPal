import z from "zod";

export const SignupSchema = z.object({
	username: z.string(),
	password: z.string().min(6),
	type: z.enum(['user', 'owner']),
	email: z.string().email(),
	fullname: z.string()

})

export const SigninSchema = z.object({
	username: z.string(),
	password: z.string().min(6),


})

export const EventSchema = z.object({
	creatorId: z.string(),
	description: z.string(),
	eventName: z.string(),
	startDate: z.string()
})


export const CategorySchema = z.object({
	name: z.string(),
	eventId: z.string()
})

export const ItemSchema = z.object({
	name: z.string(),
	categoryId: z.string()
})


export const AssignmentSchema = z.object({
	userId: z.string(),
	eventId: z.string(),
	level: z.enum(['Admin', 'Member', 'Viewer'])
})

export const CommentSchema = z.object({
	text: z.string(),
	itemId: z.string(),
	userId: z.string()
})

export const NotificationSchema = z.object({
	message: z.string(),
	userId: z.string(),
	eventId: z.string()
})


