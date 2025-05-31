import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

export const getLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [logs] = await pool.execute(`
      SELECT l.*, g.name as good_name 
      FROM logs l 
      JOIN goods g ON l.good_id = g.id 
      ORDER BY l.changed_at DESC
    `);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};