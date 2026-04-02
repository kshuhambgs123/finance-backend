import { 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsPositive, 
  IsOptional, 
  IsDateString,
  IsBoolean,
  IsString,
  MaxLength
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RecordType, RecordCategory } from '../entities/FinancialRecord';

export class CreateRecordDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a valid number with up to 2 decimal places' })
  @IsPositive({ message: 'Amount must be positive' })
  @Type(() => Number)
  amount: number;

  @IsEnum(RecordType, { message: 'Type must be either income or expense' })
  type: RecordType;

  @IsEnum(RecordCategory, { message: 'Invalid category' })
  category: RecordCategory;

  @IsDateString({}, { message: 'Please provide a valid date' })
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Notes cannot exceed 255 characters' })
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Reference cannot exceed 100 characters' })
  reference?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Recurring frequency cannot exceed 50 characters' })
  recurringFrequency?: string;
}

export class UpdateRecordDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a valid number with up to 2 decimal places' })
  @IsPositive({ message: 'Amount must be positive' })
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsEnum(RecordType, { message: 'Type must be either income or expense' })
  type?: RecordType;

  @IsOptional()
  @IsEnum(RecordCategory, { message: 'Invalid category' })
  category?: RecordCategory;

  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date' })
  date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Notes cannot exceed 255 characters' })
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Reference cannot exceed 100 characters' })
  reference?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Recurring frequency cannot exceed 50 characters' })
  recurringFrequency?: string;
}

export class RecordQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsEnum(RecordType, { message: 'Invalid record type filter' })
  type?: RecordType;

  @IsOptional()
  @IsEnum(RecordCategory, { message: 'Invalid category filter' })
  category?: RecordCategory;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid start date format' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid end date format' })
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minAmount?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  maxAmount?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  sortOrder?: 'asc' | 'desc';
}