# 🚀 Finance Backend - Deployment Guide

## Single Command Deployment

### Quick Start (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd finance-backend

# Start everything with one command
./scripts/start.sh

# Or for production
./scripts/start.sh production
```

## Manual Deployment Options

### Option 1: Docker Compose (Recommended)

#### Development Environment
```bash
# Install dependencies and start
npm install
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps
```

#### Production Environment
```bash
# Build and start
docker-compose up -d

# Check status
docker-compose ps
```

### Option 2: Local Development
```bash
# Prerequisites: PostgreSQL running locally
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### Option 3: Using Makefile
```bash
# Development setup
make setup-dev

# Production setup
make setup-prod

# Other commands
make help  # See all available commands
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=finance_user
DB_PASSWORD=finance_password
DB_DATABASE=finance_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=development
PORT=3000
```

## Verification Steps

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. Test Authentication
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"admin123"}'
```

### 3. Test API Access
```bash
# Use token from login response
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Users (Auto-seeded)

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@finance.com | admin123 | Full access |
| Analyst | analyst@finance.com | analyst123 | Records + Analytics |
| Viewer | viewer@finance.com | viewer123 | View only |

## Production Deployment

### Cloud Deployment (AWS/GCP/Azure)

1. **Container Registry**
   ```bash
   # Build and tag
   docker build -t finance-backend:latest .
   docker tag finance-backend:latest your-registry/finance-backend:latest
   docker push your-registry/finance-backend:latest
   ```

2. **Database Setup**
   - Use managed PostgreSQL service
   - Update connection strings in environment variables
   - Run migrations: `npm run migration:run`

3. **Environment Variables**
   ```bash
   NODE_ENV=production
   DB_HOST=your-production-db-host
   JWT_SECRET=your-super-secure-production-secret
   ```

### Docker Swarm Deployment
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml finance-stack
```

### Kubernetes Deployment
```yaml
# Example k8s deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: finance-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: finance-backend
  template:
    metadata:
      labels:
        app: finance-backend
    spec:
      containers:
      - name: finance-backend
        image: finance-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: "postgres-service"
```

## Monitoring & Maintenance

### Logs
```bash
# Docker Compose logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f app
```

### Database Backup
```bash
# Backup
docker exec postgres_container pg_dump -U finance_user finance_db > backup.sql

# Restore
docker exec -i postgres_container psql -U finance_user finance_db < backup.sql
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Kill process or change port in .env
   ```

2. **Database Connection Failed**
   ```bash
   # Check PostgreSQL is running
   docker-compose ps
   
   # Check logs
   docker-compose logs postgres
   ```

3. **Permission Denied**
   ```bash
   # Make script executable
   chmod +x scripts/start.sh
   ```

### Performance Optimization

1. **Database Indexing**
   - Indexes are automatically created via TypeORM
   - Monitor slow queries in production

2. **Caching**
   - Redis is included in docker-compose
   - Implement caching for dashboard queries

3. **Load Balancing**
   ```bash
   # Scale application instances
   docker-compose up -d --scale app=3
   ```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs for suspicious activity

## Support

### Getting Help
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Check API documentation
5. Review error messages

### Useful Commands
```bash
# Restart services
docker-compose restart

# View running containers
docker ps

# Execute commands in container
docker-compose exec app npm run migration:run

# Database shell
docker-compose exec postgres psql -U finance_user finance_db
```

---

**🎉 Your finance backend is now ready for production use!**