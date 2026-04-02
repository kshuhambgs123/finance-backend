import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { FinancialRecord } from './FinancialRecord';

export enum UserRole {
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER
  })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FinancialRecord, record => record.createdBy)
  financialRecords: FinancialRecord[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  get canCreateRecords(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.ANALYST;
  }

  get canViewAllRecords(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.ANALYST;
  }

  get canManageUsers(): boolean {
    return this.role === UserRole.ADMIN;
  }
}