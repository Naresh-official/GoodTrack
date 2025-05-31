import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
	constructor(public statusCode: number, message: string) {
		super(message);
		this.name = "AppError";
	}
}

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err);

	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			status: "error",
			message: err.message,
		});
		return;
	}

	res.status(500).json({
		status: "error",
		message: "Internal server error",
	});
};
