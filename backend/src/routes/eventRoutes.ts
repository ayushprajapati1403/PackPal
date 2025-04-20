import { Router, Request, Response, RequestHandler } from "express";
import { EventSchema } from "../types";
import client from "../db"
import { authMiddleware } from "../middleware/authMiddleware";

export const eventRoutes = Router();

// Get all events
// eventRoutes.get("/", authMiddleware, async (req, res) => {
// 	try {
// 		const events = await client.event.findMany({
// 			include: {
// 				categories: {
// 					include: {
// 						items: true
// 					}
// 				},
// 				assignments: true
// 			},
// 		});
// 		res.json(events);
// 	} catch (error) {
// 		res.status(500).json({ message: "Failed to fetch events" });
// 		console.error(error);
// 	}
// });

// Create new event
eventRoutes.post("/add", authMiddleware, (async (req: Request & { user?: { id: string } }, res: Response) => {
	const parsed = EventSchema.safeParse(req.body);
	console.log(req.body);
	if (!parsed.success) {
		console.log("Invalid data:", parsed.error);
		res.status(400).json({ message: "Invalid data" });
		return;
	}

	const { eventName, description, startDate } = parsed.data;

	const userId = req.user?.id;
	if (!req.user?.id) {
		res.status(401).json({ message: "User not authenticated" });
		return;
	}

	try {
		const event = await client.event.create({
			data: {
				eventName,
				description,
				startDate: new Date(startDate),
				creatorId: userId!
			},
			include: {
				categories: {
					include: {
						items: true
					}
				}
			}
		});
		res.json(event);
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ message: "Failed to create event" });
	}
}) as RequestHandler);

// Get events by creator or assignments
eventRoutes.get("/my-events", authMiddleware, async (req: Request & { user?: any }, res: Response) => {
	try {
		const userId = req.user?.id;

		// Get events where user is creator
		const createdEvents = await client.event.findMany({
			where: { creatorId: userId },
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: {
					include: {
						user: true,
						categories: true
					}
				}
			},
		});

		// Add isCreator flag to created events
		const processedCreatedEvents = createdEvents.map((event: any) => ({
			...event,
			permission: 'Owner',
			isCreator: true
		}));

		// Get events where user is assigned (member or viewer)
		const assignedEvents = await client.event.findMany({
			where: {
				assignments: {
					some: {
						userId: userId
					}
				}
			},
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: {
					include: {
						user: true,
						categories: true
					}
				}
			},
		});

		// Process assigned events to filter categories based on user role
		const processedAssignedEvents = assignedEvents.map((event: any) => {
			// Find user's assignment for this event
			const userAssignment = event.assignments.find((a: any) => a.userId === userId);

			if (!userAssignment) {
				// Add default properties if no assignment found
				return {
					...event,
					permission: 'Unknown',
					isCreator: false
				};
			}

			// If user is a member, only include assigned categories
			if (userAssignment.level === 'Member') {
				const assignedCategoryIds = userAssignment.categories.map((c: any) => c.id);
				return {
					...event,
					categories: event.categories.filter((c: any) => assignedCategoryIds.includes(c.id)),
					permission: 'Member',
					isCreator: false
				};
			}

			// If user is a viewer, include all categories but with limited permissions
			if (userAssignment.level === 'Viewer') {
				return {
					...event,
					permission: 'Viewer',
					isCreator: false
				};
			}

			// Default case
			return {
				...event,
				permission: 'Unknown',
				isCreator: false
			};
		});

		// Combine and deduplicate events
		const allEvents = [...processedCreatedEvents];
		processedAssignedEvents.forEach((assignedEvent: any) => {
			if (!allEvents.some((event: any) => event.eventId === assignedEvent.eventId)) {
				allEvents.push(assignedEvent);
			}
		});

		res.json({ events: allEvents });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch your events" });
	}
});

