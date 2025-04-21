import express from "express";
import cors from "cors";
import { router } from "./routes/index";
import cookieParser from "cookie-parser";
import client from "./db";

const app = express();
app.use(cookieParser());

// Enable CORS for frontend
app.use(cors({
	origin: 'http://localhost:5173', // Vite's default port
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/v1", router);

const PORT = process.env.PORT2 || 3000;

// Test database connection before starting the server
async function startServer() {
	try {
		// Test database connection
		await client.$connect();
		console.log('Database connection successful');

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to connect to database:', error);

	}
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
	console.log('SIGTERM received. Closing HTTP server and database connection...');
	await client.$disconnect();
	process.exit(0);
}); 
