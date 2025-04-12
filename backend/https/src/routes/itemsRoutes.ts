import { Router, Request, Response } from "express";
import { ItemSchema } from "../types";
import client from "../../../db/src/index";

export const itemRoutes = Router();

itemRoutes.post("/add", (async (req: Request, res: Response) => {
	const parsed = ItemSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid item data" });

	const { name, categoryId } = parsed.data;
	const item = await client.item.create({ data: { name, categoryId } });
	res.json({ message: "Item created", item });
}) as any);

itemRoutes.patch("/:id/toggle", (async (req: Request, res: Response) => {
	const id = req.params.id;
	const item = await client.item.findUnique({ where: { id } });
	if (!item) return res.status(404).json({ message: "Item not found" });
	const updated = await client.item.update({
		where: { id },
		data: { isPacked: !item.isPacked },
	});
	res.json({ message: "Item updated", updated });
}) as any);
