# 📘 Multi-Tenant SaaS Platform

## 🧩 Project Description

**Multi-Tenant SaaS Platform** is a full-stack web application designed to support multiple organizations (tenants) within a single system. Each tenant operates in isolation while sharing a common infrastructure.

This project is intended for **students, junior developers, and evaluators** to understand real-world SaaS architecture using modern technologies.

---

## ✨ Features

- Multi-tenant architecture with tenant isolation
- Tenant registration with unique subdomain
- Role-based access (Super Admin, Tenant Admin, User)
- Secure authentication using JWT
- Automatic database migrations on startup
- Automatic database seeding
- Project management per tenant
- Task management with status and priority
- Dockerized full-stack application
- Health check endpoint

---

## 🛠 Technology Stack

### Frontend
```text
React 18
Vite
Axios
React Router DOM
```

## Backend
```text
Node.js 18
Express.js
JWT Authentication
bcrypt
```

## Database
```text
PostgreSQL 15
```

## Containerization
```text
Docker
Docker Compose
```

## 🏗 Architecture Overview

```text
The application follows a containerized multi-service architecture:
```

```text
Browser
   |
Frontend (React)
   |
Backend (Node.js + Express)
   |
PostgreSQL Database
```

Each tenant is logically isolated using tenant_id across all core tables.

## ⚙️ Installation & Setup
### Prerequisites
```text
Docker (v20+)
Docker Compose (v2+)
Git
```

## Local Setup Instructions
### Clone the repository
```text
git clone <repository-url>
cd Multi-Tenant_SaaS_Platform
```

## Backend Environment Variables (backend/.env)
```text
DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Frontend Environment Variables (frontend/.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Run Application with Docker
### Build containers
```bash
docker compose build
```
### Start containers
```bash
docker compose up
```

## Database Initialization

- Migrations are executed automatically on backend startup

- Seed data is inserted automatically after migrations

- No manual commands are required.

## Application Access
```text
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
Health Check: http://localhost:5000/api/health
```

## API Documentation
### Main API Endpoints
## Authentication
POST /api/auth/login

## Tenant Management
POST /api/tenants
GET /api/tenants

## User Management
GET /api/tenants/:tenantId/users
POST /api/tenants/:tenantId/users

## Project Management
POST /api/projects
GET /api/projects

## Task Management
POST /api/projects/:projectId/tasks
GET /api/projects/:projectId/tasks