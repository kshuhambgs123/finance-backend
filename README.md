# Finance Data Processing and Access Control Backend

A comprehensive backend system for managing financial records with role-based access control, built with Node.js, TypeScript, TypeORM, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **User Management**: Complete user lifecycle with role-based permissions
- **Financial Records**: CRUD operations for income/expense tracking
- **Dashboard Analytics**: Real-time insights and trend analysis
- **Access Control**: Role-based permissions (Admin, Analyst, Viewer)
- **Data Validation**: Comprehensive input validation and error handling

### Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **TypeORM**: Database abstraction with migrations and relationships
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API protection against abuse
- **Pagination**: Efficient data retrieval for large datasets
- **Soft Deletes**: Data preservation with logical deletion
- **Docker Support**: Containerized deployment with single command

## 🏗️ Architecture

### Project Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── dto/            # Data Transfer Objects for validation
├── entities/       # TypeORM database entities
├── middleware/     # Express middleware (auth, validation, etc.)
├── routes/         # API route definitions
├── services/       # Business logic layer
└── utils/          # Utility functions and helpers
```

### Database Schema
- **Users**: Authentication and role management
- **Financial Records**: Transaction data with categories and metadata
- **Relationships**: User-to-records with proper foreign keys

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: class-validator
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Linting**: ESLint

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Single Command Setup

#### Development Environment
```bash
# Clone and setup development environment
git clone <repository-url>
cd finance-backend
make setup-dev
```

#### Production Environment
```bash
# Clone and setup production environment
git clone <repository-url>
cd finance-backend
make setup-prod
```

### Manual Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd finance-backend
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start with Docker**
   ```bash
   # Development
   docker-compose -f docker-compose.dev.yml up -d
   
   # Production
   docker-compose up -d
   ```

5. **Local Development (without Docker)**
   ```bash
   # Start PostgreSQL separately
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "viewer"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Financial Records Endpoints

#### Create Record
```http
POST /records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1500.00,
  "type": "income",
  "category": "salary",
  "date": "2024-01-15",
  "description": "Monthly salary"
}
```

#### Get Records (with filtering)
```http
GET /records?page=1&limit=20&type=income&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Get Dashboard Summary
```http
GET /dashboard/summary
Authorization: Bearer <token>
```

#### Get Income vs Expenses
```http
GET /dashboard/income-vs-expenses?period=month
Authorization: Bearer <token>
```

## 🔐 Access Control

### User Roles

| Role | Permissions |
|------|-------------|
| **Viewer** | View own records, dashboard summaries |
| **Analyst** | Create/edit records, view all records, analytics |
| **Admin** | Full access, user management, system administration |

### Default Users (Seeded)
- **Admin**: admin@finance.com / admin123
- **Analyst**: analyst@finance.com / analyst123  
- **Viewer**: viewer@finance.com / viewer123

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm test            # Run tests
```

### Database Operations
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Docker Commands
```bash
# Build image
docker build -t finance-backend .

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔍 Key Features Demonstration

### 1. Role-Based Access Control
- Middleware enforces permissions at route level
- Service layer validates user capabilities
- Database queries filtered by user access rights

### 2. Data Validation
- DTO classes with decorators for input validation
- Custom validation messages
- Type-safe request/response handling

### 3. Business Logic
- Service layer separation for maintainability
- Transaction handling for data consistency
- Comprehensive error handling

### 4. Performance Optimization
- Database indexing on frequently queried fields
- Pagination for large datasets
- Efficient aggregation queries for analytics

### 5. Security
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting and CORS protection
- Input sanitization and validation

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set secure JWT secrets and database credentials
2. **Database**: Use managed PostgreSQL service for production
3. **Monitoring**: Add logging and monitoring solutions
4. **SSL**: Configure HTTPS in production
5. **Scaling**: Consider load balancing for high traffic

### Docker Production Deployment
```bash
# Build and deploy
docker-compose up -d

# Scale services
docker-compose up -d --scale app=3
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test files for usage examples

---

**Built with ❤️ for modern backend development**