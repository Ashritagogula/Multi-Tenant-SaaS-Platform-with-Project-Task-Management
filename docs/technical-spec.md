# Technical Specification

---

## 1. Project Structure

This section defines the complete folder structure for both backend and frontend components of the Multi-Tenant SaaS Platform. The structure is designed to ensure scalability, maintainability, and clear separation of concerns.

---

### 1.1 Backend Folder Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   └── Handles request logic and response formatting
│   ├── models/
│   │   └── Defines database schemas and ORM models
│   ├── routes/
│   │   └── Defines API routes and endpoint mappings
│   ├── middleware/
│   │   └── Contains authentication, authorization, and tenant isolation logic
│   ├── utils/
│   │   └── Helper functions and reusable utilities
│   ├── config/
│   │   └── Database and environment configuration files
│   └── app.js
│       └── Main application setup and middleware registration
├── migrations/
│   └── Database migration files
├── tests/
│   └── Unit and integration tests
├── package.json
└── server.js
    └── Application entry point

```
## Purpose of Major Backend Folders

*controllers/*
- Handles incoming requests, executes business logic, and sends responses.

*models/*
- Defines database structure, relationships, and tenant-specific entities.

*routes/*
- Maps API endpoints to their corresponding controllers.

*middleware/*
- Implements JWT authentication, RBAC, and tenant data isolation.

*utils/*
- Stores reusable helper functions and common logic.

*config/*
- Manages database connections and environment-specific configurations.

migrations/
- Handles database schema changes over time.

tests/
- Contains automated test cases to verify application behavior.


## 1.2 Frontend Folder Structure
```text
frontend/
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   ├── pages/
│   │   └── Application pages such as Login, Dashboard, Projects
│   ├── services/
│   │   └── API service calls and HTTP clients
│   ├── context/
│   │   └── Global state management and authentication context
│   ├── utils/
│   │   └── Utility functions and helpers
│   ├── styles/
│   │   └── Global and component-specific styles
│   ├── App.js
│   └── index.js
├── public/
│   └── Static assets
└── package.json

``` 
## Purpose of Major Frontend Folders

*components/*
- Reusable UI elements such as buttons, modals, and forms.

*pages/*
- Full-page components representing different routes.

*services/*
- Handles API interactions with the backend.

*context/*
- Manages global state such as authentication and user data.

*utils/*
- Common helper functions used across the frontend.

*styles/*
- CSS or styling resources.



2. Development Setup Guide

This section explains how to set up the project locally for development and testing.

## 2.1 Prerequisites

Ensure the following software is installed:

Node.js: v18 or higher

npm: v9 or higher

Git: Latest version

PostgreSQL: v14 or higher

## 2.2 Environment Variables

Create a .env file in the backend root directory with the following variables:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/saas_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development

```


### 2.3 Installation Steps

Navigate to the project root directory:
```bash
cd Multi-Tenant_SaaS_Platform
```bash

Install backend dependencies:
```bash
cd backend
npm install
```bash


Install frontend dependencies:
```bash
cd ../frontend
npm install
```

2.4 Running the Application Locally

Start Backend Server:
```bash
cd backend
npm run dev
```

Start Frontend Application:
```bash
cd frontend
npm start
```

The frontend will run on http://localhost:3000 and the backend API on http://localhost:5000.

2.5 Running Tests

Backend Tests:
```bash
cd backend
npm test
```

Frontend Tests:
```bash
cd frontend
npm test
```