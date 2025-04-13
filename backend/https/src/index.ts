import express from "express";
import cors from "cors";
import { router } from "./routes/index";
import cookieParser from "cookie-parser";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
}); 
