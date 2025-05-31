import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import { AppError } from "./errorHandler.js";

interface JwtPayload {
	userId: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number;
				role: "admin" | "staff" | "viewer";
			};
		}
	}
}

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token =
			req.headers.authorization?.split(" ")[1] || req.cookies.token;

		if (!token) {
			throw new AppError(401, "No token provided");
		}

		const { userId } = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as JwtPayload;

		const [users] = await pool.execute(
			"SELECT id, role FROM users WHERE id = ?",
			[userId]
		);
		const user = (users as any[])[0];

		if (!user) {
			throw new AppError(401, "Invalid token");
		}

		req.user = user;
		next();
	} catch (error) {
		next(new AppError(401, "Invalid token"));
	}
};

export const authorize = (...roles: ("admin" | "staff" | "viewer")[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return next(new AppError(401, "Not authenticated"));
		}

		if (!roles.includes(req.user.role)) {
			return next(new AppError(403, "Not authorized"));
		}

		next();
	};
};
