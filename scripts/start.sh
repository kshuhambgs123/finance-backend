#!/bin/bash

# Finance Backend Startup Script
# This script provides a single command to start the entire application

set -e

echo "🚀 Starting Finance Backend Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the configuration if needed."
fi

# Determine environment
ENVIRONMENT=${1:-development}

echo "🔧 Environment: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏗️  Building production image..."
    docker build -t finance-backend .
    
    echo "🚀 Starting production services..."
    docker-compose up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo "🔍 Checking service health..."
    docker-compose ps
    
    echo "✅ Production environment is ready!"
    echo "📊 API: http://localhost:3000"
    echo "🗄️  Database: localhost:5432"
    echo "📋 Health Check: http://localhost:3000/health"
    echo "📚 Swagger Docs: http://localhost:3000/api-docs"
    
else
    echo "🏗️  Starting development services..."
    docker-compose -f docker-compose.dev.yml up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo "🔍 Checking service health..."
    docker-compose -f docker-compose.dev.yml ps
    
    echo "✅ Development environment is ready!"
    echo "📊 API: http://localhost:3000"
    echo "🗄️  Database: localhost:5432"
    echo "📋 Health Check: http://localhost:3000/health"
    echo "📚 Swagger Docs: http://localhost:3000/api-docs"
    echo "🔄 Hot reload enabled for development"
fi

echo ""
echo "🔐 Default Users:"
echo "   Admin: admin@finance.com / admin123"
echo "   Analyst: analyst@finance.com / analyst123"
echo "   Viewer: viewer@finance.com / viewer123"
echo ""
echo "📚 Swagger API Documentation: http://localhost:3000/api-docs"
echo "📋 Health Check: http://localhost:3000/health"
echo "🛑 To stop: docker-compose down"
echo ""
echo "🎉 Application started successfully!"