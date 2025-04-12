import { Router, Request, Response } from "express";
import { AssignmentSchema } from "../types";
import client from "../../../db/src/index";
import { Permission } from "../../../db/src/index";


export const assignmentRoutes = Router();

assignmentRoutes.post("/assign", (async (req: Request, res: Response) => {
	const parsed = AssignmentSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid assignment data" });

	const { userId, eventId, level } = parsed.data;
	const assignment = await client.assignment.create({
		data: {
			userId,
			eventId,
			level: level as keyof typeof Permission
		}
	});
	res.json({ message: "User assigned", assignment });
}) as any);


assignmentRoutes.get("/user/:userId", async (req, res) => {
	const { userId } = req.params;
	const assignments = await client.assignment.findMany({
		where: { userId },
		include: { event: true, categories: true, items: true },
	});
	res.json({ assignments });
});
