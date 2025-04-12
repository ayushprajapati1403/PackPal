import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
	// Get the token from cookies
	const token = req.cookies.token;

	if (!token) {
		res.status(401).json({ message: 'No token provided' });
		return;
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		// Add the decoded user to the request object
		(req as any).user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' });
	}
}; 