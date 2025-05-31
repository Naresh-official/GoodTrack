import { NextFunction, Request, Response } from "express";
import { pool } from "../config/database.js";

export const createAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({ message: "Missing fields" });
		}
		const [existing] = await pool.execute(
			"SELECT id FROM users WHERE email = ?",
			[email]
		);
		if ((existing as any[]).length > 0) {
			return res.status(409).json({ message: "Admin already exists" });
		}
		const [result] = await pool.execute(
			"INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
			[username, email, password, "admin"]
		);
		const id = (result as any).insertId;
		const [users] = await pool.execute(
			"SELECT id, username, email, role, created_at FROM users WHERE id = ?",
			[id]
		);
		res.status(201).json((users as any[])[0]);
	} catch (error) {
		next(error);
	}
};
