// 7. notificationRoutes.ts
import { Router, Request, Response } from "express";
import { NotificationSchema } from "../types";
import client from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
export const notificationRoutes = Router();

notificationRoutes.post("/send", authMiddleware, (async (req: Request, res: Response) => {
	const parsed = NotificationSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid notification data" });

	const { message, userId, eventId } = parsed.data;
	const notification = await client.notification.create({ data: { message, userId, eventId } });
	res.json({ message: "Notification sent", notification });

}) as any);


notificationRoutes.get("/user/:userId", authMiddleware, (async (req: Request, res: Response) => {
	const { userId } = req.params;
	const notifications = await client.notification.findMany({ where: { userId } });
	res.json({ notifications });

}) as any);

// Add endpoint to mark notification as read
notificationRoutes.patch("/:notificationId/mark-read", authMiddleware, (async (req: Request, res: Response) => {
	const { notificationId } = req.params;

	try {
		const updatedNotification = await client.notification.update({
			where: { id: notificationId },
			data: { sent: true }
		});

		res.json({ message: "Notification marked as read", notification: updatedNotification });
	} catch (error) {
		console.error("Error marking notification as read:", error);
		res.status(500).json({ message: "Failed to mark notification as read" });
	}
}) as any);
