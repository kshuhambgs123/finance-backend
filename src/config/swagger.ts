import swaggerJsdoc from 'swagger-jsdoc';
import { UserRole, UserStatus } from '../entities/User';
import { RecordType, RecordCategory } from '../entities/FinancialRecord';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Backend API',
      version: '1.0.0',
      description: `
        A comprehensive finance data processing and access control backend system.
        
        ## Features
        - **User Management**: Complete user lifecycle with role-based permissions
        - **Financial Records**: CRUD operations for income/expense tracking  
        - **Dashboard Analytics**: Real-time insights and trend analysis
        - **Access Control**: Role-based permissions (Admin, Analyst, Viewer)
        - **Security**: JWT authentication, rate limiting, input validation
        
        ## Authentication
        Most endpoints require JWT authentication. Include the token in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`
        
        ## Default Users (for testing)
        - **Admin**: admin@finance.com / admin123
        - **Analyst**: analyst@finance.com / analyst123
        - **Viewer**: viewer@finance.com / viewer123
      `,
      contact: {
        name: 'API Support',
        email: 'support@finance-backend.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier'
            },
            firstName: {
              type: 'string',
              example: 'John',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              example: 'Doe',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: Object.values(UserRole),
              description: 'User role determining permissions'
            },
            status: {
              type: 'string',
              enum: Object.values(UserStatus),
              description: 'User account status'
            },
            lastLoginAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique record identifier'
            },
            amount: {
              type: 'number',
              format: 'decimal',
              example: 1500.00,
              description: 'Transaction amount'
            },
            type: {
              type: 'string',
              enum: Object.values(RecordType),
              description: 'Transaction type'
            },
            category: {
              type: 'string',
              enum: Object.values(RecordCategory),
              description: 'Transaction category'
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
              description: 'Transaction date'
            },
            description: {
              type: 'string',
              example: 'Monthly salary payment',
              description: 'Transaction description'
            },
            notes: {
              type: 'string',
              example: 'Direct deposit',
              description: 'Additional notes'
            },
            reference: {
              type: 'string',
              example: 'PAY-001',
              description: 'Reference number'
            },
            isRecurring: {
              type: 'boolean',
              description: 'Whether this is a recurring transaction'
            },
            recurringFrequency: {
              type: 'string',
              example: 'monthly',
              description: 'Frequency of recurring transaction'
            },
            createdBy: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@finance.com'
            },
            password: {
              type: 'string',
              example: 'admin123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: Object.values(UserRole),
              default: 'viewer'
            }
          }
        },
        CreateRecordRequest: {
          type: 'object',
          required: ['amount', 'type', 'category', 'date'],
          properties: {
            amount: {
              type: 'number',
              format: 'decimal',
              example: 1500.00
            },
            type: {
              type: 'string',
              enum: Object.values(RecordType)
            },
            category: {
              type: 'string',
              enum: Object.values(RecordCategory)
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2024-01-15'
            },
            description: {
              type: 'string',
              example: 'Monthly salary payment'
            },
            notes: {
              type: 'string',
              example: 'Direct deposit'
            },
            reference: {
              type: 'string',
              example: 'PAY-001'
            },
            isRecurring: {
              type: 'boolean',
              default: false
            },
            recurringFrequency: {
              type: 'string',
              example: 'monthly'
            }
          }
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            totalIncome: {
              type: 'number',
              example: 15000.00
            },
            totalExpenses: {
              type: 'number',
              example: 8500.00
            },
            netBalance: {
              type: 'number',
              example: 6500.00
            },
            recordCount: {
              type: 'integer',
              example: 45
            },
            categoryBreakdown: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string'
                  },
                  type: {
                    type: 'string'
                  },
                  total: {
                    type: 'number'
                  },
                  count: {
                    type: 'integer'
                  },
                  percentage: {
                    type: 'number'
                  }
                }
              }
            },
            monthlyTrends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  month: {
                    type: 'string',
                    example: '2024-01'
                  },
                  income: {
                    type: 'number'
                  },
                  expenses: {
                    type: 'number'
                  },
                  net: {
                    type: 'number'
                  }
                }
              }
            },
            recentActivity: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FinancialRecord'
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        },
        PaginationResponse: {
          allOf: [
            {
              $ref: '#/components/schemas/ApiResponse'
            },
            {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    currentPage: {
                      type: 'integer'
                    },
                    totalPages: {
                      type: 'integer'
                    },
                    totalItems: {
                      type: 'integer'
                    },
                    itemsPerPage: {
                      type: 'integer'
                    },
                    hasNextPage: {
                      type: 'boolean'
                    },
                    hasPreviousPage: {
                      type: 'boolean'
                    }
                  }
                }
              }
            }
          ]
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error description'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);