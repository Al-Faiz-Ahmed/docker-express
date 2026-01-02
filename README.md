# Pets API - Docker Project

A RESTful API for managing pets built with Express.js, TypeScript, Drizzle ORM, and PostgreSQL, containerized with Docker.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Docker Setup](#docker-setup)
- [Step-by-Step Instructions](#step-by-step-instructions)
- [API Endpoints](#api-endpoints)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

To verify your installations:

```bash
docker --version
docker-compose --version
git --version
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
├── drizzle/               # Database migrations
├── Dockerfile             # Backend container configuration
├── docker-compose.yml     # Multi-container setup
├── package.json           # Node.js dependencies
└── tsconfig.json          # TypeScript configuration
```

## Docker Setup

This project uses Docker Compose to orchestrate two containers:
- **Backend App**: Node.js/Express API server
- **PostgreSQL**: Database server

## Step-by-Step Instructions

### Step 1: Clone the Repository

If you haven't already, clone or navigate to the project directory:

```bash
cd /path/to/your/project
```

### Step 2: Check Docker and Docker Compose

Verify that Docker and Docker Compose are running:

```bash
# Check Docker daemon
docker ps

# Check Docker Compose
docker-compose --version
```

If Docker is not running, start it:
- **Linux**: `sudo systemctl start docker`
- **macOS/Windows**: Start Docker Desktop application

### Step 3: Build Docker Images

Build the Docker images for all services defined in `docker-compose.yml`:

```bash
docker-compose build
```

This command will:
- Build the backend application image (`backend_app_start:local`)
- Pull the PostgreSQL 16 image (if not already present)
- Install all Node.js dependencies

**Alternative: Build without cache** (if you encounter dependency issues):

```bash
docker-compose build --no-cache
```

### Step 4: Start All Services

Start all containers in detached mode (runs in background):

```bash
docker-compose up -d
```

**Or start in foreground** (to see logs):

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port `5432`
- Backend API server on port `5000`

### Step 5: Verify Containers are Running

Check the status of your containers:

```bash
docker-compose ps
```

You should see both containers with status "Up":
- `faizan_container` (backend)
- `my-postgres` (database)

**Alternative command:**

```bash
docker ps
```

### Step 6: View Container Logs

To see the logs from all services:

```bash
docker-compose logs
```

**View logs for specific service:**

```bash
# Backend logs
docker-compose logs backend_app

# Database logs
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f backend_app
```

### Step 7: Access the Backend Container

To execute commands inside the backend container:

```bash
docker-compose exec backend_app bash
```

Once inside, you can run:
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

### Step 8: Run Database Migrations

Execute database migrations inside the container:

```bash
# Option 1: Execute from outside container
docker-compose exec backend_app npm run db:migrate

# Option 2: Enter container first, then run
docker-compose exec backend_app bash
npm run db:migrate
```

### Step 9: Test the API

The API should now be accessible at:

- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/`

Test with curl:

```bash
curl http://localhost:5000/
```

Or open in your browser: `http://localhost:5000/`

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

## Database Management

### Access PostgreSQL Database

Connect to the PostgreSQL database:

```bash
# Using docker-compose
docker-compose exec postgres psql -U postgres -d mydb

# Or using docker directly
docker exec -it my-postgres psql -U postgres -d mydb
```

### Database Credentials

- **Host**: `postgres` (from within Docker network) or `localhost` (from host)
- **Port**: `5432`
- **Database**: `mydb`
- **Username**: `postgres`
- **Password**: `password`
- **Connection String**: `postgresql://postgres:password@postgres:5432/mydb`

### Useful Database Commands

```sql
-- List all tables
\dt

-- Describe pets table
\d pets

-- View all pets
SELECT * FROM pets;

-- Count pets
SELECT COUNT(*) FROM pets;
```

## Docker Commands Reference

### Starting and Stopping

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, and networks
docker-compose down -v
```

### Rebuilding

```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Container Management

```bash
# View running containers
docker-compose ps

# View all containers (including stopped)
docker-compose ps -a

# Restart a specific service
docker-compose restart backend_app

# Stop a specific service
docker-compose stop backend_app

# Start a specific service
docker-compose start backend_app
```

### Logs and Debugging

```bash
# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# Execute command in container
docker-compose exec backend_app npm run dev
```

### Cleanup

```bash
# Remove stopped containers
docker-compose rm

# Remove containers and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Bind for 0.0.0.0:5000 failed: port is already allocated`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Stop the process or change port in docker-compose.yml
```

### Issue: Container Won't Start

**Solution**:
```bash
# Check logs
docker-compose logs backend_app

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Database Connection Failed

**Solution**:
```bash
# Ensure postgres container is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Issue: Dependencies Not Installing

**Solution**:
```bash
# Remove node_modules volume and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Changes Not Reflecting

**Solution**:
- The project uses volume mounting, so changes should reflect automatically
- If not, restart the backend container:
  ```bash
  docker-compose restart backend_app
  ```

### Issue: Permission Denied

**Solution** (Linux):
```bash
# Add your user to docker group
sudo usermod -aG docker $USER
# Log out and log back in
```

## Development Workflow

1. **Start services**: `docker-compose up -d`
2. **Enter container**: `docker-compose exec backend_app bash`
3. **Start dev server**: `npm run dev`
4. **Make changes** (files are mounted, changes reflect automatically)
5. **Run migrations**: `npm run db:migrate`
6. **Test API**: Use curl or Postman

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

- `BACKEND_PORT=5000` - Backend server port
- `DATABASE_URL=postgresql://postgres:password@postgres:5432/mydb` - Database connection string
- `CHOKIDAR_USEPOLLING=true` - File watching for hot reload
- `CHOKIDAR_INTERVAL=1000` - File watching interval

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Express.js Documentation](https://expressjs.com/)


