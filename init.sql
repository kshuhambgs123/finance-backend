-- Initialize database with extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (will be created by TypeORM migrations)
-- This file can be used for any initial database setup