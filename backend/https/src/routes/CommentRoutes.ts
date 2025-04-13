import { Router, Request, Response } from "express";
import { CommentSchema } from "../types";
import client from "../../../db/src/index";
import { authMiddleware } from "../middleware/authMiddleware";

export const commentRoutes = Router();

commentRoutes.post("/add", authMiddleware, (async (req: Request, res: Response) => {
	const parsed = CommentSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid comment data" });

	const { text, itemId, userId } = parsed.data;
	const comment = await client.comment.create({ data: { text, itemId, userId } });
	res.json({ message: "Comment added", comment });
}) as any);


commentRoutes.get("/item/:itemId", authMiddleware, (async (req: Request, res: Response) => {
	const { itemId } = req.params;
	const comments = await client.comment.findMany({
		where: { itemId },
		include: { user: true },
	});
	res.json({ comments });
}) as any);
