# Multi-Tenancy Analysis

Multi-tenancy is a core concept in Software as a Service (SaaS) applications where a single application instance serves multiple organizations, known as tenants. Each tenant must have complete data isolation so that no organization can access another organization’s data. Choosing the correct multi-tenancy strategy is critical for security, scalability, performance, and maintenance.

There are three common multi-tenancy approaches used in modern SaaS systems:

- Shared Database with Shared Schema

- Shared Database with Separate Schema

- Separate Database per Tenant

Each approach has its own advantages and disadvantages.

## 1. Shared Database + Shared Schema (with tenant_id column)

In this approach, all tenants share the same database and the same set of tables. Every table contains a tenant_id column, which is used to identify which tenant owns each record. All queries must include a condition on tenant_id to ensure data isolation.

**How it works** :
When a user logs in, their tenant ID is extracted from the authentication token. Every database query filters data using this tenant ID. For example, when fetching projects, the query retrieves only projects that match the logged-in user’s tenant ID.

Advantages:

- Low infrastructure cost because only one database is required

- Easy to onboard new tenants without creating new schemas or databases

- Simplified database maintenance and backups

- Efficient resource usage for small and medium-scale SaaS applications

Disadvantages:

- Strong reliance on correct query filtering

- Higher risk if tenant filtering is accidentally missed

- Complex access control logic in application code

- Harder to perform tenant-specific database optimizations

## 2. Shared Database + Separate Schema (per tenant)

In this approach, all tenants share the same database server, but each tenant has its own database schema. Each schema contains its own tables for users, projects, and tasks.

**How it works:**
When a tenant is created, a new schema is generated. All queries are executed against that tenant’s schema. This provides a logical separation of data while still sharing the same database server.

Advantages:

- Better data isolation compared to shared schema

- Reduced risk of accidental data leakage

- Easier to run tenant-specific migrations

- Better organization of tenant data

Disadvantages:

- Schema management becomes complex as tenants grow

- Database migrations must be applied to multiple schemas

- Not well suited for thousands of tenants

- Higher operational overhead than shared schema

## 3. Separate Database per Tenant

In this approach, each tenant has its own completely separate database. The application connects to a different database based on the tenant.

**How it works:**
When a tenant registers, a new database is created. The application dynamically connects to the tenant’s database during runtime.

Advantages:

- Strongest data isolation and security

- Easy to apply tenant-specific database tuning

- Suitable for high-compliance systems

- Reduced risk of cross-tenant data exposure

Disadvantages:

- High infrastructure and maintenance cost

- Difficult to scale with many tenants

- Complex connection management

- Slower onboarding for new tenants

| Approach | Pros | Cons |
|--------|------|------|
| Shared DB + Shared Schema | Low cost, easy scaling, simple backups | Risk of data leakage if queries fail |
| Shared DB + Separate Schema | Better isolation, organized data | Schema management complexity |
| Separate Database | Maximum security, strong isolation | High cost, complex operations |

### Chosen Approach & Justification

For this project, Shared Database with Shared Schema (tenant_id column) is the most suitable approach. This project focuses on learning multi-tenancy concepts, RBAC, and SaaS architecture while maintaining simplicity. This approach is widely used by many successful SaaS products because it is cost-effective, scalable, and easy to manage when implemented with strict access control.

With proper middleware enforcement and tenant-based filtering, data isolation can be reliably achieved. This approach also simplifies Docker deployment and development workflows.
---
## Technology Stack Justification

Selecting an appropriate technology stack is essential for building a scalable, secure, and maintainable multi-tenant SaaS application. The chosen technologies were evaluated based on performance, ecosystem support, ease of development, scalability, and suitability for a production-ready system.

### Backend Framework

Chosen Technology: Node.js with Express.js

Node.js is selected as the backend runtime due to its non-blocking, event-driven architecture, which makes it well-suited for handling multiple concurrent API requests in a SaaS environment. Express.js provides a lightweight and flexible framework for building RESTful APIs, allowing clear separation of routes, middleware, and business logic. This flexibility is important for implementing authentication, role-based access control, and tenant isolation middleware.

### Alternatives Considered:

Django (Python): Provides many built-in features but is more opinionated and heavier for API-only services.

Spring Boot (Java): Highly scalable but introduces additional complexity and longer development time.

Node.js with Express.js was chosen for its simplicity, speed of development, and large ecosystem of middleware and libraries.

### Frontend Framework

Chosen Technology: React.js

React.js is chosen for building the frontend because of its component-based architecture, which promotes reusable UI components and clean state management. It is particularly suitable for dashboard-style applications such as project and task management systems. React’s strong community support and extensive ecosystem enable rapid development and easy integration with REST APIs.

### Alternatives Considered:

Angular: A complete framework with strong tooling but a steeper learning curve and more boilerplate code.

Vue.js: Simpler syntax but a smaller ecosystem compared to React.

React was selected due to its flexibility, scalability, and widespread industry adoption.

### Database

Chosen Technology: PostgreSQL

PostgreSQL is selected as the primary database due to its strong support for relational data, data integrity, and transactional consistency. It supports advanced features such as indexing, constraints, and JSON storage, making it suitable for multi-tenant architectures. PostgreSQL also supports schema-based organization, which allows flexibility if future architectural changes are required.

### Alternatives Considered:

MySQL: Reliable but offers fewer advanced features compared to PostgreSQL.

