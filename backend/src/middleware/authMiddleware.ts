import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from "../config"; // already used in signin
import { string } from 'zod';


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
	// Get the token from cookies
	const token = req.cookies.token;

	console.log("Token:", token);
	if (!token) {
		console.log("No token provided");

		res.status(401).json({ message: 'No token provided' });
		return;
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: string, role: string };
		(req as any).user = { id: decoded.userId, role: decoded.role };


		next();
	} catch (error) {
		console.log("Invalid token");

		res.status(401).json({ message: 'Invalid token' });
	}
}; 