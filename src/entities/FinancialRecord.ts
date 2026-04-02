import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';
import { User } from './User';

export enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum RecordCategory {
  // Income categories
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  BUSINESS = 'business',
  OTHER_INCOME = 'other_income',
  
  // Expense categories
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  HOUSING = 'housing',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  EDUCATION = 'education',
  INSURANCE = 'insurance',
  TAXES = 'taxes',
  OTHER_EXPENSE = 'other_expense'
}

@Entity('financial_records')
@Index(['type'])
@Index(['category'])
@Index(['date'])
@Index(['createdBy'])
@Index(['createdAt'])
export class FinancialRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a valid number with up to 2 decimal places' })
  @IsPositive({ message: 'Amount must be positive' })
  amount: number;

  @Column({
    type: 'enum',
    enum: RecordType
  })
  @IsEnum(RecordType, { message: 'Type must be either income or expense' })
  type: RecordType;

  @Column({
    type: 'enum',
    enum: RecordCategory
  })
  @IsEnum(RecordCategory, { message: 'Invalid category' })
  category: RecordCategory;

  @Column({ type: 'date' })
  @IsDateString({}, { message: 'Please provide a valid date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  notes: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  reference: string;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  recurringFrequency: string; // monthly, weekly, yearly

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.financialRecords, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
  createdById: string;

  // Virtual properties
  get formattedAmount(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(this.amount));
  }

  get isIncome(): boolean {
    return this.type === RecordType.INCOME;
  }

  get isExpense(): boolean {
    return this.type === RecordType.EXPENSE;
  }

  get monthYear(): string {
    return this.date.toISOString().substring(0, 7); // YYYY-MM format
  }
}