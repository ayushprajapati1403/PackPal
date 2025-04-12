// 7. notificationRoutes.ts
import { Router, Request, Response } from "express";
import { NotificationSchema } from "../types";
import client from "../../../db/src/index";

export const notificationRoutes = Router();

notificationRoutes.post("/send", (async (req: Request, res: Response) => {
	const parsed = NotificationSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid notification data" });

	const { message, userId, eventId } = parsed.data;
	const notification = await client.notification.create({ data: { message, userId, eventId } });
	res.json({ message: "Notification sent", notification });
}) as any);


notificationRoutes.get("/user/:userId", (async (req: Request, res: Response) => {
	const { userId } = req.params;
	const notifications = await client.notification.findMany({ where: { userId } });
	res.json({ notifications });
}) as any);
