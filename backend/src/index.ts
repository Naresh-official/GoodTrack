import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { initDatabase } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.js";
import goodsRouter from "./routes/goods.js";
import logsRouter from "./routes/logs.js";
import usersRouter from "./routes/users.js";
import { createAdmin } from "./controllers/admin.js";

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

initDatabase()
	.then(() => console.log("Connected to db"))
	.catch(console.error);

app.use("/api/auth", authRouter);
app.use("/api/goods", goodsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/users", usersRouter);

app.post("/api/create-admin", createAdmin);

app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("Welcome to the API");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
