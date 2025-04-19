import { Router } from "express";
import { JWT_PASSWORD } from "../config";
import bcrypt from "bcrypt";
import { SignupSchema, SigninSchema } from "../types";
import client from "../../../db/src/index";

import jwt from "jsonwebtoken";
import { eventRoutes } from "./eventRoutes";
import { categoryRoutes } from "./catagoriesRoutes";
import { itemRoutes } from "./itemsRoutes";
import { assignmentRoutes } from "./assignmentsRoutes";
import { commentRoutes } from "./CommentRoutes";
import { notificationRoutes } from "./notificationRoutes";
import { userRoutes } from "./userRoutes";
import { authMiddleware } from '../middleware/authMiddleware';


export const router = Router();


router.post("/signup", async (req, res) => {
	//check the user
	const parsedData = SignupSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({ message: "validation failed" });
		return
	}


	try {
		// Check if email already exists
		const existingUser = await client.user.findFirst({
			where: {
				email: parsedData.data.email
			}
		});

		if (existingUser) {
			res.status(400).json({ message: "Email already registered" });
			return;
		}

		// Check if username already exists
		const existingUsername = await client.user.findFirst({
			where: {
				username: parsedData.data.username
			}
		});

		if (existingUsername) {
			res.status(400).json({ message: "Username already taken" });
			return;
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

		const user = await client.user.create({
			data: {
				email: parsedData.data.email,
				fullname: parsedData.data.fullname,
				username: parsedData.data.username,
				password: hashedPassword,
				role: parsedData.data.type === "owner" ? "Owner" : "User",
			}
		})
		res.json({
			userId: user.id,
			message: "User created successfully"
		})
	} catch (e: any) {
		console.error("Database Error:", e);
		res.status(500).json({ message: "Failed to create user" });
	}
})


router.post("/signin", async (req, res) => {

	const parsedData = SigninSchema.safeParse(req.body);
	if (!parsedData.success) {
		console.log("Signin validation failed:", parsedData.error);
		res.status(400).json({ message: "Validation failed" });
		return
	}
	try {
		console.log("Signin attempt for username:", parsedData.data.username);
		const user = await client.user.findUnique({
			where: {
				username: parsedData.data.username
			}
		})
		if (!user) {
			res.status(403).json({ message: "User not found" });
			console.log("User not found");
			return
		}
		const isValid = await bcrypt.compare(parsedData.data.password, user.password)
		if (!isValid) {
			res.status(403).json({ message: "Invalid Password" });
			console.log("Invalid Password");
			return
		}


		const token = jwt.sign({
			userId: user.id,
			role: user.role
		}, JWT_PASSWORD)

		// Set HTTP-only cookie with the token
		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',

			maxAge: 24 * 60 * 60 * 1000 // 1 day
		});


		console.log("Token set:", token);
		res.json({
			token: token,
			user: user
		})
	}
	catch (e) {
		res.status(403).json({ message: "Internal Server Error" })
	}
})

// Logout route
router.post('/logout', (req, res) => {
	console.log("Logging out user, clearing cookie");
	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'strict'
	});
	res.json({ message: 'Logged out successfully' });
});

router.get('/me', authMiddleware, (req, res) => {

	res.json({ user: (req as any).user });
});

router.use("/events", eventRoutes);
router.use("/categories", categoryRoutes);
router.use("/items", itemRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/comments", commentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);