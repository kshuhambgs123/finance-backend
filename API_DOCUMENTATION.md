# Finance Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // For paginated responses only
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "viewer" // Optional: viewer, analyst, admin
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active"
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/profile
Get current user profile. Requires authentication.

#### PUT /auth/change-password
Change user password. Requires authentication.

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Users Management

#### POST /users
Create a new user (Admin only).

#### GET /users
Get all users with pagination and filtering (Admin/Analyst only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `role`: Filter by role (viewer, analyst, admin)
- `status`: Filter by status (active, inactive, suspended)
- `search`: Search in name and email

#### GET /users/:id
Get user by ID.

#### PUT /users/:id
Update user information.

#### DELETE /users/:id
Delete user (Admin only).

### Financial Records

#### POST /records
Create a new financial record (Admin/Analyst only).

**Request Body:**
```json
{
  "amount": 1500.00,
  "type": "income", // income or expense
  "category": "salary", // See categories below
  "date": "2024-01-15",
  "description": "Monthly salary payment",
  "notes": "Direct deposit",
  "reference": "PAY-001",
  "isRecurring": false,
  "recurringFrequency": "monthly"
}
```

#### GET /records
Get financial records with filtering and pagination.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `type`: Filter by type (income/expense)
- `category`: Filter by category
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter
- `search`: Search in description
- `sortBy`: Sort field (date, amount, category)
- `sortOrder`: Sort direction (asc, desc)

#### GET /records/:id
Get financial record by ID.

#### PUT /records/:id
Update financial record.

#### DELETE /records/:id
Delete financial record (soft delete).

### Dashboard Analytics

#### GET /dashboard/summary
Get comprehensive dashboard summary.

**Query Parameters:**
- `startDate`: Filter from date (optional)
- `endDate`: Filter to date (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 15000.00,
    "totalExpenses": 8500.00,
    "netBalance": 6500.00,
    "recordCount": 45,
    "categoryBreakdown": [...],
    "monthlyTrends": [...],
    "recentActivity": [...]
  }
}
```

#### GET /dashboard/income-vs-expenses
Get income vs expenses comparison.

**Query Parameters:**
- `period`: Time period (week, month, year)

#### GET /dashboard/category-analysis
Get category-wise analysis.

**Query Parameters:**
- `type`: Filter by type (income/expense) - optional

#### GET /dashboard/monthly-trends
Get monthly trends comparison.

**Query Parameters:**
- `months`: Number of months to include (1-24, default: 6)

#### GET /dashboard/top-categories/:type
Get top categories by type.

**Path Parameters:**
- `type`: income or expense

**Query Parameters:**
- `limit`: Number of categories to return (1-20, default: 5)

## Data Models

### User Roles
- `viewer`: Can only view dashboard data
- `analyst`: Can view records and access insights
- `admin`: Can create, update, and manage records and users

### Record Types
- `income`: Money coming in
- `expense`: Money going out

### Record Categories

**Income Categories:**
- `salary`
- `freelance`
- `investment`
- `business`
- `other_income`

**Expense Categories:**
- `food`
- `transportation`
- `housing`
- `utilities`
- `healthcare`
- `entertainment`
- `shopping`
- `education`
- `insurance`
- `taxes`
- `other_expense`

## Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `500`: Internal Server Error - Server error

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination

Paginated responses include:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Example Usage

### Complete Workflow Example

1. **Register/Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"admin123"}'
```

2. **Create a Record**
```bash
curl -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500.00,
    "type": "income",
    "category": "salary",
    "date": "2024-01-15",
    "description": "January salary"
  }'
```

3. **Get Dashboard Summary**
```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

4. **Get Records with Filtering**
```bash
curl -X GET "http://localhost:3000/api/records?type=income&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```