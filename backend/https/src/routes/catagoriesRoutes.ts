// 3. categoryRoutes.ts
import { Router, Request, Response } from "express";
import { CategorySchema } from "../types";
import client from "../../../db/src/index";
import { authMiddleware } from "../middleware/authMiddleware";
export const categoryRoutes = Router();

categoryRoutes.post("/add", authMiddleware, (async (req: Request, res: Response) => {
	const parsed = CategorySchema.safeParse(req.body);
	console.log(parsed);
	console.log(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid category data" });

	const { categoryName, eventId } = parsed.data;
	const category = await client.category.create({ data: { name: categoryName, eventId } });
	res.json({ message: "Category created", category });
}) as any);

categoryRoutes.get("/event/:eventId", authMiddleware, (async (req: Request, res: Response) => {
	const { eventId } = req.params;
	const categories = await client.category.findMany({ where: { eventId } });
	res.json({ categories });
}) as any);


categoryRoutes.delete("/:categoryId", authMiddleware, (async (req: Request, res: Response) => {
	const { categoryId } = req.params;
	await client.category.delete({ where: { id: categoryId } });
	res.json({ message: "Category deleted" });
}) as any);

categoryRoutes.post("/:categoryId/items", authMiddleware, (async (req: Request, res: Response) => {
	const { categoryId } = req.params;
	const { name } = req.body;

	try {
		// Create the item and connect it to the category in one operation
		const updatedCategory = await client.category.update({
			where: { id: categoryId },
			data: {
				items: {
					create: {
						name
					}
				}
			},
			include: {
				items: true
			}
		});

		res.json({ message: "Item added to category", category: updatedCategory });
	} catch (error) {
		console.error('Error adding item to category:', error);
		res.status(500).json({ message: "Failed to add item to category" });
	}
}) as any);

categoryRoutes.delete("/:categoryId/items/:itemId", authMiddleware, (async (req: Request, res: Response) => {
	const { categoryId, itemId } = req.params;
	try {
		// First, check if the item exists
		const item = await client.item.findUnique({ where: { id: itemId } });
		if (!item) {
			return res.status(404).json({ message: "Item not found" });
		}

		// Then, delete the item directly
		await client.item.delete({ where: { id: itemId } });
		res.json({ message: "Item removed from category" });
	} catch (error) {
		console.error('Error deleting item:', error);
		res.status(500).json({ message: "Failed to delete item" });
	}
}) as any);


