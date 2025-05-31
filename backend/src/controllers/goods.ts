import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendLowStockAlert } from "../utils/email.js";

export const getAllGoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [goods] = await pool.execute("SELECT * FROM goods");
		res.json(goods);
	} catch (error) {
		next(error);
	}
};

export const getGoodById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [goods] = await pool.execute("SELECT * FROM goods WHERE id = ?", [
			req.params.id,
		]);

		const good = (goods as any[])[0];
		if (!good) {
			throw new AppError(404, "Good not found");
		}

		res.json(good);
	} catch (error) {
		next(error);
	}
};

export const createGood = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description, category, quantity, price } = req.body;

		const [result] = await pool.execute(
			"INSERT INTO goods (name, description, category, quantity, price, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
			[name, description, category, quantity, price]
		);

		const id = (result as any).insertId;
		const [goods] = await pool.execute("SELECT * FROM goods WHERE id = ?", [
			id,
		]);

		res.status(201).json((goods as any[])[0]);
	} catch (error) {
		next(error);
	}
};

export const updateGood = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description, category, quantity, price } = req.body;

		const [result] = await pool.execute(
			"UPDATE goods SET name = ?, description = ?, category = ?, quantity = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
			[name, description, category, quantity, price, req.params.id]
		);

		if ((result as any).affectedRows === 0) {
			throw new AppError(404, "Good not found");
		}

		if (quantity < 5) {
			const [goods] = await pool.execute(
				"SELECT name FROM goods WHERE id = ?",
				[req.params.id]
			);
			const good = (goods as any[])[0];
			await sendLowStockAlert(good.name, quantity);
		}

		const [goods] = await pool.execute("SELECT * FROM goods WHERE id = ?", [
			req.params.id,
		]);

		res.json((goods as any[])[0]);
	} catch (error) {
		next(error);
	}
};

export const deleteGood = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [result] = await pool.execute("DELETE FROM goods WHERE id = ?", [
			req.params.id,
		]);

		if ((result as any).affectedRows === 0) {
			throw new AppError(404, "Good not found");
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
