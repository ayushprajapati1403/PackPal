import { Router, Request, Response } from "express";
import client from "../../../db/src/index";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRoutes = Router();

// Check if a user exists by email
userRoutes.get("/check-email/:email", authMiddleware, (async (req: Request, res: Response) => {
	const { email } = req.params;

	try {
		const user = await client.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				fullname: true,
				username: true
			}
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ user });
	} catch (error) {
		console.error("Error checking user email:", error);
		res.status(500).json({ message: "Failed to check user email" });
	}
}) as any); 