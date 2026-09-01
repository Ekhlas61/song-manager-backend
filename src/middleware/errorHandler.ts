import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err instanceof Error ? err : new Error('Internal Server Error');

  const statusCode =
    error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError
      ? 400
      : typeof err === 'object' && err !== null && 'status' in err && typeof (err as { status?: number }).status === 'number'
        ? (err as { status: number }).status
        : 500;

  console.error(error.stack || error.message);

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal Server Error' : error.message,
  });
};