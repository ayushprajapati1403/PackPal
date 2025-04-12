// 3. categoryRoutes.ts
import { Router, Request, Response } from "express";
import { CategorySchema } from "../types";
import client from "../../../db/src/index";

export const categoryRoutes = Router();

categoryRoutes.post("/add", (async (req: Request, res: Response) => {
	const parsed = CategorySchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid category data" });

	const { name, eventId } = parsed.data;
	const category = await client.category.create({ data: { name, eventId } });
	res.json({ message: "Category created", category });
}) as any);
