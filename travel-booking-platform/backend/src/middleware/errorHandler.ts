import { Response, NextFunction } from 'express';
import { AuthRequest, AppError } from '../config/types';

export const errorHandler = (
  error: any,
  req: any,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ 
      error: error.message,
      statusCode: error.statusCode 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    statusCode: 500 
  });
};
