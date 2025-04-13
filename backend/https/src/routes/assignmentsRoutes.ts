import { Router, Request, Response } from "express";
import { AssignmentSchema } from "../types";
import client from "../../../db/src/index";
import { Permission } from "../../../db/src/index";
import { authMiddleware } from "../middleware/authMiddleware";


export const assignmentRoutes = Router();

assignmentRoutes.post("/assign", authMiddleware, (async (req: Request, res: Response) => {
	const parsed = AssignmentSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid assignment data" });

	const { userId, eventId, level, categories } = req.body;

	// Create the assignment
	const assignment = await client.assignment.create({
		data: {
			userId,
			eventId,
			level: level as keyof typeof Permission,
			// Connect categories to the assignment if provided
			categories: categories && categories.length > 0 ? {
				connect: categories.map((categoryId: string) => ({ id: categoryId }))
			} : undefined
		}
	});

	// Fetch the complete assignment with categories
	const completeAssignment = await client.assignment.findUnique({
		where: {
			id: assignment.id
		},
		include: {
			categories: true,
			user: true,
			event: true
		}
	});

	res.json({ message: "User assigned", assignment: completeAssignment });
}) as any);


assignmentRoutes.get("/user/:userId", authMiddleware, (async (req: Request, res: Response) => {
	const { userId } = req.params;
	const assignments = await client.assignment.findMany({
		where: { userId },
		include: { event: true, categories: true, items: true },
	});
	res.json({ assignments });
}) as any);
