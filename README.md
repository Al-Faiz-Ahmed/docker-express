# Pets API - Docker Project

A RESTful API for managing pets built with Express.js, TypeScript, Drizzle ORM, and PostgreSQL, containerized with Docker.

## Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

Verify installations:
```bash
docker --version
docker-compose --version
```

## Project Structure

```
.
├── src/
│   ├── controller/        # Request handlers
│   ├── routes/            # API routes
│   ├── database/          # Database configuration and schema
│   ├── middleware/        # Express middleware
│   └── index.ts           # Application entry point
├── Dockerfile.dev         # Development container configuration
├── Dockerfile.prod        # Production container configuration
├── docker-compose.dev.yml # Development multi-container setup
├── docker-compose.prod.yml # Production multi-container setup
├── package.json           # Node.js dependencies
└── tsconfig.json          # TypeScript configuration
```

## Development Mode

### Start Development Environment

```bash
# Build and start all services
docker-compose -f docker-compose.dev.yml up -d --build

# Or start in foreground to see logs
docker-compose -f docker-compose.dev.yml up --build
```

This will:
- Build the backend application using `Dockerfile.dev`
- Start PostgreSQL database on port `5432`
- Start backend API server on port `5000`
- Mount your local code for hot-reload development

### Access Development Container

```bash
# Enter the backend container
docker-compose -f docker-compose.dev.yml exec backend_app bash

# Inside container, you can run:
npm run dev          # Start development server (already running via CMD)
npm run build        # Build TypeScript to JavaScript
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
```

### View Logs

```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs

# Follow logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f backend_app
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Stop Development Environment

```bash
# Stop services
docker-compose -f docker-compose.dev.yml stop

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# Stop and remove containers with volumes
docker-compose -f docker-compose.dev.yml down -v
```

## Production Mode

### Build and Start Production Environment

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Or start in foreground to see logs
docker-compose -f docker-compose.prod.yml up --build
```

This will:
- Build the backend application using `Dockerfile.prod` (multi-stage build)
- Start PostgreSQL database on port `5432`
- Start backend API server on port `5000` (running compiled JavaScript)

### View Production Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Stop Production Environment

```bash
# Stop services
docker-compose -f docker-compose.prod.yml stop

# Stop and remove containers
docker-compose -f docker-compose.prod.yml down

# Stop and remove containers with volumes
docker-compose -f docker-compose.prod.yml down -v
```

## Database Management

### Run Migrations

**Development:**
```bash
docker-compose -f docker-compose.dev.yml exec backend_app npm run db:migrate
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
```

### Access PostgreSQL Database

```bash
# Development
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d mydb

# Production
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d mydb
```

### Database Credentials

- **Host**: `postgres` (from within Docker network) or `localhost` (from host)
- **Port**: `5432`
- **Database**: `mydb`
- **Username**: `postgres`
- **Password**: `password`
- **Connection String**: `postgresql://postgres:password@postgres:5432/mydb`

## API Endpoints

### Base Routes
- `GET /` - Home page / Health check

### Pet Routes (`/api/pet`)
- `GET /api/pet/:id` - Get pet by ID
- `POST /api/pet/create` - Create a new pet
  ```json
  {
    "name": "Cat",
    "breed": "Persian"
  }
  ```
- `DELETE /api/pet/:id/delete` - Delete pet by ID

### Pets Routes (`/api/pets`)
- `GET /api/pets` - Get all pets
- `POST /api/pets/seed-pets` - Seed 15 sample pets
- `DELETE /api/pets/delete-pets` - Delete all pets
- `DELETE /api/pets/truncate-pets` - Truncate pets table

### Example API Calls

```bash
# Get all pets
curl http://localhost:5000/api/pets

# Get pet by ID
curl http://localhost:5000/api/pet/1

# Create a pet
curl -X POST http://localhost:5000/api/pet/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Dog", "breed": "Golden Retriever"}'

# Seed pets
curl -X POST http://localhost:5000/api/pets/seed-pets

# Delete all pets
curl -X DELETE http://localhost:5000/api/pets/delete-pets
```

## Common Docker Commands

### Check Container Status

```bash
# Development
docker-compose -f docker-compose.dev.yml ps

# Production
docker-compose -f docker-compose.prod.yml ps
```

### Restart Services

```bash
# Development
docker-compose -f docker-compose.dev.yml restart

# Production
docker-compose -f docker-compose.prod.yml restart
```

### Rebuild Containers

```bash
# Development
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Port Already in Use

**Error**: `Bind for 0.0.0.0:5000 failed: port is already allocated`

**Solution**:
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# Linux/macOS
lsof -i :5000
```

### Container Won't Start

**Solution**:
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs backend_app

# Rebuild containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### Database Connection Failed

**Solution**:
```bash
# Ensure postgres container is running
docker-compose -f docker-compose.dev.yml ps

# Check database logs
docker-compose -f docker-compose.dev.yml logs postgres

# Restart database
docker-compose -f docker-compose.dev.yml restart postgres
```