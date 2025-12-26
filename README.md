# 📘 Multi-Tenant SaaS Platform

## 🧩 Project Overview


**Multi-Tenant SaaS Platform** is a full-stack web application that supports multiple organizations (tenants) within a single system. Each tenant has isolated users, projects, and tasks while sharing the same infrastructure.

This project is designed for **students, junior developers, and evaluators** to understand real-world SaaS architecture using modern technologies.

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
## 🛠 Technology Stack Overview


### Frontend
```text
React 18
Vite
Axios
React Router DOM
```

## Backend
Node.js 18
Express.js
JWT Authentication
bcrypt

## Database
PostgreSQL 15

## Containerization
Docker
Docker Compose

# 🏗 Architecture Overview

The application follows a containerized multi-service architecture:

Browser
   |
Frontend (React)
   |
Backend (Node.js + Express)
   |
PostgreSQL Database



Each tenant is logically isolated using tenant_id across all core tables.

# Installation & Setup Guide

✅ Prerequisites
```text
Docker (v20+)
Docker Compose (v2+)
Git
```

## Local Setup Instructions
1️⃣ Clone the repository
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
```text
VITE_API_URL=http://localhost:5000/api
```

## Run Application with Docker
```text
Build containers
docker compose build
```

## Start containers
```text
docker compose up
```

## Database Initialization
```text

Migrations are executed automatically on backend startup

Seed data is inserted automatically after migrations

No manual commands are required.
```

## Application Access
```text
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
Health Check: http://localhost:5000/api/health
```

## API Documentation
```text
Main API Endpoints
Authentication
POST /api/auth/login
```

## Tenant Management
```text
POST /api/tenants
GET /api/tenants
```

## User Management
```text
GET /api/tenants/:tenantId/users
POST /api/tenants/:tenantId/users
```
## Project Management
```text
POST /api/projects
GET /api/projects
```
## Task Management
```text
POST /api/projects/:projectId/tasks
GET /api/projects/:projectId/tasks
```

## Features
- Multi-tenant architecture
- Role-based access
- Project & task management
## 📚 Learning Outcomes

Through this project, learners gain practical experience with:
- Designing and implementing multi-tenant SaaS architectures
- Applying role-based access control and tenant isolation
- Using JWT for secure authentication
- Managing projects and tasks in a real-world SaaS context
- Deploying full-stack applications using Docker and Docker Compose
## 📝 Final Notes

This project is structured to balance simplicity with real-world relevance. It serves as a strong foundation for understanding SaaS system design and can be extended with advanced features such as monitoring, rate limiting, and CI/CD integration.
