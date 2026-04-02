# Finance Backend Makefile

.PHONY: help install build start dev test lint clean docker-build docker-up docker-down docker-logs

# Default target
help:
	@echo "Available commands:"
	@echo "  install      - Install dependencies"
	@echo "  build        - Build the application"
	@echo "  start        - Start production server"
	@echo "  dev          - Start development server"
	@echo "  test         - Run tests"
	@echo "  lint         - Run linter"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-up    - Start with Docker Compose"
	@echo "  docker-down  - Stop Docker Compose"
	@echo "  docker-logs  - View Docker logs"

# Install dependencies
install:
	npm install

# Build the application
build:
	npm run build

# Start production server
start: build
	npm start

# Start development server
dev:
	npm run dev

# Run tests
test:
	npm test

# Run linter
lint:
	npm run lint

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf node_modules/
	rm -rf coverage/

# Docker commands
docker-build:
	docker build -t finance-backend .

docker-up:
	docker-compose up -d

docker-up-dev:
	docker-compose -f docker-compose.dev.yml up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Quick setup for development
setup-dev: install docker-up-dev
	@echo "Development environment is ready!"
	@echo "API will be available at http://localhost:3000"
	@echo "Database will be available at localhost:5432"

# Quick setup for production
setup-prod: install build docker-up
	@echo "Production environment is ready!"
	@echo "API is available at http://localhost:3000"