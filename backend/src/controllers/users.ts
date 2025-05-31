import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users'
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    const id = (result as any).insertId;
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
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

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await pool.execute(
      `UPDATE users 
       SET username = ?, email = ?, ${password ? 'password = ?,' : ''} role = ? 
       WHERE id = ?`,
      password
        ? [username, email, hashedPassword, role, req.params.id]
        : [username, email, role, req.params.id]
    );

    if ((result as any).affectedRows === 0) {
      throw new AppError(404, 'User not found');
    }

    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
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
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );

    if ((result as any).affectedRows === 0) {
      throw new AppError(404, 'User not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};