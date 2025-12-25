-- =========================================
-- SEED DATA FOR MULTI-TENANT SAAS PLATFORM
-- =========================================
-- Password for ALL users below:
-- Email login password = Admin@123
-- (bcrypt hash used everywhere)

-- =========================================
-- 1. SUPER ADMIN (NO TENANT)
-- =========================================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'superadmin@system.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8zGZQyZ0Jp9xJZK8Fzq1jzR5xUu9eG',
    'System Super Admin',
    'super_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- =========================================
-- 2. SAMPLE TENANT
-- =========================================

INSERT INTO tenants (
    id,
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects,
    created_at,
    updated_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Demo Company',
    'demo',
    'active',
    'pro',
    10,
    10,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- =========================================
-- 3. TENANT ADMIN
-- =========================================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'admin@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8zGZQyZ0Jp9xJZK8Fzq1jzR5xUu9eG',
    'Demo Tenant Admin',
    'tenant_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- =========================================
-- 4. REGULAR USERS
-- =========================================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES
(
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'user1@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8zGZQyZ0Jp9xJZK8Fzq1jzR5xUu9eG',
    'Demo User One',
    'user',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'user2@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8zGQyZ0Jp9xJZK8Fzq1jzR5xUu9eG',
    'Demo User Two',
    'user',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- =========================================
-- 5. PROJECT
-- =========================================

INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by,
    created_at,
    updated_at
) VALUES (
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Website Redesign',
    'Redesign company website',
    'active',
    '33333333-3333-3333-3333-333333333333',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- =========================================
-- 6. TASK
-- =========================================

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    due_date,
    created_at,
    updated_at
) VALUES (
    '88888888-8888-8888-8888-888888888888',
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Design homepage',
    'Create homepage UI',
    'todo',
    'high',
    '44444444-4444-4444-4444-444444444444',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- =========================================
-- END SEED
-- =========================================
