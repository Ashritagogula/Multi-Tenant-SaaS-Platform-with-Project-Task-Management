# 📑 API Documentation
Multi-Tenant SaaS Platform

This document describes all backend APIs as defined in the Product Requirements Document (PRD).  
All endpoints follow REST principles and use JSON for request and response bodies.

---

## 🔐 Authentication Overview

- Authentication uses **JWT (JSON Web Tokens)**
- Token must be sent in request headers
- Token expiry: **24 hours**

```http
Authorization: Bearer <JWT_TOKEN>
```

# 🔑 AUTHENTICATION MODULE
## API 1: Tenant Registration
```http
POST /api/auth/register-tenant
```


Authentication: ❌ Not required

Request Body
```json
{
  "tenantName": "Test Company Alpha",
  "subdomain": "testalpha",
  "adminEmail": "admin@testalpha.com",
  "adminPassword": "TestPass@123",
  "adminFullName": "Alpha Admin"
}
```


Success Response (201)
```json
{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "uuid",
    "subdomain": "testalpha",
    "adminUser": {
      "id": "uuid",
      "email": "admin@testalpha.com",
      "fullName": "Alpha Admin",
      "role": "tenant_admin"
    }
  }
}

```

# API 2: User Login
```http
POST /api/auth/login
```


Authentication: ❌ Not required

Request Body
```json
{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}
```

Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@demo.com",
      "fullName": "Demo Admin",
      "role": "tenant_admin",
      "tenantId": "uuid"
    },
    "token": "jwt-token-string",
    "expiresIn": 86400
  }
}
```
# API 3: Get Current User
```http
GET /api/auth/me
```

Authentication: ✅ Required

Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "value",
    "fullName": "value",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "uuid",
      "name": "Demo Company",
      "subdomain": "demo",
      "subscriptionPlan": "pro",
      "maxUsers": 10,
      "maxProjects": 20
    }
  }
}
```
# API 4: Logout
```http
POST /api/auth/logout
```

Authentication: ✅ Required

Response
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

# TENANT MANAGEMENT MODULE
## API 5: Get Tenant Details
```http
GET /api/tenants/:tenantId
```

Authentication: ✅ Required

# API 6: Update Tenant
```http
PUT /api/tenants/:tenantId
```


Authentication: ✅ Required
Authorization: tenant_admin / super_admin

# API 7: List All Tenants
```http
GET /api/tenants
```

Authentication: ✅ Required
Authorization: super_admin only

# USER MANAGEMENT MODULE
## API 8: Add User to Tenant
```http
POST /api/tenants/:tenantId/users
```


Authentication: ✅ Required

Request Body
```json
{
  "email": "newuser@demo.com",
  "password": "NewUser@123",
  "fullName": "New User",
  "role": "user"
}
```
# API 9: List Tenant Users
```http
GET /api/tenants/:tenantId/users
```


Authentication: ✅ Required

# API 10: Update User
```http
PUT /api/users/:userId
```


Authentication: ✅ Required

# API 11: Delete User
```http
DELETE /api/users/:userId
```


Authentication: ✅ Required

# PROJECT MANAGEMENT MODULE
## API 12: Create Project
```http
POST /api/projects
```


Authentication: ✅ Required

## API 13: List Projects
```http
GET /api/projects
```


Authentication: ✅ Required

# API 14: Update Project
```http
PUT /api/projects/:projectId
```


Authentication: ✅ Required

# API 15: Delete Project
```http
DELETE /api/projects/:projectId
```


Authentication: ✅ Required

# TASK MANAGEMENT MODULE
## API 16: Create Task
```http
POST /api/projects/:projectId/tasks
```


Authentication: ✅ Required

# API 17: List Project Tasks
```http
GET /api/projects/:projectId/tasks
```


Authentication: ✅ Required

# API 18: Update Task Status
```http
PATCH /api/tasks/:taskId/status
```


Authentication: ✅ Required

# API 19: Update Task
```http
PUT /api/tasks/:taskId
```

Authentication: ✅ Required