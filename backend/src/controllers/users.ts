import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [users] = await pool.execute(
			"SELECT id, username, email, role, created_at FROM users"
		);
		res.json(users);
	} catch (error) {
		next(error);
	}
};

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username, email, password, role } = req.body;

		const [result] = await pool.execute(
			"INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
			[username, email, password, role]
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

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username, email, password, role } = req.body;

		let query, params;
		if (password) {
			query = `UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?`;
			params = [username, email, password, role, req.params.id];
		} else {
			query = `UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?`;
			params = [username, email, role, req.params.id];
		}

		const [result] = await pool.execute(query, params);

		if ((result as any).affectedRows === 0) {
			throw new AppError(404, "User not found");
		}

		const [users] = await pool.execute(
			"SELECT id, username, email, role, created_at FROM users WHERE id = ?",
			[req.params.id]
		);

		res.json((users as any[])[0]);
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
			req.params.id,
		]);

		if ((result as any).affectedRows === 0) {
			throw new AppError(404, "User not found");
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
