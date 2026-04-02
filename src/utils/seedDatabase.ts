import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { FinancialRecord, RecordType, RecordCategory } from '../entities/FinancialRecord';

export const seedDatabase = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const recordRepository = AppDataSource.getRepository(FinancialRecord);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database with initial data...');

  // Create admin user
  const adminUser = userRepository.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@finance.com',
    password: await bcrypt.hash('admin123', 12),
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  });

  // Create analyst user
  const analystUser = userRepository.create({
    firstName: 'John',
    lastName: 'Analyst',
    email: 'analyst@finance.com',
    password: await bcrypt.hash('analyst123', 12),
    role: UserRole.ANALYST,
    status: UserStatus.ACTIVE,
  });

  // Create viewer user
  const viewerUser = userRepository.create({
    firstName: 'Jane',
    lastName: 'Viewer',
    email: 'viewer@finance.com',
    password: await bcrypt.hash('viewer123', 12),
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE,
  });

  await userRepository.save([adminUser, analystUser, viewerUser]);

  // Create sample financial records
  const sampleRecords = [
    // Income records
    {
      amount: 5000,
      type: RecordType.INCOME,
      category: RecordCategory.SALARY,
      date: new Date('2024-01-15'),
      description: 'Monthly salary',
      createdBy: adminUser,
    },
    {
      amount: 1500,
      type: RecordType.INCOME,
      category: RecordCategory.FREELANCE,
      date: new Date('2024-01-20'),
      description: 'Freelance project payment',
      createdBy: analystUser,
    },
    {
      amount: 800,
      type: RecordType.INCOME,
      category: RecordCategory.INVESTMENT,
      date: new Date('2024-01-25'),
      description: 'Stock dividends',
      createdBy: adminUser,
    },
    
    // Expense records
    {
      amount: 1200,
      type: RecordType.EXPENSE,
      category: RecordCategory.HOUSING,
      date: new Date('2024-01-01'),
      description: 'Monthly rent',
      createdBy: adminUser,
    },
    {
      amount: 300,
      type: RecordType.EXPENSE,
      category: RecordCategory.FOOD,
      date: new Date('2024-01-05'),
      description: 'Groceries',
      createdBy: analystUser,
    },
    {
      amount: 150,
      type: RecordType.EXPENSE,
      category: RecordCategory.UTILITIES,
      date: new Date('2024-01-10'),
      description: 'Electricity bill',
      createdBy: adminUser,
    },
    {
      amount: 80,
      type: RecordType.EXPENSE,
      category: RecordCategory.TRANSPORTATION,
      date: new Date('2024-01-12'),
      description: 'Gas for car',
      createdBy: analystUser,
    },
    {
      amount: 200,
      type: RecordType.EXPENSE,
      category: RecordCategory.ENTERTAINMENT,
      date: new Date('2024-01-18'),
      description: 'Movie tickets and dinner',
      createdBy: adminUser,
    },
  ];

  const records = recordRepository.create(sampleRecords);
  await recordRepository.save(records);

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin user: admin@finance.com / admin123');
  console.log('📧 Analyst user: analyst@finance.com / analyst123');
  console.log('📧 Viewer user: viewer@finance.com / viewer123');
};