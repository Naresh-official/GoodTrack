import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = (users as any[])[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [req.user!.id]
    );

    const user = (users as any[])[0];
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};