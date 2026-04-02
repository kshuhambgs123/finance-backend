import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { QueryFailedError } from 'typeorm';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let appError = error;

  // Convert TypeORM errors to AppError
  if (error instanceof QueryFailedError) {
    const message = handleDatabaseError(error);
    appError = new AppError(message, 400);
  }

  // Convert generic errors to AppError
  if (!(error instanceof AppError)) {
    appError = new AppError(
      process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : error.message,
      500
    );
  }

  const { statusCode, message, isOperational } = appError as AppError;

  // Log error for debugging
  if (!isOperational || statusCode >= 500) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error
    })
  });
};

const handleDatabaseError = (error: QueryFailedError): string => {
  const { code, detail } = error.driverError;

  switch (code) {
    case '23505': // Unique violation
      if (detail?.includes('email')) {
        return 'Email address is already registered';
      }
      return 'Duplicate entry found';
    
    case '23503': // Foreign key violation
      return 'Referenced record does not exist';
    
    case '23502': // Not null violation
      return 'Required field is missing';
    
    case '22001': // String data too long
      return 'Input data is too long';
    
    case '22P02': // Invalid input syntax
      return 'Invalid data format';
    
    default:
      return 'Database operation failed';
  }
};