eventRoutes.get("/:eventId", authMiddleware, (async (req: Request & { user?: any }, res: Response) => {
	const { eventId } = req.params;
	const userId = req.user?.id;

	try {
		// First, check if the user is the creator of the event
		const eventCreator = await client.event.findUnique({
			where: { eventId },
			select: { creatorId: true }
		});

		if (!eventCreator) {
			return res.status(404).json({ message: "Event not found" });
		}

		// If user is creator, return all categories with full permissions
		if (eventCreator.creatorId === userId) {
			const event = await client.event.findUnique({
				where: { eventId },
				include: {
					categories: {
						include: {
							items: true
						}
					},
					assignments: {
						include: {
							user: true,
							categories: true
						}
					}
				}
			});

			if (!event) {
				return res.status(404).json({ message: "Event not found" });
			}

			return res.json({
				event: {
					...event,
					permission: 'Owner',
					isCreator: true
				}
			});
		}

		// If not creator, check if user has an assignment for this event
		const userAssignment = await client.assignment.findFirst({
			where: {
				eventId,
				userId
			},
			include: {
				categories: true
			}
		});

		if (!userAssignment) {
			return res.status(403).json({ message: "You don't have access to this event" });
		}

		// Get the event with all categories
		const event = await client.event.findUnique({
			where: { eventId },
			include: {
				categories: {
					include: {
						items: true
					}
				},
				assignments: {
					include: {
						user: true,
						categories: true
					}
				}
			}
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// If user is a viewer, return all categories but with limited permissions
		if (userAssignment.level === 'Viewer') {
			return res.json({
				event: {
					...event,
					permission: 'Viewer',
					isCreator: false
				}
			});
		}

		// If user is a member, only return assigned categories
		if (userAssignment.level === 'Member') {
			const assignedCategoryIds = userAssignment.categories.map((c: any) => c.id);
			const filteredEvent = {
				...event,
				categories: event.categories.filter((c: any) => assignedCategoryIds.includes(c.id)),
				permission: 'Member',
				isCreator: false
			};
			return res.json({ event: filteredEvent });
		}

		res.json({ event });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch event" });
	}
}) as any);

// Update event
eventRoutes.put("/:eventId", authMiddleware, (async (req: Request, res: Response) => {
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
eventRoutes.delete("/:eventId", authMiddleware, async (req: Request & { user?: { id: string } }, res: Response) => {
	try {
		const { eventId } = req.params;
		const userId = req.user?.id;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		// Check if user is the creator of the event
		const event = await client.event.findUnique({
			where: { eventId },
			select: { creatorId: true }
		});

		if (!event) {
			res.status(404).json({ message: "Event not found" });
			return;
		}

		if (event.creatorId !== userId) {
			res.status(403).json({ message: "You do not have permission to delete this event" });
			return;
		}

		// Delete the event (Prisma will handle cascading deletes)
		await client.event.delete({
			where: { eventId }
		});

		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);
		res.status(500).json({ message: "Failed to delete event" });
	}
});

// Invite user to event
eventRoutes.post("/:eventId/invite", authMiddleware, (async (req: Request, res: Response) => {
	const { eventId } = req.params;
	const { email, level, categories } = req.body;

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

		// If categories are provided and user is a member, connect them to the assignment
		if (categories && categories.length > 0 && level === 'Member') {
			// Update the categories to connect them to this assignment
			await client.category.updateMany({
				where: {
					id: {
						in: categories
					}
				},
				data: {
					assignmentId: assignment.id
				}
			});
		}

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

		res.json({ message: "User invited", assignment: completeAssignment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to invite user" });
	}
}) as any);

// Get event categories
eventRoutes.get("/:eventId/categories", authMiddleware, (async (req: Request & { user?: { id: string } }, res: Response) => {
	const { eventId } = req.params;
	const userId = req.user?.id;

	try {
		// Get user's assignment for this event
		const assignment = await client.assignment.findFirst({
			where: {
				eventId,
				userId
			},
			include: {
				categories: true
			}
		});

		if (!assignment) {
			return res.status(404).json({ message: "Assignment not found" });
		}

		// If user is admin, return all categories
		if (assignment.level === 'Admin') {
			const categories = await client.category.findMany({
				where: {
					eventId
				}
			});
			return res.json(categories);
		}

		// For members, only return their assigned categories
		res.json(assignment.categories);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch categories" });
	}
}) as any);

// Create category (admin only)
eventRoutes.post("/:eventId/categories", authMiddleware, (async (req: Request & { user?: { id: string } }, res: Response) => {
	const { eventId } = req.params;
	const userId = req.user?.id;
	const { name } = req.body;

	try {
		// Check if user is admin for this event
		const assignment = await client.assignment.findFirst({
			where: {
				eventId,
				userId,
				level: 'Admin'
			}
		});

		if (!assignment) {
			return res.status(403).json({ message: "Only admins can create categories" });
		}

		const category = await client.category.create({
			data: {
				name,
				eventId
			}
		});

		res.json(category);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to create category" });
	}
}) as any);

// Update category (admin only)
eventRoutes.put("/:eventId/categories/:categoryId", authMiddleware, (async (req: Request & { user?: { id: string } }, res: Response) => {
	const { eventId, categoryId } = req.params;
	const userId = req.user?.id;
	const { name } = req.body;

	try {
		// Check if user is admin for this event
		const assignment = await client.assignment.findFirst({
			where: {
				eventId,
				userId,
				level: 'Admin'
			}
		});

		if (!assignment) {
			return res.status(403).json({ message: "Only admins can update categories" });
		}

		const category = await client.category.update({
			where: {
				id: categoryId
			},
			data: {
				name
			}
		});

		res.json(category);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to update category" });
	}
}) as any);

// Delete category (admin only)
eventRoutes.delete("/:eventId/categories/:categoryId", authMiddleware, (async (req: Request & { user?: { id: string } }, res: Response) => {
	const { eventId, categoryId } = req.params;
	const userId = req.user?.id;

	try {
		// Check if user is admin for this event
		const assignment = await client.assignment.findFirst({
			where: {
				eventId,
				userId,
				level: 'Admin'
			}
		});

		if (!assignment) {
			return res.status(403).json({ message: "Only admins can delete categories" });
		}

		await client.category.delete({
			where: {
				id: categoryId
			}
		});

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to delete category" });
	}
}) as any);

// Confirm delivery (admin only)
eventRoutes.post("/:eventId/confirm-delivery", authMiddleware, (async (req: Request & { user?: { id: string } }, res: Response) => {
	const { eventId } = req.params;
	const userId = req.user?.id;

	try {
		// First check if the user is the creator of the event
		const eventCreator = await client.event.findUnique({
			where: { eventId },
			select: { creatorId: true }
		});

		if (!eventCreator) {
			return res.status(404).json({ message: "Event not found" });
		}

		// If user is not the creator, check if they have admin permissions
		if (eventCreator.creatorId !== userId) {
			// Check if user is admin for this event
			const assignment = await client.assignment.findFirst({
				where: {
					eventId,
					userId,
					level: 'Admin'
				}
			});

			if (!assignment) {
				return res.status(403).json({ message: "Only event owners and admins can confirm delivery" });
			}
		}

		// Get all items for this event
		const event = await client.event.findUnique({
			where: { eventId },
			include: {
				categories: {
					include: {
						items: {
							where: {
								isDelivered: false
							}
						}
					}
				}
			}
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Check if all items are already delivered
		const allItemsDelivered = event.categories.every((category: any) =>
			category.items.every((item: any) => item.isDelivered)
		);

		if (allItemsDelivered) {
			return res.status(400).json({
				success: false,
				message: "All items are already marked as delivered"
			});
		}

		// Check if all items are packed
		const allItemsPacked = event.categories.every((category: any) =>
			category.items.every((item: any) => item.isPacked)
		);

		if (!allItemsPacked) {
			return res.status(400).json({
				success: false,
				message: "All items must be packed before confirming delivery"
			});
		}

		// Update all items to mark them as delivered
		await client.item.updateMany({
			where: {
				category: {
					eventId
				}
			},
			data: {
				isDelivered: true
			}
		});

		// Get the updated event with all items
		const updatedEvent = await client.event.findUnique({
			where: { eventId },
			include: {
				categories: {
					include: {
						items: true
					}
				}
			}
		});

		res.json({
			success: true,
			message: "All items have been marked as delivered",
			event: updatedEvent
		});
	} catch (error) {
		console.error("Error confirming delivery:", error);
		res.status(500).json({ message: "Failed to confirm delivery" });
	}
}) as any);
