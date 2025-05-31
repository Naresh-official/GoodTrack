import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import goodsRouter from './routes/goods.js';
import logsRouter from './routes/logs.js';
import usersRouter from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/goods', goodsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/users', usersRouter);

// Error handling
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});