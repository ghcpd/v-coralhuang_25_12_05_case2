import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AppError } from '../config/types';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No authorization token provided');
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    req.user = decoded as any;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
};

export const errorHandler = (
  error: AppError | Error,
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};
