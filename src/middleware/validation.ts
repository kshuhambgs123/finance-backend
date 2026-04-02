import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppError } from '../utils/AppError';

export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => {
          return Object.values(error.constraints || {}).join(', ');
        });

        throw new AppError(`Validation failed: ${errorMessages.join('; ')}`, 400);
      }

      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req.query);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => {
          return Object.values(error.constraints || {}).join(', ');
        });

        throw new AppError(`Query validation failed: ${errorMessages.join('; ')}`, 400);
      }

      req.query = dto as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};