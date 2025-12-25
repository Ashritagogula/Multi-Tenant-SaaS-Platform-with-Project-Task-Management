# System Architecture Design

---

## 1. System Architecture Diagram

The system architecture diagram represents a high-level view of how different components of the multi-tenant SaaS application interact with each other. It shows the flow of requests from the client to the backend and how authentication and data storage are handled.

### Components Overview

- **Client (Browser):**
  - Used by end users to access the application.
  - Sends HTTP requests to the frontend application.

- **Frontend Application:**
  - Built using a modern frontend framework.
  - Handles user interface, routing, and API communication.
  - Sends API requests to the backend server.

- **Backend API Server:**
  - Exposes RESTful APIs.
  - Handles authentication, authorization, and business logic.
  - Enforces tenant isolation and role-based access control.

- **Authentication Flow:**
  - User credentials are validated by the backend.
  - JWT tokens are issued upon successful authentication.
  - Tokens are sent with each subsequent request for authorization.

- **Database:**
  - Stores tenant, user, project, task, and subscription data.
  - Uses tenant identifiers to isolate data across organizations.

### Diagram File

- **File Path:** `docs/images/system-architecture.png`
- **Diagram Type:** High-level system architecture diagram
- **Includes:** Client, Frontend, Backend, Authentication flow, Database

---

## 2. Database Schema Design

The database schema defines how data is structured and related within the system. It ensures data integrity, scalability, and proper tenant isolation.

### Entity Relationship Diagram (ERD)

The ERD illustrates all database tables and their relationships.

#### Key Entities

- **Tenants**
  - tenant_id (Primary Key)
  - organization_name
  - subscription_plan

- **Users**
  - user_id (Primary Key)
  - tenant_id (Foreign Key)
  - role
  - email
  - password_hash

- **Projects**
  - project_id (Primary Key)
  - tenant_id (Foreign Key)
  - project_name

- **Tasks**
  - task_id (Primary Key)
  - project_id (Foreign Key)
  - assigned_user_id
  - status

- **Subscriptions**
  - subscription_id (Primary Key)
  - tenant_id (Foreign Key)
  - plan_type
  - limits

### Schema Design Highlights

- All tables include a **tenant_id** column to enforce data isolation.
- Foreign keys are used to maintain relationships between entities.
- Indexes are applied on tenant_id and frequently queried columns.
- Referential integrity is enforced through database constraints.

### Diagram File

- **File Path:** `docs/images/database-erd.png`
- **Diagram Type:** Entity Relationship Diagram
- **Highlights:** Foreign keys, indexes, tenant_id columns

---

## 3. API Architecture

The API architecture defines all backend endpoints exposed by the system. APIs are organized by functional modules and follow RESTful design principles.

---

### Authentication APIs

| Endpoint | Method | Authentication | Role Required |
|-------|--------|---------------|---------------|
| /auth/register | POST | No | Public |
| /auth/login | POST | No | Public |
| /auth/logout | POST | Yes | Any |

---

### Tenant APIs

| Endpoint | Method | Authentication | Role Required |
|--------|--------|---------------|---------------|
| /tenants/create | POST | Yes | Super Admin |
| /tenants/list | GET | Yes | Super Admin |
| /tenants/details | GET | Yes | Tenant Admin |

---

### User APIs

| Endpoint | Method | Authentication | Role Required |
|--------|--------|---------------|---------------|
| /users/create | POST | Yes | Tenant Admin |
| /users/list | GET | Yes | Tenant Admin |
| /users/update | PUT | Yes | Tenant Admin |
| /users/delete | DELETE | Yes | Tenant Admin |

---

### Project APIs

| Endpoint | Method | Authentication | Role Required |
|--------|--------|---------------|---------------|
| /projects/create | POST | Yes | Tenant Admin |
| /projects/list | GET | Yes | Any |
| /projects/update | PUT | Yes | Tenant Admin |
| /projects/delete | DELETE | Yes | Tenant Admin |

---

### Task APIs

| Endpoint | Method | Authentication | Role Required |
|--------|--------|---------------|---------------|
| /tasks/create | POST | Yes | Any |
| /tasks/assign | PUT | Yes | Tenant Admin |
| /tasks/update | PUT | Yes | Any |
| /tasks/list | GET | Yes | Any |

---

## Summary

This architecture design ensures a clear separation of responsibilities between system components. Tenant isolation, secure authentication, role-based access control, and scalable API design form the foundation of the multi-tenant SaaS platform.
