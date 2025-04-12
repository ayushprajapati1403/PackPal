import { Router, Request, Response } from "express";
import { EventSchema } from "../types";
import client from "../../../db/src/index"
import { authMiddleware } from "../middleware/authMiddleware";

export const eventRoutes = Router();

// Get all events
eventRoutes.get("/", authMiddleware, async (req, res) => {
	try {
		const events = await client.event.findMany({
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: true
			},
		});
		res.json(events);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch events" });
	}
});

// Create new event
eventRoutes.post("/add", (async (req: Request, res: Response) => {
	const parsed = EventSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
	const { eventName, description, startDate, creatorId } = parsed.data;

	try {
		const event = await client.event.create({
			data: {
				eventName,
				description,
				startDate: new Date(startDate),
				creatorId
			},
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: true
			}
		});
		res.json({ message: "Event created", event });
	} catch (error) {
		res.status(500).json({ message: "Failed to create event" });
	}
}) as any);

// Get events by creator
eventRoutes.get("/creator/:creatorId", async (req, res) => {
	const { creatorId } = req.params;
	try {
		const events = await client.event.findMany({
			where: { creatorId },
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: true
			},
		});
		res.json({ events });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch events" });
	}
});

// Update event
eventRoutes.put("/:eventId", (async (req: Request, res: Response) => {
	const { eventId } = req.params;
	const parsed = EventSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

	try {
		const event = await client.event.update({
			where: { eventId: eventId },
			data: parsed.data,
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: true
			}
		});
		res.json({ message: "Event updated", event });
	} catch (error) {
		res.status(500).json({ message: "Failed to update event" });
	}
}) as any);

// Delete event
eventRoutes.delete("/:eventId", async (req, res) => {
	const { eventId } = req.params;
	try {
		await client.event.delete({
			where: { eventId: eventId }
		});
		res.json({ message: "Event deleted" });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete event" });
	}
});

// Invite user to event
eventRoutes.post("/:eventId/invite", (async (req: Request, res: Response) => {
	const { eventId } = req.params;
	const { email, level } = req.body;

	try {
		// Find user by email
		const user = await client.user.findUnique({
			where: { email }
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Create assignment
		const assignment = await client.assignment.create({
			data: {
				eventId,
				userId: user.id,
				level
			}
		});

		res.json({ message: "User invited", assignment });
	} catch (error) {
		res.status(500).json({ message: "Failed to invite user" });
	}
}) as any);