MongoDB: Schema-less and flexible but less suitable for transactional systems requiring strong consistency.

PostgreSQL was chosen for its reliability, scalability, and robustness.

Authentication Method

### Chosen Technology: JSON Web Tokens (JWT)

JWT is chosen for authentication because it enables stateless and scalable authentication. Tokens securely store user identity, role information, and tenant identifiers, which are required for enforcing authorization and data isolation. JWT works efficiently with RESTful APIs and is suitable for distributed systems.

### Alternatives Considered:

Session-based authentication: Requires server-side session storage and does not scale well in distributed systems.

OAuth 2.0: Powerful but unnecessary complex for this project’s requirements.

JWT provides a balance between security, simplicity, and scalability.

### Deployment Platforms

Chosen Technologies: Docker and Docker Compose

Docker is chosen to containerize the application, ensuring consistent environments across development, testing, and production. Docker Compose simplifies running multiple services such as the backend, frontend, and database together. This approach improves reproducibility and reduces deployment errors.

### Alternatives Considered:

Manual server deployment: Error-prone and difficult to maintain.

Virtual machines: Heavier and slower compared to containers.

Docker-based deployment was selected for its efficiency, portability, and industry-standard practices.

**Conclusion**

The chosen technology stack provides a balanced combination of scalability, security, performance, and ease of development. Each technology was selected after considering viable alternatives and evaluating project-specific requirements. This stack supports the development of a production-ready multi-tenant SaaS application while remaining flexible for future enhancements.


### 1. Explain WHY each technology was chosen

For every technology, I explicitly explained why it was selected.

### Backend (Node.js + Express)

WHY given as:

- Non-blocking, event-driven architecture

- Handles concurrent API requests well

- Lightweight and flexible for REST APIs

- Large ecosystem and fast development

This explains why it was chosen

### Frontend (React.js)

WHY given as:

- Component-based architecture

- Reusable UI components

- Suitable for dashboard-style SaaS apps

- Strong community and ecosystem

This explains why it was chosen

### Database (PostgreSQL)

WHY given as:

- Strong relational support

- Data integrity and transactions

- Advanced features (indexes, schemas)

- Suitable for multi-tenant systems

This explains why it was chosen

### Authentication (JWT)

WHY given as:

- Stateless authentication

- Scales well with APIs

- Can carry tenant & role info

- Ideal for distributed systems

This explains why it was chosen

### Deployment (Docker + Docker Compose)

WHY given as:

- Consistent environments

- Easy multi-service setup

- Reduced deployment errors

- Industry standard

This explains why it was chosen

## 2. Mention alternatives considered

For every technology, I also mentioned alternatives.

### Backend – Alternatives

Django (Python)

Spring Boot (Java)

### Frontend – Alternatives

Angular

Vue.js

### Database – Alternatives

MySQL

MongoDB

### Authentication – Alternatives

Session-based authentication

OAuth 2.0

### Deployment – Alternatives

Manual server deployment

Virtual machines


# Security Considerations

**1. What are the five key security measures required for a multi-tenant system?**

Multi-tenant systems require strong security controls because multiple organizations share the same application infrastructure. The first important security measure is tenant data isolation, which ensures that data belonging to one organization cannot be accessed by another. The second measure is secure authentication, which verifies user identity before granting access to the system. The third measure is role-based authorization, which restricts user actions based on their assigned roles. The fourth measure is secure password storage, where passwords are hashed instead of being stored in plain text. The fifth measure is API protection, which secures backend endpoints against unauthorized access and misuse. Together, these measures form a strong security foundation for multi-tenant SaaS applications.

**2. How is data isolation achieved in a multi-tenant system?**

Data isolation is achieved by associating every tenant with a unique identifier, commonly referred to as tenant_id. This identifier is linked to all data entities such as users, projects, and tasks. When a user authenticates, their tenant ID is included in the authentication token. Every incoming request carries this tenant information, and all database queries are filtered using the tenant ID. This ensures that users can only access data that belongs to their own organization. By enforcing tenant-based filtering at both the application and database levels, the system prevents accidental or malicious cross-tenant data access.

**3. What authentication and authorization approach is used?**

Authentication and authorization are implemented using a token-based security model combined with Role-Based Access Control (RBAC). Authentication verifies the identity of users through secure login credentials and issues a token upon successful login. Authorization determines what actions a user is allowed to perform after authentication. Roles such as owner, admin, and member are assigned to users, and each role has predefined permissions. This approach ensures that users can only access features and perform actions that align with their responsibilities, improving overall system security.

**4. What password hashing strategy is followed?**

Passwords are protected using secure cryptographic hashing techniques. Instead of storing passwords in plain text, the system hashes passwords using algorithms such as bcrypt before storing them in the database. Hashing converts the original password into an irreversible encrypted format. During login, the entered password is hashed again and compared with the stored hash. This strategy ensures that even if the database is compromised, attackers cannot retrieve original user passwords, significantly reducing the risk of credential theft.

**5. What API security measures are implemented?**

API security measures are implemented to protect backend services from unauthorized access and attacks. All sensitive API endpoints require valid authentication tokens, and unauthorized requests are immediately rejected. Input validation is applied to all API requests to prevent injection attacks and malformed data. Additionally, rate limiting can be used to control the number of requests made by a user within a given time frame, reducing the risk of abuse and denial-of-service attacks. These measures ensure that the APIs remain secure, reliable, and resilient.